'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBolt, FaClock } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAccessToken } from "../shared/token/accessToken";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { MdOutlineSecurity, MdSettingsApplications, MdSpeed, MdSupportAgent } from "react-icons/md";
import { HiSignal } from "react-icons/hi2";
import { deductBalance, setBalance } from "@/redux/slices/walletSlice";

// === ĐÃ XÓA CÁC ĐỊNH NGHĨA HẰNG SỐ CŨ VÌ ĐÃ CHUYỂN SANG GLOBAL.CSS ===
// const DARK_BG_CARD = 'dark:bg-[#2A2C31]';
// ...

const features = [
    {
        icon: <MdSettingsApplications />,
        title: "Tối ưu",
        desc: "Thuật toán thiết kế chuyên biệt dựa trên hành vi thị trường Việt Nam, tăng độ chính xác.",
        bgColor: "bg-red-600/10",
        iconColor: "text-red-500"
    },
    {
        icon: <MdSpeed />,
        title: "Đơn giản & Nhanh chóng",
        desc: "Chỉ vài bước kích hoạt bot, chọn chiến lược phù hợp và bắt đầu giao dịch tự động.",
        bgColor: "bg-teal-600/10",
        iconColor: "text-teal-500"
    },
    {
        icon: <MdSupportAgent />,
        title: "Hỗ trợ kỹ thuật 24/7",
        desc: "Đội ngũ kỹ thuật giám sát bot và xử lý lỗi theo thời gian thực, đảm bảo bot hoạt động liên tục.",
        bgColor: "bg-amber-600/10",
        iconColor: "text-amber-500"
    },
    {
        icon: <MdOutlineSecurity />,
        title: "An toàn - Minh bạch",
        desc: "Sử dụng API chính thống, bảo mật dữ liệu tuyệt đối và minh bạch về lịch sử giao dịch.",
        bgColor: "bg-blue-600/10",
        iconColor: "text-blue-500"
    },
];

const featuresTimeline = [
    {
        icon: <HiSignal />,
        title: "Tự động đặt lệnh theo tín hiệu",
        desc: "Bot phân tích MA, RSI, MACD... và tự động Mua/Bán chính xác trong mili-giây, không bỏ lỡ cơ hội.",
        color: "text-red-500",
        borderColor: "border-red-500",
        bgAccent: "bg-red-500/10"
    },
    {
        icon: <IoIosWarning />,
        title: "Quản lý rủi ro thông minh",
        desc: "Tự động stop-loss, take-profit theo thuật toán tối ưu, bảo vệ vốn và phân bổ lợi nhuận.",
        color: "text-amber-500",
        borderColor: "border-amber-500",
        bgAccent: "bg-amber-500/10"
    },
    {
        icon: <FaClock />,
        title: "Theo dõi thị trường real-time",
        desc: "Luôn cập nhật mọi biến động giá, khối lượng và xu hướng ngay lập tức, đảmulate quyết định kịp thời.",
        color: "text-blue-500",
        borderColor: "border-blue-500",
        bgAccent: "bg-blue-500/10"
    },
    {
        icon: <FaBolt />,
        title: "Tối ưu chiến lược tự động",
        desc: "Phân tích dữ liệu lịch sử và backtest chiến lược hiệu quả nhất, đảm bảo bot hoạt động với hiệu suất cao.",
        color: "text-green-500",
        borderColor: "border-green-500",
        bgAccent: "bg-green-500/10"
    },
];

