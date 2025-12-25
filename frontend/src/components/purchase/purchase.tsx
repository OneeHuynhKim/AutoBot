'use client';

import React, { useState, useMemo } from 'react';
import { 
    FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaChevronDown, 
    FaChevronUp, FaCreditCard, FaUser, FaSearch, FaFilter 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Dữ liệu mẫu (mock data)
const mockPurchaseHistory = [
    // ... (Dữ liệu mẫu đã được cung cấp)
    {
        id: '1',
        botName: 'AlphaTrend V2.0',
        priceBot: 99.99,
        startDate: new Date(2025, 10, 1),
        endDate: new Date(2025, 11, 1),
        paymentMethod: 'Visa XXXX-1234',
        status: 'Active', 
        date: new Date(2025, 9, 30),
        userId: 'user-a1b2c3d4',
        botTradingId: 'bot-x1y2z3',
    },
    {
        id: '2',
        botName: 'HedgeMaster AI',
        priceBot: 149.50,
        startDate: new Date(2025, 9, 15),
        endDate: new Date(2025, 10, 15),
        paymentMethod: 'Mastercard XXXX-5678',
        status: 'Expired',
        date: new Date(2025, 9, 14),
        userId: 'user-a1b2c3d4',
        botTradingId: 'bot-m4n5o6',
    },
    {
        id: '3',
        botName: 'Scalper Pro X',
        priceBot: 49.00,
        startDate: new Date(2025, 11, 10),
        endDate: new Date(2025, 12, 10),
        paymentMethod: 'Momo Wallet',
        status: 'Pending',
        date: new Date(2025, 11, 9),
        userId: 'user-a1b2c3d4',
        botTradingId: 'bot-p7q8r9',
    },
    {
        id: '4',
        botName: 'Market Genius V1.0',
        priceBot: 50.00,
        startDate: new Date(2025, 8, 1),
        endDate: new Date(2025, 9, 1),
        paymentMethod: 'PayPal',
        status: 'Failed', 
        date: new Date(2025, 7, 31),
        userId: 'user-a1b2c3d4',
        botTradingId: 'bot-f0g1h2',
    },
];

// Helper functions (formatCurrency, formatDate, StatusBadge và SummaryCard giữ nguyên như cũ)

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const StatusBadge = ({ status } : {status: string}) => {
    let colorClass;
    let Icon;
    let label;

    switch (status) {
        case 'Active':
            colorClass = 'bg-green-600 text-white ring-green-500/10';
            Icon = FaCheckCircle;
            label = 'Đang hoạt động';
            break;
        case 'Expired':
            colorClass = 'bg-red-600 text-white ring-red-500/10';
            Icon = FaTimesCircle;
            label = 'Đã hết hạn';
            break;
        case 'Pending':
            colorClass = 'bg-yellow-600 text-white ring-yellow-500/10';
            Icon = FaClock;
            label = 'Chờ xử lý';
            break;
        case 'Failed':
        default:
            colorClass = 'bg-gray-600 text-white ring-gray-500/10';
            Icon = FaTimesCircle;
            label = 'Thất bại';
    }

    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
};

const SummaryCard = ({ title, value, icon: Icon, color, bgColor }: {title: string, value: string | number, icon: any, color: string, bgColor: string}) => (
    <div className={`dark:${bgColor} bg-[#f5f5f5] shadow-lg rounded-xl p-6 flex items-center justify-between border-l-4 border-blue-600 transition duration-300 hover:shadow-blue-500/50`}>
        <div>
            <p className="text-sm font-medium dark:text-gray-400 text-black">{title}</p>
            <p className={`mt-1 text-3xl font-extrabold ${color}`}>{value}</p>
        </div>
        <div className={`p-4 rounded-full dark:bg-gray-700/50 bg-white`}>
            <Icon className={`w-7 h-7 ${color}`} />
        </div>
    </div>
);


const Purchase = () => {
    const purchaseHistory = mockPurchaseHistory; 
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const filteredHistory = useMemo(() => {
        return purchaseHistory.filter(item => {
            const matchesSearch = item.botName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            const itemDate = item.date.getTime();
            let matchesDate = true;

            if (startDate) {
                const startDateTime = new Date(startDate).getTime();
                matchesDate = matchesDate && itemDate >= startDateTime;
            }

            if (endDate) {
                const endDateTime = new Date(endDate).getTime() + 86400000; 
                matchesDate = matchesDate && itemDate <= endDateTime;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [purchaseHistory, searchTerm, statusFilter, startDate, endDate]);


    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 dark:bg-[#1C2129] bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className="text-4xl font-extrabold dark:text-white text-black mb-8 border-b dark:border-gray-700 border-gray-300 pb-3">
                    Lịch Sử Giao Dịch Bot
                </h1>

                <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard 
                        title="Tổng Chi Tiêu" 
                        value={formatCurrency(purchaseHistory.reduce((sum, item) => sum + item.priceBot, 0))} 
                        icon={FaMoneyBillWave} 
                        color="text-blue-400"
                        bgColor="bg-gray-800"
                    />
                    <SummaryCard 
                        title="Bot Đang Hoạt Động" 
                        value={purchaseHistory.filter(item => item.status === 'Active').length} 
                        icon={FaCheckCircle} 
                        color="text-green-400"
                        bgColor="bg-gray-800"
                    />
                    <SummaryCard 
                        title="Giao Dịch Đã Hoàn Thành" 
                        value={purchaseHistory.filter(item => item.status !== 'Pending').length} 
                        icon={FaCalendarAlt} 
                        color="text-purple-400"
                        bgColor="bg-gray-800"
                    />
                </div>

                <div className="dark:bg-[#242933] bg-[#f5f5f5] shadow-lg rounded-xl p-5 mb-6 border dark:border-gray-700 border-gray-300">
                    <h3 className="text-lg font-semibold dark:text-white text-black mb-4 flex items-center">
                        <FaFilter className="w-5 h-5 mr-2 text-blue-400" /> Công Cụ Lọc & Tìm Kiếm
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        {/* 1. Tìm kiếm theo tên Bot */}
                        <div className="col-span-1 md:col-span-2 relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên Bot..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-black border dark:border-gray-600 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {/* 2. Lọc theo Trạng thái */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-3 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-black border dark:border-gray-600 border-gray-300 focus:border-blue-500 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="All">Tất cả Trạng thái</option>
                                <option value="Active">Đang hoạt động</option>
                                <option value="Expired">Đã hết hạn</option>
                                <option value="Pending">Chờ xử lý</option>
                                <option value="Failed">Thất bại</option>
                            </select>
                        </div>
                        
                        {/* 3. Lọc theo Ngày mua (Date Range) */}
                        <div className="col-span-1 md:col-span-4 lg:col-span-1 grid grid-cols-2 gap-4">
                             <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Từ Ngày"
                                className="w-full p-3 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-black border dark:border-gray-600 border-gray-300 focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="Đến Ngày"
                                className="w-full p-3 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-black border dark:border-gray-600 border-gray-300 focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Card chứa Bảng dữ liệu */}
                <div className="dark:bg-[#242933] bg-[#f5f5f5] shadow-2xl rounded-xl overflow-hidden border dark:border-gray-700 border-gray-300">
                    <div className="px-4 sm:px-6 lg:px-8 py-5 border-b dark:border-gray-700 border-gray-300">
                        <h2 className="text-xl font-semibold dark:text-white text-black">
                            Kết quả Lịch Sử ({filteredHistory.length} giao dịch)
                        </h2>
                    </div>

                    {/* Bảng Hiển Thị Lịch Sử */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y dark:divide-gray-700 divide-gray-300">
                            <thead className="dark:bg-[#2D333F] bg-white sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-black uppercase tracking-wider">
                                        Bot Name
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-black uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-black uppercase tracking-wider hidden sm:table-cell">
                                        Ngày mua
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-black uppercase tracking-wider hidden md:table-cell">
                                        Thời hạn
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium dark:text-gray-400 text-black uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium dark:text-gray-400 text-black uppercase tracking-wider">
                                        Chi tiết
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-800 divide-gray-300">
                                {filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center dark:text-gray-500 text-black italic">
                                            Không tìm thấy lịch sử mua bot nào phù hợp với điều kiện lọc.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <tr className="dark:bg-[#242933] bg-white dark:hover:bg-[#343a46] hover:bg-[#f5f5f5] transition duration-150 cursor-pointer" onClick={() => toggleRow(item.id)}>
                                                {/* Bot Name */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold dark:text-white text-black">
                                                    {item.botName}
                                                </td>
                                                
                                                {/* Price */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                                                    {formatCurrency(item.priceBot)}
                                                </td>
                                                
                                                {/* Date */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                                                    {formatDate(item.date)}
                                                </td>
                                                
                                                {/* Duration (Start Date - End Date) */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">
                                                    <div className="flex items-center space-x-1">
                                                        <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                                                        <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                                                    </div>
                                                </td>
                                                
                                                {/* Status */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <StatusBadge status={item.status} />
                                                </td>

                                                {/* Detail Button/Icon */}
                                                <td className="px-6 py-4 text-center">
                                                    <button className="text-gray-400 hover:text-blue-400">
                                                        {expandedRow === item.id ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {/* Expandable Detail Row */}
                                            {expandedRow === item.id && (
                                                <tr className="dark:bg-[#2D333F] bg-white">
                                                    <td colSpan={6} className="p-4 sm:p-6">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            transition={{ duration: 0.3 }}
                                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 border-l-4 border-blue-600 pl-4"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <FaCreditCard className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium text-gray-400">Phương Thức TT:</span>
                                                                <span>{item.paymentMethod}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <FaUser className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium text-gray-400">Mã Người Dùng (Debug):</span>
                                                                <code className="bg-gray-700 p-1 rounded text-xs">{item.userId}</code>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <FaClock className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium text-gray-400">Ngày Kết Thúc:</span>
                                                                <span>{formatDate(item.endDate)}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <FaCheckCircle className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium text-gray-400">Mã Bot (Debug):</span>
                                                                <code className="bg-gray-700 p-1 rounded text-xs">{item.botTradingId}</code>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Purchase;