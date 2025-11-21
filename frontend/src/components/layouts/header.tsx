'use client';
import { RootState } from "@/redux/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { FaCog, FaHistory, FaUser } from "react-icons/fa";
import { IoIosSearch, IoIosWallet } from "react-icons/io";
import { IoCloseCircle, IoCloudDownload } from "react-icons/io5";
import { PiUserCircleFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getYear, parseISO } from "date-fns";
import { RiCoupon3Fill, RiGitRepositoryPrivateFill, RiRobot2Fill } from "react-icons/ri";
import { MdDarkMode } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

const Header = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [isTop, setIsTop] = useState<boolean>(true);
    const [user, setUser] = useState<any>('');
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();

    const mainMenu = [
        { icon: <FaUser />, label: "Hồ sơ của bạn", href: "/information" },
        { icon: <IoIosWallet />, label: "Nạp / Rút tiền", href: "/wallet" },
        { icon: <RiRobot2Fill />, label: "Bot đã mua", href: "" },
        { icon: <RiCoupon3Fill />, label: "Hạng thành viên", href: "" },

    ];

    const subMenu = [
        { icon: <MdDarkMode />, label: "Chế động tối", href: "" },
        { icon: <FaHistory />, label: "Quản lý thiết bị", href: "/devices" },
        { icon: <RiGitRepositoryPrivateFill />, label: "Quyền riêng tư & bảo mật", href: "" },
        { icon: <FaCog />, label: "Cài đặt", href: "" },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY < 650);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsLoadingUser(false);
    }, [userInfo]);

    useEffect(() => {
        if (!userInfo?.Id) return;
        axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${userInfo?.Id}`)
            .then(res => {
                setUser(res.data.data);
            }).catch(err => {
                console.log(err);
            })
    }, [userInfo]);

    const handleUserClick = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        toast.success("Đăng xuất thành công!");
        setTimeout(() => {
            window.location.replace("/auth/signin");
        }, 1000);
    };

    return (
        <div className="sticky top-3 z-90 mx-10">
            <div
                className={`w-full h-20 flex items-center rounded-[50px] justify-between px-10 sticky top-0 z-50 backdrop-blur-md transition-colors 
                ${isTop ? "bg-white/10" : "bg-white/5"}`}>

                <div className="flex items-center">
                    <Image
                        className="h-[50px] w-[50px]"
                        width={1000}
                        height={500}
                        alt="Logo"
                        src={"/assets/images/logo.png"}
                        loading="lazy"
                    />
                </div>

                <div
                    className={`flex items-center gap-10 text-[17px]
                    ${isTop ? "text-white dark:text-white" : "text-black dark:text-black"}`}
                >

                    <Link href="/" className="relative group hover:text-blue-400 transition-all duration-100">
                        <span className="inline-block leading-none relative
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-0.5 after:w-0 after:bg-blue-400
                            after:transition-all after:duration-300
                            group-hover:after:w-full">
                            Trang chủ
                        </span>
                    </Link>
                    <Link href="/introduction" className="relative group hover:text-blue-400 transition-all duration-100">
                        <span className="inline-block leading-none relative
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-0.5 after:w-0 after:bg-blue-400
                            after:transition-all after:duration-300
                            group-hover:after:w-full">
                            Giới thiệu
                        </span>
                    </Link>

                    <Link href="/price" className="relative group hover:text-blue-400 transition-all duration-100">
                        <span className="inline-block leading-none relative
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-0.5 after:w-0 after:bg-blue-400
                            after:transition-all after:duration-300
                            group-hover:after:w-full">
                            Bảng giá dịch vụ
                        </span>
                    </Link>

                    <Link href="" className="relative group hover:text-blue-400 transition-all duration-100">
                        <span className="inline-block leading-none relative
                            after:content-[''] after:absolute after:left-0 after:-bottom-1
                            after:h-0.5 after:w-0 after:bg-blue-400
                            after:transition-all after:duration-300
                            group-hover:after:w-full">
                            Tải Extension
                        </span>
                    </Link>

                    <div onClick={handleUserClick} className={`relative group flex items-center gap-2 cursor-pointer`}>
                        {isLoadingUser ? (
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                                <div className="h-4 w-30 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        ) : user ? (
                            <>
                                {user.urlAvatar ? (
                                    <Image loading="lazy" width={1000} height={1000} src={user.urlAvatar} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <PiUserCircleFill className={`text-4xl ${isTop ? "text-white" : "text-black"} hover:text-blue-400`} />
                                )}
                                <span className={`text-[17px] transition ${isTop ? "text-white" : "text-black"} hover:text-[#334eac"]`}>
                                    {user.fullName}
                                </span>
                            </>
                        ) : (
                            <>
                                <IoIosSearch />
                                <Link href="/auth/signin" className="block py-2 px-5 hover:scale-105 hover:bg-blue-500 rounded-3xl hover:text-white transition-all duration-300">
                                    Tài khoản
                                </Link>
                            </>
                        )}
                        <div className="absolute top-3 left-[10%] -translate-x-1/9 mt-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-3 w-36 hidden z-50 text-white">
                            {isLoadingUser ? (
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/5 animate-pulse"></div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isModalOpen && userInfo && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-60 cursor-pointer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={handleCloseModal}
                        />

                        <motion.div
                            className="fixed top-0 right-0 h-full w-84 bg-[#f5f5f5] dark:bg-gray-800 z-70 p-4"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <div>
                                <div className="relative">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm font-semibold text-gray-600 ">Xin chào, {user && user.fullName}</div>
                                        <div onClick={handleCloseModal}>
                                            <IoCloseCircle className="text-gray-400 hover:text-gray-500 transition-all duration-300 cursor-pointer" />
                                        </div>
                                    </div>

                                    <motion.div
                                        className="absolute z-80 top-10 right-0 w-[400px] h-[350px] bg-white shadow-3xl rounded-2xl"
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ ease: 'easeOut', bounce: .3, duration: 0.4, delay: 0.1 }}
                                    >
                                        <div className="p-5">
                                            <div className="flex flex-col justify-center items-center">
                                                {user && (
                                                    <Image
                                                        loading="lazy"
                                                        width={1000}
                                                        height={1000}
                                                        alt="Avt người dùng"
                                                        src={user.urlAvatar || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="}
                                                        className={`w-30 h-30 rounded-full object-cover`}
                                                    />
                                                )}
                                                <div className="mt-2 text-lg font-semibold">
                                                    {user && user.fullName}
                                                </div>
                                                <div className="mt-2 text-lg font-semibold">
                                                    Thành viên từ {user && user.createdDate ? getYear(parseISO(user.createdDate)) : "N/A"}
                                                </div>
                                            </div>
                                            <div className="mt-5 flex justify-between items-start">
                                                <div className="flex-1 flex flex-col items-center">
                                                    <div className="text-2xl font-bold">1.234.567đ</div>
                                                    <div className="mt-1 text‑sm text-gray-500">Ví AutoBot</div>
                                                </div>

                                                <div className="w-0.5 h-18 bg-gray-400 mx-4"></div>

                                                <div className="flex-1 flex flex-col items-center">
                                                    <div className="text-2xl font-bold">Bạc</div>
                                                    <div className="mt-1 text-sm text-gray-500">Hội viên</div>
                                                </div>
                                            </div>
                                        </div>

                                    </motion.div>
                                </div>
                            </div>
                            <div className="mt-95 pt-4">
                                <div className="border border-gray-200 bg-white rounded-xl">
                                    {mainMenu.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className={`
                    flex items-center gap-5 py-3 px-4 font-semibold 
                    hover:text-blue-500 transition-all duration-200 cursor-pointer
                    ${index !== 0 ? "border-t border-gray-300" : ""}
                `}
                                        >
                                            {item.icon}
                                            <div>{item.label}</div>
                                        </Link>
                                    ))}

                                </div>
                            </div>
                            <div className="mt-2 pt-4">
                                <div className="border border-gray-200 bg-white rounded-xl">
                                    {subMenu.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className={`
                    flex items-center gap-5 py-3 px-4 font-semibold 
                    hover:text-blue-500 transition-all duration-200 cursor-pointer
                    ${index !== 0 ? "border-t border-gray-300" : ""}
                `}
                                        >
                                            {item.icon}
                                            <div>{item.label}</div>
                                        </Link>
                                    ))}

                                </div>
                            </div>
                            <div onClick={() => setIsOpen(true)} className="mt-10 flex items-center justify-center gap-2 py-2 font-semibold bg-blue-400 hover:bg-blue-500 text-white rounded-sm transition-all duration-100 cursor-pointer">
                                <TbLogout2 />
                                <div>
                                    Đăng xuất
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="fixed inset-0 z-70 flex items-center justify-center"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                                <h2 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h2>
                                <p className="mb-6">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        className="px-4 py-2 rounded-md border border-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white cursor-pointer transition-all duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Không
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

    )
}

export default Header;
