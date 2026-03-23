import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showAddStudentModalStore, newStudentFormStore } from '../../store/uiStore';
import { addStudent } from '../../store/studentsStore';

export const AddStudentModal = () => {
    const showModal = useStore(showAddStudentModalStore);
    const form = useStore(newStudentFormStore);

    if (!showModal) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (localStorage limit is ~5MB total, warn if too big)
            if (file.size > 2 * 1024 * 1024) {
                alert("圖片過大！請上傳小於 2MB 的檔案，否則可能無法離線儲存。");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                newStudentFormStore.set({ ...form, contractPhoto: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[120] p-4">
            <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-zinc-800 overflow-hidden p-8 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">新增學員合約</h3>
                    <button onClick={() => showAddStudentModalStore.set(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20} /></button>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

                    {/* 聯絡資訊區塊 */}
                    <div className="space-y-3 p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => newStudentFormStore.set({ ...form, name: e.target.value })}
                            placeholder="學員姓名"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                        />
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => newStudentFormStore.set({ ...form, phone: e.target.value })}
                            placeholder="聯絡電話"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                        />
                        <textarea
                            value={form.memo}
                            onChange={(e) => newStudentFormStore.set({ ...form, memo: e.target.value })}
                            placeholder="新增更多備註..."
                            rows="2"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm resize-none"
                        />
                    </div>

                    {/* 合約參數設定 */}
                    <div className="space-y-3 p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl">
                        <select
                            value={form.contractType}
                            onChange={(e) => newStudentFormStore.set({ ...form, contractType: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                        >
                            <option value="預付 - 一次付清">預付 - 一次付清</option>
                            <option value="預付 - 分期付款">預付 - 分期付款</option>
                            <option value="先上課後結算">先上課後結算</option>
                        </select>

                        {(form.contractType === '預付 - 一次付清' || form.contractType === '預付 - 分期付款') && (
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    placeholder="堂數"
                                    value={form.totalLessons}
                                    onChange={(e) => newStudentFormStore.set({ ...form, totalLessons: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="單價預算"
                                    value={form.pricePerLesson}
                                    onChange={(e) => newStudentFormStore.set({ ...form, pricePerLesson: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                                />
                            </div>)}

                        {form.contractType === '先上課後結算' && (
                            <input
                                type="number"
                                placeholder="結算單價"
                                value={form.pricePerLesson}
                                onChange={(e) => newStudentFormStore.set({ ...form, pricePerLesson: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                            />
                        )}

                        {form.contractType === '預付 - 分期付款' && (
                            <input
                                type="number"
                                placeholder="分期期數"
                                value={form.installmentCount}
                                onChange={(e) => newStudentFormStore.set({ ...form, installmentCount: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none text-sm"
                            />
                        )}
                    </div>

                    {/* 照片上傳 */}
                    <div className="p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl">
                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2"><ImageIcon size={14} /> 拍攝/上傳合約照片(選填)</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            onChange={handleFileChange}
                            className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors"
                        />
                        {form.contractPhoto && <div className="mt-3 w-16 h-16 rounded-xl border border-zinc-700 overflow-hidden"><img src={form.contractPhoto} className="w-full h-full object-cover" /></div>}
                    </div>

                </div>
                <button onClick={addStudent} className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-transform">確認建立學員</button>
            </div>
        </div>
    );
};
