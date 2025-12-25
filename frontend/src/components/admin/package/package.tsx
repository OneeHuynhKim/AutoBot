'use client';

import { Download, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CreatePackage from "./createpackage/createpackage";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import axios from "axios";
import { FaDollarSign, FaPercent, FaRegCalendar, FaRobot } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "sonner";
import EditPackage from "./editpackage/editpackage";

const Package = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [accessToken, setAccessToken] = useState<string>('');
    const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [listPriceBot, setListPriceBot] = useState<any>([]);
    const [selectedPriceBot, setSelectedPriceBot] = useState<any>();
    const [isEditModal, setIsEditModal] = useState<boolean>(false);

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();
        handleGetPriceBot(currentPage);
    }, [userInfo, accessToken, currentPage]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const handleGetPriceBot = async (page: number) => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}BotTrading/GetListPriceBot?pageSize=${process.env.NEXT_PUBLIC_PAGE_SIZE}&pageNumber=${page}`)
            .then(res => {
                setListPriceBot(res.data.data);
            }).catch(err => {
                console.log(err);
            })
    }

    const handleDeletePriceBot = async (priceBotId: string) => {
        Swal.fire({
            title: "Bạn có chắc muốn xóa gói này?",
            text: "Gói sẽ bị xóa vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa gói",
            cancelButtonText: "Hủy bỏ"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}BotTrading/DeletePriceBot?id=${priceBotId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (res.data) {
                        toast.success(`Gói Bot đã được xóa thành công!`);
                        handleGetPriceBot(currentPage);
                    }
                } catch (error) {
                    toast.error(`Không thể xóa gói Bot. Vui lòng thử lại!`);
                }
            } else {
                toast.error(`Đã hủy việc xóa gói Bot!`);
            }
        });
    }

    return (
        <div className="flex min-h-screen font-sans text-gray-800">
            <main className="flex-1 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý gói</h1>
                        <p className="text-sm text-gray-500 mt-1">Theo dõi toàn bộ gói bot đang có của hệ thống.</p>
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
                        <CreatePackage isCreateModal={isCreateModal} setIsCreateModal={setIsCreateModal} accessToken={accessToken} handleGetPriceBot={handleGetPriceBot} currentPage={currentPage} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center mb-2">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo gói..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        // value={searchTerm}
                        // onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
                            <option value={""}>Lãi suất</option>
                            <option value={"Admin"}>Thấp đến cao</option>
                            <option value={"User"}>Cao đến thấp</option>
                        </select>
                        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
                            <option value={""}>Lợi nhuận</option>
                            <option value={"true"}>Thấp đến cao</option>
                            <option value={"false"}>Cao đến thấp</option>
                        </select>
                        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
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
                                    <th className="px-6 py-4">Tên Bot</th>
                                    <th className="px-6 py-4">Số tháng</th>
                                    <th className="px-6 py-4">Giá tiền</th>
                                    <th className="px-6 py-4">Phần trăm giảm giá</th>
                                    <th className="px-6 py-4">Mô tả</th>
                                    <th className="px-6 py-4">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {listPriceBot?.items?.length > 0 ? listPriceBot?.items?.map((bot: any, index: number) => (
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
                                                <FaRegCalendar size={14} className="text-gray-400" />
                                                {bot.month}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaDollarSign size={14} className="text-gray-400" />
                                                {bot.price}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaPercent size={14} className="text-gray-400" />
                                                {bot.discount}
                                            </div>
                                        </td>
                                        <td className="text-right px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <MdOutlineDescription size={14} className="text-gray-400" />
                                                {bot.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPriceBot(bot);
                                                        setIsEditModal(true);
                                                    }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer" title="Chỉnh sửa">
                                                    <Edit size={16} />
                                                </button>

                                                <div
                                                    onClick={() => handleDeletePriceBot(bot.id)}
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
                    <EditPackage
                        currentPage={currentPage}
                        handleGetPriceBot={handleGetPriceBot}
                        isEditModal={isEditModal}
                        priceData={selectedPriceBot}
                        setIsEditModal={setIsEditModal}
                    />
                </div>
            </main>
        </div>
    )
}

export default Package;