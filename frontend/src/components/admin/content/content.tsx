'use client';

import { GetAccessToken } from "@/components/shared/token/accessToken";
import { RootState } from "@/redux/store";
import axios from "axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BsDownload, BsPlus, BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Swal from "sweetalert2";

const Content = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [listContent, setListContent] = useState<any>([]);
    const [accessToken, setAccessToken] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editOpen, setEditOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();
        handleGetContent(currentPage);
    }, [userInfo, accessToken, currentPage]);

    const handleGetContent = async (page: number) => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Content/GetListContent?pageSize=${process.env.NEXT_PUBLIC_PAGE_SIZE}&pageNumber=${page}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            setListContent(res.data.data);
        }).catch(err => {
            console.log(err);
        })
    }

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const handleContentEdit = async(contentId: string) =>{

    }

    const handleContentDelete = async (contentId: string) => {
        if (!accessToken) return;

        const result = await Swal.fire({
            title: "Bạn chắc chắn muốn xóa?",
            text: "Thao tác này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa content",
            cancelButtonText: "Hủy",
        });

        if (!result.isConfirmed) {
            toast.error(`Đã hủy xóa nội dung.`);
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}Content/DeleteContent?id=${contentId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
                toast.success(`Đã xóa nội dung thành công.`);
                handleGetContent(currentPage);
            }).catch(err => {
                toast.error(`Xóa nội dung thất bại.`);
            })
        } catch (error) {
            toast.error(`Xóa nội dung thất bại.`);
        }
    };

    return (
        <div className="flex min-h-screen font-sans text-gray-800">
            <main className="flex-1 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh sách nội dung</h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý nội dung, tin tức hiển thị trên website.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                            <BsDownload size={16} />
                            Xuất Excel
                        </button>
                        <button
                            // onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5">
                            <BsPlus size={16} />
                            Thêm mới
                        </button>
                        {/* <CreateUserForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} getListUser={getListUser} currentPage={currentPage} /> */}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tiêu đề, nội dung bài viết,..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        // value={searchTerm}
                        // onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50">
                            <option>Tất cả bài viết</option>
                            <option>Mới nhất</option>
                            <option>Cũ nhất</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="">
                        {listContent?.items?.length ? (
                            <div className="space-y-2">
                                {listContent.items.map((item: any) => {
                                    const formattedDate = format(new Date(item.createdDate), "dd/MM/yyyy", {
                                        locale: vi,
                                    });
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white hover:shadow hover:-translate-y-0.5 transition cursor-pointer duration-200"
                                        >
                                            <img
                                                src={item.urlAvatar}
                                                alt={item.title}
                                                className="w-40 h-40 rounded-xl object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {item.description}
                                                </p>

                                                <div className="text-xs text-gray-400 mt-1">{formattedDate}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditOpen(true);
                                                        handleContentEdit(item.id)
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                <button
                                                    onClick={() => handleContentDelete(item.id)}
                                                    className="text-red-400 hover:text-red-500 cursor-pointer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-sm">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
                        <span className="text-xs text-gray-500">
                            Hiển thị <span className="font-bold text-gray-800">{listContent?.items?.length}</span> trên tổng số <span className="font-bold text-gray-800">{listContent.totalItems}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: listContent.totalPages }, (_, i) => i + 1).map(page => (
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
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, listContent.totalPages))}
                                disabled={currentPage === listContent.totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    <motion.div>

                    </motion.div>
                </AnimatePresence>
                {/* <EditUser
                    isModalEditOpen={isModalEditOpen}
                    setIsModalEditOpen={setIsModalEditOpen}
                    userData={selectedUser}
                    onSave={(updatedData) => {
                        getListUser();
                    }}
                /> */}
            </main>
        </div>
    )
}

export default Content;