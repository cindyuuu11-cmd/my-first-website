import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Plus, 
  CheckCircle, 
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  History,
  Home,
  User,
  DollarSign,
  ReceiptText,
  Search,
  X,
  Target,
  CalendarDays,
  FilePlus2
} from 'lucide-react';

// --- 模擬數據 ---
const INITIAL_STUDENTS = [
  {
    id: '1',
    name: '王小明',
    contractType: '預付 - 一次付清',
    totalLessons: 24,
    usedLessons: 10,
    paidAmount: 24000,
    totalAmount: 24000,
    status: '進行中',
    joinDate: '2024-01-01',
    expiryDate: '2024-06-01',
    pricePerLesson: 1000,
    installments: [
      { id: 'i1_1', period: 1, amount: 24000, dueDate: '2024-01-01', status: '已繳費', paidDate: '2024-01-01', method: '匯款', lastFive: '12345' }
    ],
    checkInHistory: [
      { id: 'h1', date: '2024-03-15 14:00', note: '胸部訓練' },
      { id: 'h2', date: '2024-03-18 10:00', note: '背部訓練' }
    ],
    paymentHistory: [{ id: 'p1', date: '2024-01-01', amount: 24000, method: '匯款', lastFive: '12345' }]
  },
  {
    id: '2',
    name: '李美美',
    contractType: '預付 - 分期付款',
    totalLessons: 36,
    usedLessons: 5,
    paidAmount: 12000,
    totalAmount: 36000,
    status: '欠款中',
    joinDate: '2024-02-15',
    expiryDate: '2025-02-15',
    pricePerLesson: 1000,
    installments: [
      { id: 'i2_1', period: 1, amount: 12000, dueDate: '2024-02-15', status: '已繳費', paidDate: '2024-02-15', method: '現金', lastFive: '' },
      { id: 'i2_2', period: 2, amount: 12000, dueDate: '2024-03-15', status: '待繳費', paidDate: '', method: '', lastFive: '' },
      { id: 'i2_3', period: 3, amount: 12000, dueDate: '2024-04-15', status: '待繳費', paidDate: '', method: '', lastFive: '' }
    ],
    checkInHistory: [{ id: 'h4', date: '2024-03-14 19:00', note: '核心與有氧' }],
    paymentHistory: [{ id: 'p2', date: '2024-02-15', amount: 12000, method: '現金', lastFive: '' }]
  },
  {
    id: '3',
    name: '張大華',
    contractType: '先上課後結算',
    totalLessons: 0,
    usedLessons: 8,
    paidAmount: 0,
    totalAmount: 0,
    status: '待結算',
    joinDate: '2024-02-01',
    pricePerLesson: 1200,
    expiryDate: '2024-08-01',
    installments: [],
    checkInHistory: [{ id: 'h5', date: '2024-03-18 13:00', note: '深蹲技術調整' }],
    paymentHistory: []
  }
];

