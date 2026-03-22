import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { searchQueryStore, activeTabStore, selectedStudentStore, showCheckInModalStore } from '../store/uiStore';
import { filteredStudentsStore } from '../store/studentsStore';

export const StudentsView = () => {
    const searchQuery = useStore(searchQueryStore);
    const filteredStudents = useStore(filteredStudentsStore);

    return (
        <div className="p-4 space-y-4 animate-in fade-in">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                    type="text"
                    placeholder="搜尋學員姓名..."
                    value={searchQuery}
                    onChange={(e) => searchQueryStore.set(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none"
                />
            </div>
            <div className="space-y-3">
                {filteredStudents.map(s => (
                    <div key={s.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-[32px]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">{s.name[0]}</div>
                                <div><h3 className="font-bold text-white">{s.name}</h3><p className="text-[10px] text-zinc-500">{s.contractType}</p></div>
                            </div>
                            <div className="text-right">
                                {s.contractType === '先上課後結算' ? (
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded-lg">待結 {s.usedLessons} 堂</span>
                                ) : (
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-lg">剩 {s.totalLessons - s.usedLessons} 堂</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { selectedStudentStore.set(s); showCheckInModalStore.set(true); }}
                                className="flex-1 py-3 bg-blue-600 text-white text-xs font-bold rounded-2xl"
                            >
                                簽到課程
                            </button>
                            <button
                                onClick={() => { selectedStudentStore.set(s); activeTabStore.set('details'); }}
                                className="flex-1 py-3 bg-zinc-800 text-white text-xs font-bold rounded-2xl border border-zinc-700"
                            >
                                歷史明細
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
