"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../layouts/sidebar";
import {
    Search, Filter, Download, ChevronLeft, ChevronRight, Calendar, Eye
} from "lucide-react";
import axios from "axios";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { format, addHours } from "date-fns";

const WithdrawMoney = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const [accessToken, setAccessToken] = useState<string>('');
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    const [withdraws, setWithdraws] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const [openShowWithdraw, setOpenShowWithdraw] = useState<boolean>(false);
    const [selectedWithdraw, setSelectedWithdraw] = useState<any>(null);

    useEffect(() => {
        if (!userInfo?.Id) return;
        loadToken();
        if (accessToken) {
            getWithdraws();
        }
    }, [userInfo, accessToken, currentPage]);

    const loadToken = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const getWithdraws = async () => {
        if (!accessToken) return;

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_URL_API}Payment/GetWithdrawRequests?pageSize=${itemsPerPage}&pageNumber=${currentPage}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const totalItems = res.data?.data?.totalItems || 0;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));

            const data = res.data?.data?.items || [];

            const dataWithUser = await Promise.all(data.map(async (x: any) => {
                try {
                    const userRes = await axios.get(
                        `${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${x.userId}`,
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    );
                    const u = userRes.data?.data;
                    return {
                        id: x.id,
                        userName: u?.userName || "Không rõ",
                        fullName: u?.fullName || "Không rõ",
                        email: u?.email || "",
                        bankName: x.bankName,
                        bankAccount: x.userBankName,
                        qrCodeUrl: x.qrCode || "",
                        amount: x.bankAmount,
                        requestDate: x.created,
                        status: x.status
                    };
                } catch (e) {
                    return {
                        id: x.id,
                        userName: "Không rõ",
                        fullName: "Không rõ",
                        email: "",
                        bankName: x.bankName,
                        bankAccount: x.userBankName,
                        qrCodeUrl: x.qrCode || "",
                        amount: x.bankAmount,
                        requestDate: x.created,
                        status: x.status
                    };
                }
            }));

            setWithdraws(dataWithUser);

        } catch (err) {
            console.log(err);
        }
    };

    const filteredData = withdraws.filter(item =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPageNumbers = (current: number, total: number) => {
        const pages: (number | string)[] = [];

        if (total <= 3) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            if (current > 3) pages.push("...");
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (current < total - 2) pages.push("...");
            pages.push(total);
        }

        return pages;
    };

    return (
        <div className="flex min-h-screen font-sans text-gray-800">
            <main className="flex-1 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Yêu cầu rút tiền</h1>
                        <p className="text-sm text-gray-500 mt-1">Theo dõi toàn bộ yêu cầu rút tiền của người dùng.</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center mb-2">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Tên người dùng</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Ngân hàng</th>
                                    <th className="px-6 py-4">Số tài khoản</th>
                                    <th className="px-6 py-4">QR Code</th>
                                    <th className="px-6 py-4">Số tiền</th>
                                    <th className="px-6 py-4">Ngày yêu cầu</th>
                                    <th className="px-6 py-4 text-center">Chi tiết</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredData.length > 0 ? (
                                    filteredData.map((w) => (
                                        <tr key={w.id} className="hover:bg-blue-50/30 transition duration-150">
                                            <td className="px-6 py-4">{w.fullName}</td>
                                            <td className="px-6 py-4">{w.email}</td>
                                            <td className="px-6 py-4">{w.bankName}</td>
                                            <td className="px-6 py-4">{w.bankAccount}</td>
                                            <td className="px-6 py-4">
                                                {w.qrCodeUrl ? <img src={w.qrCodeUrl} alt="QR" className="w-12 h-12 object-cover rounded" /> : "--"}
                                            </td>
                                            <td className="px-6 py-4 text-emerald-600 font-bold">₫{w.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{w.requestDate ? format(addHours(new Date(w.requestDate), 7), "dd-MM-yyyy HH:mm") : "--"}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => { setSelectedWithdraw(w); setOpenShowWithdraw(true); }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                            Không có yêu cầu rút tiền nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-2 m-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition 
                  ${currentPage === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Modal chi tiết */}
                {openShowWithdraw && selectedWithdraw && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                            <button
                                onClick={() => setOpenShowWithdraw(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                            >
                                ✕
                            </button>

                            <h2 className="text-lg font-bold mb-6">Chi tiết rút tiền</h2>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Tên người dùng:</span>
                                    <span className="text-gray-900">{selectedWithdraw.fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Email:</span>
                                    <span className="text-gray-900">{selectedWithdraw.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Ngân hàng:</span>
                                    <span className="text-gray-900">{selectedWithdraw.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Số tài khoản:</span>
                                    <span className="text-gray-900">{selectedWithdraw.bankAccount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-500">QR Code:</span>
                                    {selectedWithdraw.qrCodeUrl ? (
                                        <img src={selectedWithdraw.qrCodeUrl} alt="QR" className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                        <span>--</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Số tiền:</span>
                                    <span className="text-emerald-600 font-bold">₫{selectedWithdraw.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Ngày yêu cầu:</span>
                                    <span>{selectedWithdraw.requestDate ? format(addHours(new Date(selectedWithdraw.requestDate), 7), "dd-MM-yyyy HH:mm") : "--"}</span>
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => setOpenShowWithdraw(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default WithdrawMoney;
