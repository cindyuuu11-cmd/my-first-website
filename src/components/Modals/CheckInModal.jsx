import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { showCheckInModalStore, selectedStudentStore } from '../../store/uiStore';
import { checkInStudent } from '../../store/studentsStore';

export const CheckInModal = () => {
    const showModal = useStore(showCheckInModalStore);
    const selectedStudent = useStore(selectedStudentStore);

    if (!showModal || !selectedStudent) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center z-[130]">
            <div className="bg-zinc-900 w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-10 text-center animate-in slide-in-from-bottom duration-300">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-blue-500" size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">確認簽到</h3>
                <p className="text-zinc-400 text-sm mb-8">學員：{selectedStudent.name}<br />即將扣除 1 堂課。</p>
                <div className="space-y-3">
                    <button onClick={() => checkInStudent(selectedStudent.id)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">確認</button>
                    <button onClick={() => showCheckInModalStore.set(false)} className="w-full py-2 text-zinc-500 font-bold text-sm">取消</button>
                </div>
            </div>
        </div>
    );
};
