import React from 'react';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showEditStudentModalStore, selectedStudentStore, editStudentFormStore } from '../../store/uiStore';
import { deleteStudent, addHistoricalCheckIn } from '../../store/studentsStore';

export const EditStudentModal = () => {
    const showModal = useStore(showEditStudentModalStore);
    const selectedStudent = useStore(selectedStudentStore);
    const form = useStore(editStudentFormStore);

    if (!showModal || !selectedStudent) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[150] p-4">
            <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">編輯學員：{selectedStudent.name}</h3>
                        </div>
                        <button onClick={() => showEditStudentModalStore.set(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20} /></button>
                    </div>

                    <div className="space-y-6">
                        {/* 手動補登課程 */}
                        <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><PlusCircle size={16} className="text-blue-500" /> 補登歷史課程</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">課程日期</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => editStudentFormStore.set({ ...form, date: e.target.value })}
                                        className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">課程備註</label>
                                    <input
                                        type="text"
                                        value={form.note}
                                        onChange={(e) => editStudentFormStore.set({ ...form, note: e.target.value })}
                                        className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none"
                                        placeholder="例如：一般訓練"
                                    />
                                </div>
                                <button onClick={addHistoricalCheckIn} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-transform text-sm">確認補登</button>
                            </div>
                        </div>

                        {/* 刪除學員 */}
                        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <h4 className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2"><Trash2 size={16} /> 危險操作</h4>
                            <p className="text-xs text-zinc-400 mb-4">刪除後所有這名學員的簽到、繳費紀綠將會一併移除且無法復原。</p>
                            <button onClick={() => deleteStudent(selectedStudent.id)} className="w-full py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm">刪除此學員</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
