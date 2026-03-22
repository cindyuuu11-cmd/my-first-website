import { atom } from 'nanostores';

export const activeTabStore = atom('dashboard'); // 'dashboard', 'students', 'billing', 'details'
export const selectedStudentStore = atom(null);
export const selectedInstallmentStore = atom(null);

export const searchQueryStore = atom('');
export const dashboardRangeStore = atom('month');

const todayStr = new Date().toISOString().split('T')[0];
const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

export const customStartDateStore = atom(firstDayOfMonth);
export const customEndDateStore = atom(todayStr);

export const showCheckInModalStore = atom(false);
export const showPaymentModalStore = atom(false);
export const showAddStudentModalStore = atom(false);
export const showRenewModalStore = atom(false);

export const paymentFormStore = atom({ amount: '', method: '現金', lastFive: '' });
export const newStudentFormStore = atom({
    name: '',
    contractType: '預付 - 一次付清',
    totalLessons: 10,
    pricePerLesson: 1200,
    installmentCount: 1,
    expiryMonths: 6
});

export const renewFormStore = atom({
    contractType: '預付 - 一次付清',
    addLessons: 10,
    pricePerLesson: 1200,
    installmentCount: 1,
    expiryMonths: 6
});
