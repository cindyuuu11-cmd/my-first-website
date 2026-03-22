import React from 'react';
import { Plus, ReceiptText } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { studentsStore } from '../store/studentsStore';
import { showAddStudentModalStore, selectedStudentStore, selectedInstallmentStore, paymentFormStore, showPaymentModalStore } from '../store/uiStore';

export const BillingView = () => {
    const students = useStore(studentsStore);

    return (
        <div className="p-4 space-y-6 animate-in fade-in">
            <button
                onClick={() => showAddStudentModalStore.set(true)}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-[24px] flex items-center justify-center gap-2"
            >
                <Plus size={20} /> 新增學員與課程
            </button>
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><ReceiptText size={16} className="text-red-400" /> 待確認到帳項目</h3>
                {students.map(s => {
                    const pendingInstallments = s.installments?.filter(i => i.status === '待繳費') || [];
                    const unsettledAmount = s.contractType === '先上課後結算' ? s.usedLessons * s.pricePerLesson : 0;
                    if (pendingInstallments.length === 0 && unsettledAmount <= 0) return null;
                    return (
                        <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden">
                            <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-white border border-zinc-700">{s.name[0]}</div>
                                    <span className="text-sm font-bold text-white">{s.name}</span>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {s.contractType === '先上課後結算' && unsettledAmount > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                                        <div><p className="text-[10px] text-zinc-500 font-bold">目前累計待結</p><p className="text-sm font-bold text-yellow-500">${unsettledAmount.toLocaleString()}</p></div>
                                        <button
                                            onClick={() => {
                                                selectedStudentStore.set(s);
                                                selectedInstallmentStore.set(null);
                                                paymentFormStore.set({ amount: unsettledAmount, method: '現金', lastFive: '' });
                                                showPaymentModalStore.set(true);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-xl"
                                        >
                                            確認到帳
                                        </button>
                                    </div>
                                )}
                                {pendingInstallments.map(inst => (
                                    <div key={inst.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                                        <div><p className="text-[10px] text-zinc-500 font-bold">期數: {inst.period}</p><p className="text-sm font-bold text-white">${inst.amount.toLocaleString()}</p></div>
                                        <button
                                            onClick={() => {
                                                selectedStudentStore.set(s);
                                                selectedInstallmentStore.set(inst);
                                                paymentFormStore.set({ amount: inst.amount, method: '現金', lastFive: '' });
                                                showPaymentModalStore.set(true);
                                            }}
                                            className="px-4 py-2 bg-zinc-700 text-white text-[10px] font-bold rounded-xl"
                                        >
                                            確認到帳
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