const App = () => {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  
  // 搜尋與篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardRange, setDashboardRange] = useState('month'); 
  
  // 自定義日期狀態
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [customStartDate, setCustomStartDate] = useState(firstDayOfMonth);
  const [customEndDate, setCustomEndDate] = useState(todayStr);

  // Modal 狀態
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: '現金', lastFive: '' });
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    contractType: '預付 - 一次付清',
    totalLessons: 10,
    pricePerLesson: 1200,
    installmentCount: 1,
    expiryMonths: 6
  });

  const [renewForm, setRenewForm] = useState({
    contractType: '預付 - 一次付清',
    addLessons: 10,
    pricePerLesson: 1200,
    installmentCount: 1,
    expiryMonths: 6
  });

  // --- 邏輯計算 (Dashboard) ---
  const dashboardStats = useMemo(() => {
    let startLimit = new Date();
    let endLimit = new Date();
    endLimit.setHours(23, 59, 59, 999);

    if (dashboardRange === 'day') {
      startLimit.setHours(0, 0, 0, 0);
    } else if (dashboardRange === 'week') {
      startLimit.setDate(startLimit.getDate() - 7);
      startLimit.setHours(0, 0, 0, 0);
    } else if (dashboardRange === 'month') {
      startLimit.setMonth(startLimit.getMonth() - 1);
      startLimit.setHours(0, 0, 0, 0);
    } else if (dashboardRange === 'custom') {
      startLimit = new Date(customStartDate);
      startLimit.setHours(0, 0, 0, 0);
      endLimit = new Date(customEndDate);
      endLimit.setHours(23, 59, 59, 999);
    }

    let totalRevenue = 0;
    let totalLessonsCount = 0;

    students.forEach(s => {
      s.paymentHistory?.forEach(p => {
        const pDate = new Date(p.date);
        if (pDate >= startLimit && pDate <= endLimit) totalRevenue += p.amount;
      });
      s.checkInHistory?.forEach(h => {
        const hDate = new Date(h.date);
        if (hDate >= startLimit && hDate <= endLimit) totalLessonsCount += 1;
      });
    });

    return { totalRevenue, totalLessonsCount };
  }, [students, dashboardRange, customStartDate, customEndDate]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

  // --- 操作函數 ---
  const handleAddStudent = () => {
    const totalAmount = newStudentForm.contractType === '先上課後結算' ? 0 : newStudentForm.totalLessons * newStudentForm.pricePerLesson;
    const installments = [];
    
    if (newStudentForm.contractType === '預付 - 分期付款') {
      const perAmount = totalAmount / newStudentForm.installmentCount;
      for (let i = 1; i <= newStudentForm.installmentCount; i++) {
        installments.push({
          id: `inst_${Date.now()}_${i}`,
          period: i,
          amount: perAmount,
          dueDate: todayStr,
          status: '待繳費',
          paidDate: '',
          method: '',
          lastFive: ''
        });
      }
    } else if (newStudentForm.contractType === '預付 - 一次付清') {
      installments.push({
        id: `inst_${Date.now()}_1`,
        period: 1,
        amount: totalAmount,
        dueDate: todayStr,
        status: '待繳費',
        paidDate: '',
        method: '',
        lastFive: ''
      });
    }

    const newStudent = {
      id: Date.now().toString(),
      name: newStudentForm.name,
      contractType: newStudentForm.contractType,
      totalLessons: parseInt(newStudentForm.totalLessons),
      usedLessons: 0,
      paidAmount: 0,
      totalAmount: totalAmount,
      status: '進行中',
      joinDate: todayStr,
      expiryDate: '2024-12-31',
      pricePerLesson: parseInt(newStudentForm.pricePerLesson),
      installments,
      checkInHistory: [],
      paymentHistory: []
    };

    setStudents([...students, newStudent]);
    setShowAddStudentModal(false);
  };

  const handleRenewCourse = () => {
    if (!selectedStudent) return;
    
    const newLessons = parseInt(renewForm.addLessons);
    const newTotalAmount = renewForm.contractType === '先上課後結算' ? 0 : newLessons * renewForm.pricePerLesson;
    const newInstallments = [];

    if (renewForm.contractType === '預付 - 分期付款') {
      const perAmount = newTotalAmount / renewForm.installmentCount;
      for (let i = 1; i <= renewForm.installmentCount; i++) {
        newInstallments.push({
          id: `inst_renew_${Date.now()}_${i}`,
          period: `續-${i}`,
          amount: perAmount,
          dueDate: todayStr,
          status: '待繳費',
          paidDate: '',
          method: '',
          lastFive: ''
        });
      }
    } else if (renewForm.contractType === '預付 - 一次付清') {
      newInstallments.push({
        id: `inst_renew_${Date.now()}_1`,
        period: '續-全額',
        amount: newTotalAmount,
        dueDate: todayStr,
        status: '待繳費',
        paidDate: '',
        method: '',
        lastFive: ''
      });
    }

    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          totalLessons: s.totalLessons + newLessons,
          totalAmount: s.totalAmount + newTotalAmount,
          contractType: renewForm.contractType, // 續約可變更模式
          installments: [...s.installments, ...newInstallments]
        };
      }
      return s;
    }));

    setShowRenewModal(false);
    // 更新本地選擇的學員資料以維持 UI 同步
    setSelectedStudent(prev => ({
      ...prev,
      totalLessons: prev.totalLessons + newLessons
    }));
  };

  const handleCheckIn = (studentId) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { 
          ...s, 
          usedLessons: s.usedLessons + 1, 
          checkInHistory: [{ id: Date.now().toString(), date: dateStr, note: '一般簽到訓練' }, ...(s.checkInHistory || [])]
        };
      }
      return s;
    }));
    setShowCheckInModal(false);
  };

  const handleConfirmPayment = () => {
    if (!selectedStudent) return;
    const now = new Date().toISOString().split('T')[0];
    
    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudent.id) {
        const updatedInstallments = s.installments.map(inst => {
          if (selectedInstallment && inst.id === selectedInstallment.id) {
            return { ...inst, status: '已繳費', paidDate: now, method: paymentForm.method, lastFive: paymentForm.lastFive };
          }
          return inst;
        });

        const newPaidAmount = s.paidAmount + Number(paymentForm.amount);
        const newPaymentHistory = [{ 
          id: Date.now().toString(), 
          date: now, 
          amount: Number(paymentForm.amount), 
          method: paymentForm.method, 
          lastFive: paymentForm.lastFive 
        }, ...(s.paymentHistory || [])];

        return { 
          ...s, 
          paidAmount: newPaidAmount, 
          paymentHistory: newPaymentHistory,
          installments: updatedInstallments
        };
      }
      return s;
    }));
    setShowPaymentModal(false);
  };

  // --- UI 組件 ---
  const TopNav = ({ title }) => (
    <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-black/80 backdrop-blur-md z-40 border-b border-zinc-900">
      <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
        <User size={16} className="text-zinc-400" />
      </div>
    </div>
  );

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 flex justify-around items-center z-50 pb-8 sm:pb-3">
      <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-zinc-500'}`}><Home size={22} /><span className="text-[10px] font-medium">總覽</span></button>
      <button onClick={() => { setActiveTab('students'); setSelectedStudent(null); }} className={`flex flex-col items-center gap-1 ${activeTab === 'students' || activeTab === 'details' ? 'text-blue-500' : 'text-zinc-500'}`}><Users size={22} /><span className="text-[10px] font-medium">學員</span></button>
      <button onClick={() => setActiveTab('billing')} className={`flex flex-col items-center gap-1 ${activeTab === 'billing' ? 'text-blue-500' : 'text-zinc-500'}`}><CreditCard size={22} /><span className="text-[10px] font-medium">帳務</span></button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans select-none pb-24">
      <TopNav title={activeTab === 'dashboard' ? '數據總覽' : activeTab === 'students' ? '學員管理' : activeTab === 'billing' ? '帳務中心' : '學員歷史明細'} />
      
      <main className="max-w-md mx-auto">
        {/* --- Dashboard --- */}
        {activeTab === 'dashboard' && (
          <div className="p-4 space-y-6 animate-in fade-in">
            <div className="space-y-3">
              <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
                {['day', 'week', 'month', 'custom'].map((r) => (
                  <button key={r} onClick={() => setDashboardRange(r)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${dashboardRange === r ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}>
                    {r === 'day' ? '今日' : r === 'week' ? '本週' : r === 'month' ? '本月' : '自定義'}
                  </button>
                ))}
              </div>
              {dashboardRange === 'custom' && (
                <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">開始日期</label>
                    <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="bg-transparent text-sm font-bold text-white outline-none w-full" />
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">結束日期</label>
                    <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="bg-transparent text-sm font-bold text-white outline-none w-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} className="text-green-500" /></div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-zinc-500 font-bold uppercase">期間總收款金額</p>
                  <CalendarDays size={12} className="text-zinc-600" />
                </div>
                <p className="text-4xl font-black text-white">${dashboardStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Target size={80} className="text-blue-500" /></div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-zinc-500 font-bold uppercase">期間累積簽到堂數</p>
                  <CalendarDays size={12} className="text-zinc-600" />
                </div>
                <p className="text-4xl font-black text-white">{dashboardStats.totalLessonsCount} <span className="text-sm font-normal text-zinc-500">堂</span></p>
              </div>
            </div>
          </div>
        )}

        {/* --- Students List --- */}
        {activeTab === 'students' && (
          <div className="p-4 space-y-4 animate-in fade-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input type="text" placeholder="搜尋學員姓名..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none" />
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
                    <button onClick={() => { setSelectedStudent(s); setShowCheckInModal(true); }} className="flex-1 py-3 bg-blue-600 text-white text-xs font-bold rounded-2xl">簽到課程</button>
                    <button onClick={() => { setSelectedStudent(s); setActiveTab('details'); }} className="flex-1 py-3 bg-zinc-800 text-white text-xs font-bold rounded-2xl border border-zinc-700">歷史明細</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Billing --- */}
        {activeTab === 'billing' && (
          <div className="p-4 space-y-6 animate-in fade-in">
            <button onClick={() => setShowAddStudentModal(true)} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-[24px] flex items-center justify-center gap-2"><Plus size={20} /> 新增學員與課程</button>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><ReceiptText size={16} className="text-red-400" /> 待確認到帳項目</h3>
              {students.map(s => {
                const pendingInstallments = s.installments.filter(i => i.status === '待繳費');
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
                          <button onClick={() => { setSelectedStudent(s); setSelectedInstallment(null); setPaymentForm({ ...paymentForm, amount: unsettledAmount }); setShowPaymentModal(true); }} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-xl">確認到帳</button>
                        </div>
                      )}
                      {pendingInstallments.map(inst => (
                        <div key={inst.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                          <div><p className="text-[10px] text-zinc-500 font-bold">期數: {inst.period}</p><p className="text-sm font-bold text-white">${inst.amount.toLocaleString()}</p></div>
                          <button onClick={() => { setSelectedStudent(s); setSelectedInstallment(inst); setPaymentForm({ ...paymentForm, amount: inst.amount }); setShowPaymentModal(true); }} className="px-4 py-2 bg-zinc-700 text-white text-[10px] font-bold rounded-xl">確認到帳</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Details (加上續約按鈕) --- */}
        {activeTab === 'details' && selectedStudent && (
          <div className="animate-in slide-in-from-right duration-300 pb-10">
            <div className="px-4 py-4 border-b border-zinc-900 flex items-center gap-4 sticky top-0 bg-black/90 backdrop-blur-md z-40">
              <button onClick={() => setActiveTab('students')} className="p-2 -ml-2 text-zinc-400"><ArrowLeft size={24} /></button>
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
                
                {/* 續約按鈕 */}
                <button 
                  onClick={() => {
                    setRenewForm({ ...renewForm, pricePerLesson: selectedStudent.pricePerLesson });
                    setShowRenewModal(true);
                  }}
                  className="w-full py-4 bg-zinc-800 border border-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                >
                  <FilePlus2 size={18} className="text-blue-400" /> 續約新課程
                </button>
              </div>

              <h3 className="text-sm font-bold text-white flex items-center gap-2"><History size={16} className="text-blue-500" /> 簽到日期明細</h3>
              <div className="space-y-3">
                {selectedStudent.checkInHistory.map((h, i) => (
                  <div key={h.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex justify-between items-center">
                    <div><p className="text-xs font-bold text-white">{h.date}</p><p className="text-[10px] text-zinc-500">{h.note}</p></div>
                    <div className="text-[10px] font-bold text-zinc-600">#{selectedStudent.checkInHistory.length - i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      {/* --- Modals --- */}
      
      {/* 續約課程 Modal */}
      {showRenewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[150] p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><FilePlus2 size={24}/></div>
                  <h3 className="text-xl font-bold text-white">學員續約：{selectedStudent.name}</h3>
                </div>
                <button onClick={() => setShowRenewModal(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20}/></button>
              </div>
              <div className="space-y-4 pr-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">續約收費模式</label>
                  <select value={renewForm.contractType} onChange={(e) => setRenewForm({...renewForm, contractType: e.target.value})} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white">
                    <option value="預付 - 一次付清">預付 - 一次付清</option>
                    <option value="預付 - 分期付款">預付 - 分期付款</option>
                    <option value="先上課後結算">先上課後結算</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">新增堂數</label>
                    <input type="number" value={renewForm.addLessons} onChange={(e) => setRenewForm({...renewForm, addLessons: e.target.value})} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">單堂價格</label>
                    <input type="number" value={renewForm.pricePerLesson} onChange={(e) => setRenewForm({...renewForm, pricePerLesson: e.target.value})} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white" />
                  </div>
                </div>
                {renewForm.contractType === '預付 - 分期付款' && (
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">分期期數</label>
                    <input type="number" value={renewForm.installmentCount} onChange={(e) => setRenewForm({...renewForm, installmentCount: e.target.value})} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white" />
                  </div>
                )}
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-500">續約總額</span>
                    <span className="text-blue-400">${(renewForm.addLessons * renewForm.pricePerLesson).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleRenewCourse} className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all">確認續約新課程</button>
            </div>
          </div>
        </div>
      )}

      {/* 簽到 Modal */}
      {showCheckInModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center z-[130]">
          <div className="bg-zinc-900 w-full max-w-md rounded-t-[40px] p-10 text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="text-blue-500" size={40} /></div>
            <h3 className="text-xl font-bold text-white mb-2">確認簽到</h3>
            <p className="text-zinc-400 text-sm mb-8">學員：{selectedStudent.name}<br />即將扣除 1 堂課。</p>
            <div className="space-y-3">
              <button onClick={() => handleCheckIn(selectedStudent.id)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">確認</button>
              <button onClick={() => setShowCheckInModal(false)} className="w-full py-2 text-zinc-500 font-bold text-sm">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 確認到帳 Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[140] p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[40px] p-8 border border-zinc-800 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><DollarSign className="text-green-500" /> 確認入帳紀錄</h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800/50 rounded-2xl">
                <p className="text-[10px] text-zinc-500 font-bold uppercase">入帳學員</p>
                <p className="text-sm font-bold text-white">{selectedStudent.name} {selectedInstallment ? `(${selectedInstallment.period})` : '(堂數結算)'}</p>
                <p className="text-lg font-black text-green-500 mt-2">${Number(paymentForm.amount).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {['現金', '匯款'].map(m => (
                  <button key={m} onClick={() => setPaymentForm({...paymentForm, method: m})} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${paymentForm.method === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{m}</button>
                ))}
              </div>
              {paymentForm.method === '匯款' && (
                <input type="text" placeholder="輸入匯款末五碼" value={paymentForm.lastFive} onChange={(e) => setPaymentForm({...paymentForm, lastFive: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white text-sm" />
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button onClick={handleConfirmPayment} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform">完成到帳確認</button>
              <button onClick={() => setShowPaymentModal(false)} className="w-full py-2 text-zinc-500 font-bold text-sm">取消返回</button>
            </div>
          </div>
        </div>
      )}

      {/* 新增學員 Modal (省略細節保持代碼簡潔，邏輯同前版本) */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[120] p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-zinc-800 overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">新增學員合約</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" value={newStudentForm.name} onChange={(e) => setNewStudentForm({...newStudentForm, name: e.target.value})} placeholder="學員姓名" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white" />
              <select value={newStudentForm.contractType} onChange={(e) => setNewStudentForm({...newStudentForm, contractType: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white">
                <option value="預付 - 一次付清">預付 - 一次付清</option>
                <option value="預付 - 分期付款">預付 - 分期付款</option>
                <option value="先上課後結算">先上課後結算</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="堂數" value={newStudentForm.totalLessons} onChange={(e) => setNewStudentForm({...newStudentForm, totalLessons: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white" />
                <input type="number" placeholder="單價" value={newStudentForm.pricePerLesson} onChange={(e) => setNewStudentForm({...newStudentForm, pricePerLesson: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-2xl py-3 px-4 text-white" />
              </div>
            </div>
            <button onClick={handleAddStudent} className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-2xl">確認建立</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;