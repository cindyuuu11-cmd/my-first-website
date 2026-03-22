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
    selectedStudentStore,
    selectedInstallmentStore,
    paymentFormStore,
    newStudentFormStore,
    renewFormStore
} from './uiStore';

export const studentsStore = atom(INITIAL_STUDENTS);

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

        students.forEach(s => {
            s.paymentHistory?.forEach(p => {
                const pDate = new Date(p.date);
                if (pDate >= startLimit && pDate <= endLimit) totalRevenue += p.amount;
            });
            s.checkInHistory?.forEach(h => {
                const hDate = new Date(h.date);
                if (hDate >= startLimit && hDate <= endLimit) totalLessonsCount += 1;
            });
        });

        return { totalRevenue, totalLessonsCount };
    }
);

// Computed filtered students
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
        contractType: newStudentForm.contractType,
        totalLessons: parseInt(newStudentForm.totalLessons, 10),
        usedLessons: 0,
        paidAmount: 0,
        totalAmount: totalAmount,
        status: '進行中',
        joinDate: todayStr,
        expiryDate: '2024-12-31', // Mock expiry for now
        pricePerLesson: parseInt(newStudentForm.pricePerLesson, 10),
        installments,
        checkInHistory: [],
        paymentHistory: []
    };

    studentsStore.set([...students, newStudent]);
    showAddStudentModalStore.set(false);
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
    const now = new Date().toISOString().split('T')[0];

    studentsStore.set(studentsStore.get().map(s => {
        if (s.id === selectedStudent.id) {
            const updatedInstallments = s.installments.map(inst => {
                if (selectedInstallment && inst.id === selectedInstallment.id) {
                    return { ...inst, status: '已繳費', paidDate: now, method: paymentForm.method, lastFive: paymentForm.lastFive };
                }
                return inst;
            });

            const newPaidAmount = s.paidAmount + Number(paymentForm.amount);
            const newPaymentHistory = [{
                id: Date.now().toString(),
                date: now,
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
