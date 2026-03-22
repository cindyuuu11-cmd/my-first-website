import React from 'react';
import { Home, Users, CreditCard } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { activeTabStore, selectedStudentStore } from '../store/uiStore';

export const BottomNav = () => {
    const activeTab = useStore(activeTabStore);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 flex justify-around items-center z-50 pb-8 sm:pb-3">
            <button
                onClick={() => activeTabStore.set('dashboard')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-zinc-500'}`}
            >
                <Home size={22} /><span className="text-[10px] font-medium">總覽</span>
            </button>
            <button
                onClick={() => { activeTabStore.set('students'); selectedStudentStore.set(null); }}
                className={`flex flex-col items-center gap-1 ${(activeTab === 'students' || activeTab === 'details') ? 'text-blue-500' : 'text-zinc-500'}`}
            >
                <Users size={22} /><span className="text-[10px] font-medium">學員</span>
            </button>
            <button
                onClick={() => activeTabStore.set('billing')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'billing' ? 'text-blue-500' : 'text-zinc-500'}`}
            >
                <CreditCard size={22} /><span className="text-[10px] font-medium">帳務</span>
            </button>
        </nav>
    );
};
