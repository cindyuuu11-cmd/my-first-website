import { atom, computed } from 'nanostores';
import { INITIAL_STUDENTS } from '../data/mockStudents';
import {
    dashboardRangeStore,
    customStartDateStore,
    customEndDateStore,
    searchQueryStore,
    showCheckInModalStore,
    showPaymentModalStore,
    showAddStudentModalStore,
    showRenewModalStore,
    showEditStudentModalStore,
    selectedStudentStore,
    selectedInstallmentStore,
    paymentFormStore,
    newStudentFormStore,
    renewFormStore,
    editStudentFormStore
} from './uiStore';

// Initialize with mock data
export const studentsStore = atom(INITIAL_STUDENTS);

// Handle Local Storage Hydration (Client-side only)
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('fitness_crm_students');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                studentsStore.set(parsed);
            }
        } catch (e) {
            console.error("Local storage load failed", e);
        }
    }

    // Subscribe to changes and save to local storage
    studentsStore.subscribe((val) => {
        localStorage.setItem('fitness_crm_students', JSON.stringify(val));
    });
}

// Computed stats for Dashboard
export const dashboardStatsStore = computed(
    [studentsStore, dashboardRangeStore, customStartDateStore, customEndDateStore],
    (students, dashboardRange, customStartDate, customEndDate) => {
        let startLimit = new Date();
        let endLimit = new Date();
        endLimit.setHours(23, 59, 59, 999);

        if (dashboardRange === 'day') {
            startLimit.setHours(0, 0, 0, 0);
        } else if (dashboardRange === 'week') {
            startLimit.setDate(startLimit.getDate() - 7);
            startLimit.setHours(0, 0, 0, 0);
        } else if (dashboardRange === 'month') {
            startLimit.setMonth(startLimit.getMonth() - 1);
            startLimit.setHours(0, 0, 0, 0);
        } else if (dashboardRange === 'custom') {
            startLimit = new Date(customStartDate);
            startLimit.setHours(0, 0, 0, 0);
            endLimit = new Date(customEndDate);
            endLimit.setHours(23, 59, 59, 999);
        }

        let totalRevenue = 0;
        let totalLessonsCount = 0;
        let totalPending = 0;

        students.forEach(s => {
            // Calculate revenue
            s.paymentHistory?.forEach(p => {
                const pDate = new Date(p.date);
                if (pDate >= startLimit && pDate <= endLimit) totalRevenue += p.amount;
            });
            // Calculate lessons
            s.checkInHistory?.forEach(h => {
                const hDate = new Date(h.date);
                if (hDate >= startLimit && hDate <= endLimit) totalLessonsCount += 1;
            });
            // Calculate pending (Global context for Dashboard/Billing)
            const pendingInstallments = s.installments?.filter(i => i.status === '待繳費') || [];
            pendingInstallments.forEach(i => totalPending += i.amount);
            if (s.contractType === '先上課後結算') {
                totalPending += s.usedLessons * s.pricePerLesson - s.paidAmount;
            }
        });

        return { totalRevenue, totalLessonsCount, totalPending };
    }
);

