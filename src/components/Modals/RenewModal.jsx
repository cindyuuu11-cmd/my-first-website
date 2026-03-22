import React from 'react';
import { X, FilePlus2 } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showRenewModalStore, selectedStudentStore, renewFormStore } from '../../store/uiStore';
import { renewCourse } from '../../store/studentsStore';

export const RenewModal = () => {
    const showModal = useStore(showRenewModalStore);
    const selectedStudent = useStore(selectedStudentStore);
    const renewForm = useStore(renewFormStore);

    if (!showModal || !selectedStudent) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[150] p-4">
            <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><FilePlus2 size={24} /></div>
                            <h3 className="text-xl font-bold text-white">學員續約：{selectedStudent.name}</h3>
                        </div>
                        <button onClick={() => showRenewModalStore.set(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20} /></button>
                    </div>
                    <div className="space-y-4 pr-2">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">續約收費模式</label>
                            <select
                                value={renewForm.contractType}
                                onChange={(e) => renewFormStore.set({ ...renewForm, contractType: e.target.value })}
                                className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                            >
                                <option value="預付 - 一次付清">預付 - 一次付清</option>
                                <option value="預付 - 分期付款">預付 - 分期付款</option>
                                <option value="先上課後結算">先上課後結算</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">新增堂數</label>
                                <input
                                    type="number"
                                    value={renewForm.addLessons}
                                    onChange={(e) => renewFormStore.set({ ...renewForm, addLessons: e.target.value })}
                                    className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">單堂價格</label>
                                <input
                                    type="number"
                                    value={renewForm.pricePerLesson}
                                    onChange={(e) => renewFormStore.set({ ...renewForm, pricePerLesson: e.target.value })}
                                    className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                                />
                            </div>
                        </div>
                        {renewForm.contractType === '預付 - 分期付款' && (
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">分期期數</label>
                                <input
                                    type="number"
                                    value={renewForm.installmentCount}
                                    onChange={(e) => renewFormStore.set({ ...renewForm, installmentCount: e.target.value })}
                                    className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                                />
                            </div>
                        )}
                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-zinc-500">續約總額</span>
                                <span className="text-blue-400">${(renewForm.addLessons * renewForm.pricePerLesson).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={renewCourse} className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform">確認續約新課程</button>
                </div>
            </div>
        </div>
    );
};
