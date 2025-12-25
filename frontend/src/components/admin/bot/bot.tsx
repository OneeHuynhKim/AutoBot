"use client"

import { ChevronLeft, ChevronRight, Download, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CreateBot from "./createbot/createbot";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaDollarSign, FaPercent, FaRobot, FaSignal } from "react-icons/fa";
import { MdOutlineNumbers } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "sonner";
import EditBot from "./editbot/editbot";

const Bot = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [accessToken, setAccessToken] = useState<string>('');
    const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
    const [isEditModal, setIsEditModal] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [listBot, setListBot] = useState<any>([]);
    const [selectedBot, setSelectedBot] = useState<any>();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [interestRate, setInterestRate] = useState<string>('');
    const [totalProfit, setTotalProfit] = useState<string>('');
    const [winRate, setWinRate] = useState<string>('');

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();
        if (accessToken) {
            handleGetBot(currentPage);
        }
    }, [userInfo, accessToken, currentPage]);

    useEffect(() => {
        if (!accessToken) return;
        handleSearch();
    }, [searchTerm, interestRate, totalProfit, winRate])

    const handleSearch = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_URL_API}BotTrading/SearchBotTradingByAdmin`, {
            keyword: searchTerm ? searchTerm : "",
            interestRate: interestRate === "true" ? true : false,
            totalProfit: totalProfit === "true" ? true : false,
            winRate: winRate === "true" ? true : false,
            pageNumber: 1,
            pageSize: process.env.NEXT_PUBLIC_PAGE_SIZE
        },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
                setListBot(res.data.data);
            }).catch(err => {
                console.log(err);
            })
    }

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const handleGetBot = async (page: number) => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}BotTrading/GetListBot?pageSize=${process.env.NEXT_PUBLIC_PAGE_SIZE}&pageNumber=${page}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            setListBot(res.data.data);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleDeleteBot = async (id: string) => {
        Swal.fire({
            title: "Bạn có chắc muốn xóa Bot này?",
            text: "Bot sẽ bị xóa vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa Bot",
            cancelButtonText: "Hủy bỏ"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}BotTrading/DeleteBot?id=${id}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (res.data) {
                        toast.success(`Bot đã được xóa thành công!`);
                        handleGetBot(currentPage);
                    }
                } catch (error) {
                    toast.error(`Không thể xóa bot. Vui lòng thử lại!`);
                }
            } else {
                toast.error(`Đã hủy việc xóa Bot!`);
            }
        });
    }

    return (
        <div className="flex min-h-screen font-sans text-gray-800">
            <main className="flex-1 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý bot</h1>
                        <p className="text-sm text-gray-500 mt-1">Theo dõi toàn bộ bot của hệ thống.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer">
                            <Download size={16} />
                            Xuất Excel
                        </button>
                        <button
                            onClick={() => setIsCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5 cursor-pointer">
                            <Plus size={16} />
                            Thêm mới
                        </button>
                        <CreateBot isCreateModal={isCreateModal} setIsCreateModal={setIsCreateModal} handleGetBot={handleGetBot} accessToken={accessToken} currentPage={currentPage} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center mb-2">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên bot..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select onChange={(e) => setInterestRate(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
                            <option value={""}>Lãi suất</option>
                            <option value={"true"}>Thấp đến cao</option>
                            <option value={"false"}>Cao đến thấp</option>
                        </select>
                        <select onChange={(e) => setTotalProfit(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
                            <option value={""}>Lợi nhuận</option>
                            <option value={"true"}>Thấp đến cao</option>
                            <option value={"false"}>Cao đến thấp</option>
                        </select>
                        <select onChange={(e) => setWinRate(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
                            <option value={""}>Tỉ lệ thắng</option>
                            <option value={"true"}>Thấp đến cao</option>
                            <option value={"false"}>Cao đến thấp</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4"></th>
                                    <th className="px-6 py-4">Tên bot</th>
                                    <th className="px-6 py-4">Lãi suất</th>
                                    <th className="px-6 py-4">Lợi nhuận</th>
                                    <th className="px-6 py-4">Số lệnh</th>
                                    <th className="px-6 py-4">Tỉ lệ thắng</th>
                                    <th className="px-6 py-4">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {listBot?.items?.length > 0 ? listBot?.items?.map((bot: any, index: number) => (
                                    <tr key={bot.id} className="hover:bg-blue-50/30 transition duration-150 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs font-semibold text-gray-900">{index + 1}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <FaRobot size={14} className="text-gray-400" />
                                                <p className="text-xs font-semibold text-gray-900">{bot.nameBot}</p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaDollarSign size={14} className="text-gray-400" />
                                                {bot.interestRate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaSignal size={14} className="text-gray-400" />
                                                {bot.totalProfit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <MdOutlineNumbers size={14} className="text-gray-400" />
                                                {bot.commandNumber}
                                            </div>
                                        </td>
                                        <td className="text-right px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaPercent size={14} className="text-gray-400" />
                                                {bot.winRate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBot(bot);
                                                        setIsEditModal(true);
                                                    }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer" title="Chỉnh sửa">
                                                    <Edit size={16} />
                                                </button>

                                                <div
                                                    onClick={() => handleDeleteBot(bot.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </div>

                                                <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition cursor-pointer">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            Không tìm thấy kết quả nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
                        <span className="text-xs text-gray-500">
                            Hiển thị <span className="font-bold text-gray-800">{listBot?.items?.length}</span> trên tổng số <span className="font-bold text-gray-800">{listBot.totalItems}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: listBot.totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${currentPage === page
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, listBot.totalPages))}
                                disabled={currentPage === listBot.totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <EditBot
                            botData={selectedBot}
                            isEditModal={isEditModal}
                            setIsEditModal={setIsEditModal}
                            handleGetBot={handleGetBot}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Bot;