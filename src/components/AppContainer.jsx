import React from 'react';
import { useStore } from '@nanostores/react';
import { activeTabStore } from '../store/uiStore';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { DashboardView } from './DashboardView';
import { StudentsView } from './StudentsView';
import { BillingView } from './BillingView';
import { StudentDetailsView } from './StudentDetailsView';
import { AddStudentModal } from './Modals/AddStudentModal';
import { CheckInModal } from './Modals/CheckInModal';
import { PaymentModal } from './Modals/PaymentModal';
import { RenewModal } from './Modals/RenewModal';

export const AppContainer = () => {
    const activeTab = useStore(activeTabStore);

    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans select-none pb-24">
            <TopNav />

            <main className="max-w-md mx-auto relative">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'students' && <StudentsView />}
                {activeTab === 'billing' && <BillingView />}
                {activeTab === 'details' && <StudentDetailsView />}
            </main>

            <BottomNav />

            {/* Modals */}
            <AddStudentModal />
            <CheckInModal />
            <PaymentModal />
            <RenewModal />
        </div>
    );
};
