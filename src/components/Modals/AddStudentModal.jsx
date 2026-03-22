import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showAddStudentModalStore, newStudentFormStore } from '../../store/uiStore';
import { addStudent } from '../../store/studentsStore';

export const AddStudentModal = () => {
    const showModal = useStore(showAddStudentModalStore);
    const form = useStore(newStudentFormStore);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[120] p-4">
            <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-zinc-800 overflow-hidden p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">新增學員合約</h3>
                    <button onClick={() => showAddStudentModalStore.set(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => newStudentFormStore.set({ ...form, name: e.target.value })}
                        placeholder="學員姓名"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white hover:border-zinc-600 focus:outline-none"
                    />
                    <select
                        value={form.contractType}
                        onChange={(e) => newStudentFormStore.set({ ...form, contractType: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                    >
                        <option value="預付 - 一次付清">預付 - 一次付清</option>
                        <option value="預付 - 分期付款">預付 - 分期付款</option>
                        <option value="先上課後結算">先上課後結算</option>
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            placeholder="堂數"
                            value={form.totalLessons}
                            onChange={(e) => newStudentFormStore.set({ ...form, totalLessons: e.target.value })}
                            className="bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="單價"
                            value={form.pricePerLesson}
                            onChange={(e) => newStudentFormStore.set({ ...form, pricePerLesson: e.target.value })}
                            className="bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white focus:outline-none"
                        />
                    </div>
                </div>
                <button onClick={addStudent} className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-transform">確認建立</button>
            </div>
        </div>
    );
};