export const filteredStudentsStore = computed(
    [studentsStore, searchQueryStore],
    (students, searchQuery) => {
        return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
);

// Actions
export function addStudent() {
    const newStudentForm = newStudentFormStore.get();
    const students = studentsStore.get();
    const todayStr = new Date().toISOString().split('T')[0];

    const totalAmount = newStudentForm.contractType === '先上課後結算' ? 0 : newStudentForm.totalLessons * newStudentForm.pricePerLesson;
    const installments = [];

    if (newStudentForm.contractType === '預付 - 分期付款') {
        const perAmount = totalAmount / newStudentForm.installmentCount;
        for (let i = 1; i <= newStudentForm.installmentCount; i++) {
            installments.push({
                id: `inst_${Date.now()}_${i}`,
                period: i,
                amount: perAmount,
                dueDate: todayStr,
                status: '待繳費',
                paidDate: '',
                method: '',
                lastFive: ''
            });
        }
    } else if (newStudentForm.contractType === '預付 - 一次付清') {
        installments.push({
            id: `inst_${Date.now()}_1`,
            period: 1,
            amount: totalAmount,
            dueDate: todayStr,
            status: '待繳費',
            paidDate: '',
            method: '',
            lastFive: ''
        });
    }

    const newStudent = {
        id: Date.now().toString(),
        name: newStudentForm.name,
        phone: newStudentForm.phone,
        memo: newStudentForm.memo,
        contractPhoto: newStudentForm.contractPhoto, // Base64 string
        contractType: newStudentForm.contractType,
        totalLessons: parseInt(newStudentForm.totalLessons, 10),
        usedLessons: 0,
        paidAmount: 0,
        totalAmount: totalAmount,
        status: '進行中',
        joinDate: todayStr,
        expiryDate: '2024-12-31',
        pricePerLesson: parseInt(newStudentForm.pricePerLesson, 10),
        installments,
        checkInHistory: [],
        paymentHistory: []
    };

    studentsStore.set([newStudent, ...students]);
    showAddStudentModalStore.set(false);
}

export function deleteStudent(studentId) {
    if (confirm("確定要刪除這位學員嗎？刪除後無法恢復。")) {
        studentsStore.set(studentsStore.get().filter(s => s.id !== studentId));
        showEditStudentModalStore.set(false);
    }
}

export function addHistoricalCheckIn() {
    const selectedStudent = selectedStudentStore.get();
    if (!selectedStudent) return;

    const form = editStudentFormStore.get();
    if (!form.date) return alert("請填寫日期");

    studentsStore.set(studentsStore.get().map(s => {
        if (s.id === selectedStudent.id) {
            return {
                ...s,
                usedLessons: s.usedLessons + 1,
                checkInHistory: [{ id: Date.now().toString(), date: form.date, note: form.note || '歷史紀錄' }, ...(s.checkInHistory || [])]
            };
        }
        return s;
    }));

    // reset form note
    editStudentFormStore.set({ ...form, note: '一般訓練' });
    showEditStudentModalStore.set(false);
}

export function renewCourse() {
    const selectedStudent = selectedStudentStore.get();
    if (!selectedStudent) return;

    const renewForm = renewFormStore.get();
    const todayStr = new Date().toISOString().split('T')[0];
    const newLessons = parseInt(renewForm.addLessons, 10);
    const newTotalAmount = renewForm.contractType === '先上課後結算' ? 0 : newLessons * renewForm.pricePerLesson;
    const newInstallments = [];

    if (renewForm.contractType === '預付 - 分期付款') {
        const perAmount = newTotalAmount / renewForm.installmentCount;
        for (let i = 1; i <= renewForm.installmentCount; i++) {
            newInstallments.push({
                id: `inst_renew_${Date.now()}_${i}`,
                period: `續-${i}`,
                amount: perAmount,
                dueDate: todayStr,
                status: '待繳費',
                paidDate: '',
                method: '',
                lastFive: ''
            });
        }
    } else if (renewForm.contractType === '預付 - 一次付清') {
        newInstallments.push({
            id: `inst_renew_${Date.now()}_1`,
            period: '續-全額',
            amount: newTotalAmount,
            dueDate: todayStr,
            status: '待繳費',
            paidDate: '',
            method: '',
            lastFive: ''
        });
    }

    studentsStore.set(studentsStore.get().map(s => {
        if (s.id === selectedStudent.id) {
            return {
                ...s,
                totalLessons: s.totalLessons + newLessons,
                totalAmount: s.totalAmount + newTotalAmount,
                contractType: renewForm.contractType,
                installments: [...s.installments, ...newInstallments]
            };
        }
        return s;
    }));

    selectedStudentStore.set({
        ...selectedStudent,
        totalLessons: selectedStudent.totalLessons + newLessons,
        totalAmount: selectedStudent.totalAmount + newTotalAmount,
    });

    showRenewModalStore.set(false);
}

export function checkInStudent(studentId) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);

    studentsStore.set(studentsStore.get().map(s => {
        if (s.id === studentId) {
            return {
                ...s,
                usedLessons: s.usedLessons + 1,
                checkInHistory: [{ id: Date.now().toString(), date: dateStr, note: '一般簽到訓練' }, ...(s.checkInHistory || [])]
            };
        }
        return s;
    }));
    showCheckInModalStore.set(false);
}

export function confirmPayment() {
    const selectedStudent = selectedStudentStore.get();
    if (!selectedStudent) return;

    const paymentForm = paymentFormStore.get();
    const selectedInstallment = selectedInstallmentStore.get();
    const paymentDate = paymentForm.paidDate || new Date().toISOString().split('T')[0];

    studentsStore.set(studentsStore.get().map(s => {
        if (s.id === selectedStudent.id) {
            const updatedInstallments = s.installments.map(inst => {
                if (selectedInstallment && inst.id === selectedInstallment.id) {
                    return { ...inst, status: '已繳費', paidDate: paymentDate, method: paymentForm.method, lastFive: paymentForm.lastFive };
                }
                return inst;
            });

            const newPaidAmount = s.paidAmount + Number(paymentForm.amount);
            const newPaymentHistory = [{
                id: Date.now().toString(),
                date: paymentDate,
                amount: Number(paymentForm.amount),
                method: paymentForm.method,
                lastFive: paymentForm.lastFive
            }, ...(s.paymentHistory || [])];

            return {
                ...s,
                paidAmount: newPaidAmount,
                paymentHistory: newPaymentHistory,
                installments: updatedInstallments
            };
        }
        return s;
    }));

    showPaymentModalStore.set(false);
}

export function exportToCSV() {
    const students = studentsStore.get();
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel encoding UTF-8 correctly
    csvContent += "ID,姓名,電話,合約類型,總堂數,已用堂數,剩餘堂數,總金額,已付金額,待付金額,備註\n";

    students.forEach(s => {
        const remaining = s.contractType === '先上課後結算' ? '-' : (s.totalLessons - s.usedLessons);
        let pending = 0;
        if (s.contractType === '先上課後結算') pending = (s.usedLessons * s.pricePerLesson) - s.paidAmount;
        else pending = s.totalAmount - s.paidAmount;

        const phone = s.phone || '';
        const memo = (s.memo || '').replace(/,/g, '，').replace(/\n/g, ' '); // avoid CSV break

        const row = `${s.id},${s.name},${phone},${s.contractType},${s.totalLessons},${s.usedLessons},${remaining},${s.totalAmount},${s.paidAmount},${Math.max(0, pending)},${memo}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fitness_crm_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

