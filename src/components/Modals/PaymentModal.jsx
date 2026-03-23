import React from 'react';
import { X, Calendar } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showPaymentModalStore, selectedStudentStore, selectedInstallmentStore, paymentFormStore } from '../../store/uiStore';
import { confirmPayment } from '../../store/studentsStore';

export const PaymentModal = () => {
    const showModal = useStore(showPaymentModalStore);
    const selectedStudent = useStore(selectedStudentStore);
    const selectedInstallment = useStore(selectedInstallmentStore);
    const paymentForm = useStore(paymentFormStore);

    if (!showModal || !selectedStudent) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[140] p-4">
            <div className="bg-zinc-900 w-full max-w-md rounded-[40px] p-8 border border-zinc-800 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">確認入帳紀錄</h3>
                    <button onClick={() => showPaymentModalStore.set(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">入帳學員</p>
                        <p className="text-sm font-bold text-white">{selectedStudent.name} {selectedInstallment ? `(${selectedInstallment.period})` : '(堂數結算)'}</p>
                        <p className="text-2xl font-black text-green-500 mt-2">${Number(paymentForm.amount).toLocaleString()}</p>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 flex items-center gap-1"><Calendar size={12} /> 到帳日期</label>
                        <input
                            type="date"
                            value={paymentForm.paidDate || ''}
                            onChange={(e) => paymentFormStore.set({ ...paymentForm, paidDate: e.target.value })}
                            className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">收款方式</label>
                        <div className="flex gap-2 mt-1">
                            {['現金', '匯款'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => paymentFormStore.set({ ...paymentForm, method: m })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${paymentForm.method === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {paymentForm.method === '匯款' && (
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">匯款資訊</label>
                            <input
                                type="text"
                                placeholder="輸入匯款末五碼"
                                value={paymentForm.lastFive}
                                onChange={(e) => paymentFormStore.set({ ...paymentForm, lastFive: e.target.value })}
                                className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                            />
                        </div>
                    )}
                </div>
                <div className="mt-8">
                    <button onClick={confirmPayment} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform">完成到帳確認</button>
                </div>
            </div>
        </div>
    );
};
