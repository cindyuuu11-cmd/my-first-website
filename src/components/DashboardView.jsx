import React from 'react';
import { DollarSign, CalendarDays, Target } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { dashboardRangeStore, customStartDateStore, customEndDateStore } from '../store/uiStore';
import { dashboardStatsStore } from '../store/studentsStore';

export const DashboardView = () => {
    const dashboardRange = useStore(dashboardRangeStore);
    const customStartDate = useStore(customStartDateStore);
    const customEndDate = useStore(customEndDateStore);
    const dashboardStats = useStore(dashboardStatsStore);

    return (
        <div className="p-4 space-y-6 animate-in fade-in">
            <div className="space-y-3">
                <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
                    {['day', 'week', 'month', 'custom'].map((r) => (
                        <button
                            key={r}
                            onClick={() => dashboardRangeStore.set(r)}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${dashboardRange === r ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}
                        >
                            {r === 'day' ? '今日' : r === 'week' ? '本週' : r === 'month' ? '本月' : '自定義'}
                        </button>
                    ))}
                </div>
                {dashboardRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                            <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">開始日期</label>
                            <input type="date" value={customStartDate} onChange={(e) => customStartDateStore.set(e.target.value)} className="bg-transparent text-sm font-bold text-white outline-none w-full" />
                        </div>
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                            <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">結束日期</label>
                            <input type="date" value={customEndDate} onChange={(e) => customEndDateStore.set(e.target.value)} className="bg-transparent text-sm font-bold text-white outline-none w-full" />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} className="text-green-500" /></div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-zinc-500 font-bold uppercase">期間總收款金額</p>
                        <CalendarDays size={12} className="text-zinc-600" />
                    </div>
                    <p className="text-4xl font-black text-white">${dashboardStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Target size={80} className="text-blue-500" /></div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-zinc-500 font-bold uppercase">期間累積簽到堂數</p>
                        <CalendarDays size={12} className="text-zinc-600" />
                    </div>
                    <p className="text-4xl font-black text-white">{dashboardStats.totalLessonsCount} <span className="text-sm font-normal text-zinc-500">堂</span></p>
                </div>
            </div>
        </div>
    );
};
