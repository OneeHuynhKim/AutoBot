'use client';

import React, { useState, useEffect } from "react";
import { Wallet, QrCode, ChevronRight, ShieldCheck, Zap, Clock, History, CheckCircle2, AlertCircle, Lock, Check } from "lucide-react";


const DepositMoney = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);

    const amounts = [10000, 20000, 50000, 100000, 200000, 500000];

    // Dữ liệu lịch sử giả lập
    const [transactions, setTransactions] = useState([
        { id: 1, user: "User***992", amount: 500000, time: "Vừa xong", method: "VietQR" },
        { id: 2, user: "User***104", amount: 2000000, time: "15 giây trước", method: "VietQR" },
        { id: 3, user: "User***553", amount: 100000, time: "42 giây trước", method: "VietQR" },
        { id: 4, user: "User***881", amount: 50000, time: "1 phút trước", method: "VietQR" },
        { id: 5, user: "User***229", amount: 1000000, time: "2 phút trước", method: "VietQR" },
        { id: 6, user: "User***331", amount: 200000, time: "3 phút trước", method: "VietQR" },
    ]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 relative">


            {/* =========================================
                1. BACKGROUND (NỀN SÁNG NGUYÊN BẢN)
               ========================================= */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-700 via-blue-600 to-slate-50 z-0"></div>

            {/* Hiệu ứng trang trí nền */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-white opacity-10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-[-10%] w-[400px] h-[400px] bg-cyan-400 opacity-20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* =========================================
                2. NỘI DUNG CHÍNH
               ========================================= */}
            <main className="flex-grow w-full flex flex-col items-center p-4 md:p-12 relative z-10 gap-8">

                {/* --- TIÊU ĐỀ --- */}
                <div className="text-white text-center mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Nạp tiền vào ví</h1>
                    <p className="text-blue-100 opacity-90">Hệ thống nạp tự động qua VietQR 24/7 - An toàn & Nhanh chóng</p>
                </div>

                {/* --- KHỐI 1: FORM NẠP TIỀN (TRÀN VIỀN) --- */}
                <div className="w-full max-w-[1600px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">

                        {/* CỘT TRÁI: CHỌN MỆNH GIÁ (7 phần) */}
                        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                                <h3 className="text-xl font-bold text-slate-800">Chọn số tiền cần nạp</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                {amounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setSelectedAmount(amount)}
                                        className={`py-5 px-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 relative overflow-hidden group ${selectedAmount === amount
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]"
                                            : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-white"
                                            }`}
                                    >
                                        {formatCurrency(amount)}
                                        {selectedAmount === amount && (
                                            <div className="absolute top-0 right-0 w-6 h-6 bg-blue-600 rounded-bl-xl flex items-center justify-center">
                                                <Check size={14} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="relative mb-8">
                                <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Số tiền khác</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Nhập số tiền (tối thiểu 10.000đ)"
                                        className="w-full pl-6 pr-16 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-bold text-lg placeholder:font-normal bg-slate-50 focus:bg-white"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VND</span>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-4 items-start">
                                <AlertCircle className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-900">
                                    <p className="font-bold mb-1">Lưu ý quan trọng:</p>
                                    <p className="leading-relaxed opacity-90">
                                        Vui lòng nhập chính xác <strong>Nội dung chuyển khoản</strong> để hệ thống tự động cộng tiền. Sai nội dung sẽ cần hỗ trợ thủ công.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: PHƯƠNG THỨC (5 phần) */}
                        <div className="lg:col-span-5 p-8 md:p-12 bg-slate-50/50 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                                <h3 className="text-xl font-bold text-slate-800">Phương thức thanh toán</h3>
                            </div>

                            <div className="p-5 rounded-2xl border-2 border-blue-600 bg-white shadow-lg mb-8 relative overflow-hidden group cursor-pointer hover:shadow-blue-200/50 transition-shadow">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide z-10">Khuyên dùng</div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <QrCode size={32} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-900 text-lg">VietQR Pro</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                            <CheckCircle2 size={14} className="text-green-500" /> Tự động duyệt 24/7
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-200">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-slate-500 font-medium text-sm mb-1">Tổng thanh toán</span>
                                    <span className="text-3xl font-extrabold text-blue-700">
                                        {selectedAmount ? formatCurrency(selectedAmount) : "0 ₫"}
                                    </span>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 hover:shadow-blue-600/40 flex items-center justify-center gap-2 text-lg">
                                    <span>Tạo mã QR Ngay</span>
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KHỐI DƯỚI: 1 CỘT TRÁI - 3 CỘT PHẢI --- */}
                <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* CỘT TRÁI (25%): AN TOÀN & NHANH CHÓNG */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center hover:shadow-md transition-all">

                        <div className="mb-8">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">An toàn tuyệt đối</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Bảo mật chuẩn quốc tế. Dữ liệu được mã hóa và bảo vệ 2 lớp.
                            </p>
                        </div>

                        <div className="w-full h-px bg-slate-100 mb-8"></div>

                        <div>
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">Nhanh chóng</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Xử lý giao dịch tự động. Tiền vào tài khoản chỉ sau vài giây.
                            </p>
                        </div>
                    </div>

                    {/* CỘT PHẢI (75%): LỊCH SỬ MỚI NẠP */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <History size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Lịch sử nạp mới nhất</h3>
                            </div>
                            <span className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Live System
                            </span>
                        </div>

                        {/* Grid Lịch sử (3 cột nhỏ bên trong) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {tx.user.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{tx.user}</p>
                                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Clock size={10} /> {tx.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600 text-sm">+{new Intl.NumberFormat('vi-VN').format(tx.amount)}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">{tx.method}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Dòng hỗ trợ cuối cùng */}
                <div className="mt-8 text-center pb-8">
                    <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                        <Clock size={16} /> Hỗ trợ trực tuyến 24/7. Nếu quá 5 phút chưa nhận được tiền, vui lòng liên hệ CSKH.
                    </p>
                </div>

            </main>


        </div>
    );
};

export default DepositMoney;