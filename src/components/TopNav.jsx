import React from 'react';
import { User } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { activeTabStore } from '../store/uiStore';

export const TopNav = () => {
    const activeTab = useStore(activeTabStore);

    const title =
        activeTab === 'dashboard' ? '數據總覽' :
            activeTab === 'students' ? '學員管理' :
                activeTab === 'billing' ? '帳務中心' : '學員歷史明細';

    return (
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-black/80 backdrop-blur-md z-40 border-b border-zinc-900">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <User size={16} className="text-zinc-400" />
            </div>
        </div>
    );
};