const Home = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const walletBalance = useSelector((state: RootState) => state.wallet.balance);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [listPriceBot, setListPriceBot] = useState<any>([]);
    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {
        handleGetListBot(currentPage);
    }, [currentPage]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();
        if (accessToken) {
            handleGetWallet();
        }
    }, [userInfo, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const handleGetListBot = async (page: number) => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}BotTrading/GetListBot?pageSize=${process.env.NEXT_PUBLIC_PAGE_SIZE}&pageNumber=${page}`)
            .then(res => {
                const data = res.data.data;
                const flatList = data.items.flatMap((bot: any) =>
                    bot.priceOptions.map((price: any) => ({
                        botId: bot.id,
                        nameBot: bot.nameBot,
                        interestRate: bot.interestRate,
                        totalProfit: bot.totalProfit,
                        commandNumber: bot.commandNumber,
                        winRate: bot.winRate,

                        priceId: price.id,
                        month: price.month,
                        price: price.price,
                        discount: price.discount,
                        description: price.description
                    }))
                );

                setListPriceBot(flatList);
            }).catch(err => {
                console.log(err);
            })
    }

    const handleBuyBot = async (bot: any) => {
        const accessToken = await GetAccessToken(userInfo?.Id);
        if (accessToken) {
            if (walletBalance && walletBalance >= bot.price) {
                Swal.fire({
                    title: 'Chọn phương thức thanh toán',
                    text: `Số dư ví của bạn đang có ${walletBalance.toLocaleString()} VNĐ. Bạn muốn sử dụng ví hay quét mã QR?`,
                    icon: 'question',
                    showDenyButton: true,
                    confirmButtonText: 'Dùng tiền trong ví',
                    denyButtonText: 'Thanh toán QR (PayOS)',
                    confirmButtonColor: '#28a745',
                    denyButtonColor: '#007bff',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        handleBuyWithWallet(bot);
                        const finalPrice = bot.price - (bot.price * bot.discount / 100);
                        dispatch(deductBalance(finalPrice));
                    } else if (result.isDenied) {
                        handleCreatePaymentLink(bot);
                    }
                });
            } else {
                handleCreatePaymentLink(bot);
            }
        } else {
            Swal.fire({
                text: "Vui lòng đăng nhập để mua Bot",
                icon: "warning",
                confirmButtonColor: "#2b7fff",
                confirmButtonText: "Đăng nhập ngay",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    router.push(`/auth/signin`);
                } else {

                }
            })
        }
    }

    const handleBuyWithWallet = async (bot: any) => {
        await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Payment/BuyBotByWallet`, {
            userId: userInfo?.Id,
            botTradingId: bot?.botId,
            priceBotId: bot?.priceId
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            toast.success('Mua bot thành công!');
        }).catch(err => {
            toast.error('Mua bot thất bại!');
        })
    }

    const handleCreatePaymentLink = async (bot: any) => {
        await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Payment/CreateBuyBotLink`, {
            userId: userInfo?.Id,
            botTradingId: bot?.botId,
            priceBotId: bot?.priceId
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            const paymentUrl = res?.data?.data;
            if (paymentUrl && typeof paymentUrl === 'string') {
                router.push(paymentUrl);
            }
        }).catch(err => {
            toast.error('Tạo thanh toán thất bại!');
        })
    }

    const handleGetWallet = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Wallet/GetMoneyInWallet?userId=${userInfo?.Id}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            dispatch(setBalance(res.data.data.balance));
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="">
            <div className="relative w-full h-[90vh] xs:h-[90vh] md:h-dvh laptop:h-[90vh] overflow-hidden">
                <div
                    className="absolute inset-0 flex flex-col xs:flex-col-reverse lg:flex-row items-center justify-center gap-10 lg:gap-20 px-4 xs:px-6 sm:px-10 lg:px-[8%] max-w-[1500px] mx-auto"
                >
                    <div
                        className="space-y-6 sm:space-y-4 max-w-[550px] text-center lg:text-left"
                        data-aos="fade-right"
                        data-aos-duration="1000"
                    >
                        <h1
                            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[3rem] font-extrabold leading-tight tracking-wide"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            Giao Dịch Tự Động, Lợi Nhuận Tối Ưu
                        </h1>
                        <p
                            className="text-base sm:text-lg dark:text-gray-300 text-black"
                            data-aos="fade-up"
                            data-aos-delay="500"
                        >
                            Bot AI của AutoBot tối ưu phân tích thị trường 24/7, thực hiện giao dịch chính xác theo chiến lược đã tối ưu.
                        </p>
                        <button
                            className="mt-4 bg-blue-400 hover:bg-blue-500 dark:text-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 cursor-pointer"
                            data-aos="fade-up"
                            data-aos-delay="700"
                        >
                            Khám Phá Các Gói Bot
                        </button>
                        <div
                            className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400"
                            data-aos="fade-up"
                            data-aos-delay="900"
                        >
                            <span>Được tin dùng bởi hơn 1000+ nhà đầu tư</span>
                            <div className="flex space-x-3 mt-1 sm:mt-0 dark:text-white text-black">
                                <span className="font-bold">BINANCE</span>
                                <span className="font-bold">NASDAQ</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="hidden xs:flex tablet:flex relative justify-center w-full lg:w-auto mt-10 lg:mt-0"
                        data-aos="fade-left"
                        data-aos-duration="1000"
                    >
                        <div
                            className="relative w-[320px] xs:w-[400px] sm:w-[480px] md:w-[550px] lg:w-[650px] h-[300px] xs:h-[250px] sm:h-[400px] lg:h-[400px] rounded-xl bg-[#292A2E] border border-[#3A3B40] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="w-full h-full">
                                <Image
                                    src="/assets/images/home/herosection.jpg"
                                    alt="Trading Chart"
                                    width={1000}
                                    height={500}
                                    objectFit="contain"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION: LÝ DO CHỌN (FEATURES) --- */}
            <section className="py-16 xs:pt-0 xs:pb-18 sm:py-20 text-(--color-text-main)">
                <h2
                    data-aos="fade-up"
                    className="text-center text-3xl xs:text-4xl sm:text-[2.8rem] font-extrabold tracking-tight"
                >
                    Lý Do Bạn Nên <span className="text-blue-400">Chọn Chúng Tôi</span>
                </h2>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-[6%] max-w-7xl mx-auto">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={150 * index}
                            // ÁP DỤNG BIẾN MÀU: Nền & Viền
                            className={`bg-(--color-bg-card) rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-(--color-border-card) cursor-pointer`}
                        >
                            <div
                                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl ${item.bgColor} ${item.iconColor} mb-4`}
                            >
                                {item.icon}
                            </div>
                            <h3 className={`mt-4 font-bold text-xl text-(--color-text-main)`}>{item.title}</h3>
                            <p className={`mt-2 text-base text-(--color-text-secondary) leading-relaxed`}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION: TÍNH NĂNG VƯỢT TRỘI (TIMELINE) --- */}
            <section className=" py-14 sm:py-24 text-(--color-text-main)">
                <h2
                    data-aos="fade-up"
                    className="text-center text-3xl xs:text-4xl sm:text-[2.8rem] font-extrabold tracking-tight mb-16"
                >
                    Tính Năng Vượt Trội Của <span className="text-blue-400">Hệ Thống</span>
                </h2>

                <div className="relative mx-auto max-w-4xl">
                    <div className="absolute left-6 xs:left-8 top-1 bottom-0 w-0.5 bg-gray-600 rounded-full" />

                    <div className="space-y-12 sm:space-y-16 pl-16 xs:pl-17">
                        {featuresTimeline.map((item, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={200 * index}
                                className="relative"
                            >
                                {/* Icon Div (Vòng tròn) - ÁP DỤNG BIẾN MÀU: Nền & Viền */}
                                <div
                                    className={`absolute -left-[61px] top-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 ${item.borderColor} ${item.color} bg-(--color-bg-card)`}
                                >
                                    {item.icon}
                                </div>

                                {/* Content Div - ÁP DỤNG BIẾN MÀU: Nền & Viền */}
                                <div className={`bg-(--color-bg-card) p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-(--color-border-card)`}>
                                    <h3 className={`text-xl font-bold ${item.color}`}>{item.title}</h3>
                                    {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                    <p className={`text-(--color-text-secondary) mt-2 leading-relaxed`}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION: BẢNG GIÁ DỊCH VỤ (PRICING) --- */}
            <section className="py-14 sm:pb-24">
                <h2
                    data-aos="fade-up"
                    // ÁP DỤNG BIẾN MÀU: Chữ chính
                    className={`text-center text-3xl xs:text-4xl sm:text-[2.8rem] font-extrabold tracking-tight text-(--color-text-main) mb-16`}
                >
                    Bảng Giá <span className="text-blue-400">Dịch Vụ</span>
                </h2>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-2 lg:grid-cols-3 laptop:grid-cols-4 gap-8 px-6 sm:px-10 tablet:mx-10 laptop:mx-auto lg:px-0 max-w-7xl mx-auto"
                >
                    {listPriceBot.length ? (
                        listPriceBot.map((bot: any, index: number) => (
                            <div
                                onClick={() => handleBuyBot(bot)}
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={100 + index * 100}
                                // ÁP DỤNG BIẾN MÀU: Nền & Viền
                                className={`relative group w-full rounded-2xl p-6 sm:p-2 bg-(--color-bg-card) backdrop-blur-md border border-(--color-border-card) shadow-xl transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-[1.03] cursor-pointer text-white`}
                            >
                                {bot.discount !== 0 && (
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-linear-to-r from-red-600 to-orange-500 dark:text-white text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                                        {bot.discount}%
                                    </div>
                                )}

                                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-400/10 to-blue-400/20 opacity-0 group-hover:opacity-100 blur-2xl transition duration-700"></div>

                                <div className="relative p-5 z-10">
                                    <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-all duration-500 group-hover:scale-110 mb-4 bg-linear-to-br from-blue-400 to-teal-400">
                                        <Image
                                            width={1000}
                                            height={500}
                                            alt="Image"
                                            src={`/assets/images/logo.png`}
                                            className="w-15 h-15" />
                                    </div>
                                    {/* ÁP DỤNG BIẾN MÀU: Chữ chính */}
                                    <h3 className={`text-2xl font-bold text-center mt-4 text-(--color-text-main)`}>{bot.nameBot}</h3>

                                    {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                    <p className={`text-center text-(--color-text-secondary) text-sm mt-2`}>
                                        Bot giao dịch thuật toán học máy, tối ưu lợi nhuận.
                                    </p>
                                    <div className={`mt-6 space-y-3 border-t border-b border-gray-300 dark:border-gray-700 py-4 text-(--color-text-secondary)`}>
                                        <div className="flex justify-between text-base">
                                            {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                            <span className={`text-(--color-text-secondary)`}>Thời hạn:</span>
                                            <span className="font-bold">{bot.month} tháng</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                            <span className={`text-(--color-text-secondary)`}>Giá:</span>
                                            <span className={`font-bold ${bot.discount !== 0 ? 'line-through text-red-400' : `text-(--color-text-main)`}`}>
                                                {new Intl.NumberFormat("vi-VN").format(bot.price)}đ
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                            <span className={`text-(--color-text-secondary)`}>Lãi suất:</span>
                                            <span className="font-bold text-green-500">{bot.interestRate}% / tháng</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                            <span className={`text-(--color-text-secondary)`}>Tổng lợi nhuận:</span>
                                            <span className="font-bold text-green-500">{bot.totalProfit}%</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                            <span className={`text-(--color-text-secondary)`}>Số lệnh:</span>
                                            <span className="font-bold">{bot.commandNumber} lệnh</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            {/* ÁP DỤNG BIẾN MÀU: Chữ phụ */}
                                            <span className={`text-(--color-text-secondary)`}>Tỉ lệ thắng:</span>
                                            <span className="font-bold text-green-500">{bot.winRate}%</span>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => handleBuyBot(bot)}
                                        className="w-full mt-6 py-3 rounded-xl font-extrabold text-white text-center shadow-lg transition-all duration-300 active:scale-95 hover:shadow-xl cursor-pointer bg-linear-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                                    >
                                        {new Intl.NumberFormat("vi-VN").format((bot.price) - (bot.price * bot.discount / 100))}₫ / {bot.month} tháng
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center items-center">
                            <div className="text-center">
                                <p className="text-gray-500 text-xl font-medium">Không có dữ liệu</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;