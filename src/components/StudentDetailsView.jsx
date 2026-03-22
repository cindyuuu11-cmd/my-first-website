import React from 'react';
import { ArrowLeft, History, FilePlus2 } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { activeTabStore, selectedStudentStore, renewFormStore, showRenewModalStore } from '../store/uiStore';

export const StudentDetailsView = () => {
    const selectedStudent = useStore(selectedStudentStore);

    if (!selectedStudent) return null;

    return (
        <div className="animate-in slide-in-from-right duration-300 pb-10">
            <div className="px-4 py-4 border-b border-zinc-900 flex items-center gap-4 sticky top-0 bg-black/90 backdrop-blur-md z-40">
                <button onClick={() => activeTabStore.set('students')} className="p-2 -ml-2 text-zinc-400"><ArrowLeft size={24} /></button>
                <h2 className="text-lg font-bold text-white">{selectedStudent.name} 歷史明細</h2>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6">
                    <div className="flex justify-around text-center mb-6">
                        <div><p className="text-[10px] text-zinc-500 font-bold uppercase">總堂數</p><p className="text-xl font-bold text-white">{selectedStudent.totalLessons || '∞'}</p></div>
                        <div className="w-px h-8 bg-zinc-800"></div>
                        <div><p className="text-[10px] text-zinc-500 font-bold uppercase">已使用</p><p className="text-xl font-bold text-blue-500">{selectedStudent.usedLessons}</p></div>
                        <div className="w-px h-8 bg-zinc-800"></div>
                        <div><p className="text-[10px] text-zinc-500 font-bold uppercase">剩餘</p><p className="text-xl font-bold text-green-500">{selectedStudent.contractType === '先上課後結算' ? '-' : selectedStudent.totalLessons - selectedStudent.usedLessons}</p></div>
                    </div>

                    <button
                        onClick={() => {
                            renewFormStore.set({
                                contractType: '預付 - 一次付清',
                                addLessons: 10,
                                pricePerLesson: selectedStudent.pricePerLesson,
                                installmentCount: 1,
                                expiryMonths: 6
                            });
                            showRenewModalStore.set(true);
                        }}
                        className="w-full py-4 bg-zinc-800 border border-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                    >
                        <FilePlus2 size={18} className="text-blue-400" /> 續約新課程
                    </button>
                </div>

                <h3 className="text-sm font-bold text-white flex items-center gap-2"><History size={16} className="text-blue-500" /> 簽到日期明細</h3>
                <div className="space-y-3">
                    {selectedStudent.checkInHistory?.map((h, i) => (
                        <div key={h.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex justify-between items-center">
                            <div><p className="text-xs font-bold text-white">{h.date}</p><p className="text-[10px] text-zinc-500">{h.note}</p></div>
                            <div className="text-[10px] font-bold text-zinc-600">#{selectedStudent.checkInHistory.length - i}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
