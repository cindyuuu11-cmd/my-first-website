export const INITIAL_STUDENTS = [
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
