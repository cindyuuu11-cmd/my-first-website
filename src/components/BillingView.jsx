import React from 'react';
import { Plus, ReceiptText, AlertCircle } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { studentsStore, dashboardStatsStore } from '../store/studentsStore';
import { showAddStudentModalStore, selectedStudentStore, selectedInstallmentStore, paymentFormStore, showPaymentModalStore } from '../store/uiStore';

export const BillingView = () => {
    const students = useStore(studentsStore);
    const stats = useStore(dashboardStatsStore);

    return (
        <div className="p-4 space-y-6 animate-in fade-in">
            <button
                onClick={() => showAddStudentModalStore.set(true)}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-[24px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
            >
                <Plus size={20} /> 新增學員與課程
            </button>

            {/* 待收款總計區塊 */}
            <div className="p-5 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-red-900/30 rounded-[32px] overflow-hidden relative">
                <div className="absolute -right-4 -top-4 opacity-5 text-red-500"><ReceiptText size={120} /></div>
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-red-400" />
                    <h3 className="text-sm font-bold text-zinc-300">總計累積待收款</h3>
                </div>
                <p className="text-4xl font-black text-red-400">${stats.totalPending.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><ReceiptText size={16} className="text-zinc-500" /> 待確認到帳項目</h3>
                {students.map(s => {
                    const pendingInstallments = s.installments?.filter(i => i.status === '待繳費') || [];
                    const unsettledAmount = s.contractType === '先上課後結算' ? (s.usedLessons * s.pricePerLesson) - s.paidAmount : 0;

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
                                                paymentFormStore.set({ amount: unsettledAmount, method: '現金', lastFive: '', paidDate: new Date().toISOString().split('T')[0] });
                                                showPaymentModalStore.set(true);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-xl active:scale-95 transition-transform"
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
                                                paymentFormStore.set({ amount: inst.amount, method: '現金', lastFive: '', paidDate: new Date().toISOString().split('T')[0] });
                                                showPaymentModalStore.set(true);
                                            }}
                                            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] font-bold rounded-xl active:scale-95 transition-colors"
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
