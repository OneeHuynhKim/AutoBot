'use client';
import Image from "next/image";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { GoDotFill } from "react-icons/go";
import { TbPigMoney } from "react-icons/tb";
import { FaShieldAlt } from "react-icons/fa";
import { IoIosSettings, IoIosTrendingUp } from "react-icons/io";

const IntroductionPage = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const target = [
        {
            icon: <TbPigMoney />,
            title: "Tiết kiệm thời gian",
            bgColor: "bg-teal-600/10",
            iconColor: "text-yellow-500",
        },
        {
            icon: <FaShieldAlt />,
            title: "Hạn chế rủi ro cảm tính",
            bgColor: "bg-teal-600/10",
            iconColor: "text-red-500",
        },
        {
            icon: <IoIosSettings />,
            title: "Tối ưu hóa danh mục đầu tư",
            bgColor: "bg-teal-600/10",
            iconColor: "text-teal-500",
        },
        {
            icon: <IoIosTrendingUp />,
            title: "Gia tăng lợi nhuận bền vững theo chiến lược khoa học",
            bgColor: "bg-teal-600/10",
            iconColor: "text-blue-500",
        }
    ]

    return (
        <div className="text-black dark:text-white mt-3 h-full w-full">
            <div className="h-[630px] p-40">
                <div className="flex justify-center gap-24">
                    <div>
                        <div
                            data-aos="fade-up-right"
                            data-aos-delay="700"
                            className="text-[30px] text-center font-semibold ">Chào Mừng Bạn Đến Với <br /> <span className="text-[44px] text-blue-400 font-semibold">Bot Đầu Tư Chứng Khoán</span></div>
                        <div
                            data-aos="fade-up-right"
                            data-aos-delay="900"
                            className="left-15 top-55 w-[600px] leading-8 text-justify">Bước vào kỷ nguyên 4.0, đầu tư chứng khoán không còn chỉ dựa vào cảm tính. Bot Đầu Tư Chứng Khoán ứng dụng AI và machine learning trên nền tảng Amibroker, giúp nhà đầu tư tối ưu danh mục và gia tăng hiệu quả sinh lời.</div>
                    </div>
                    <div
                        data-aos="fade-up-left"
                        data-aos-delay="1200">
                        <Image width={1000} height={1000} alt="introduction" src={'/assets/images/introduction/introduction.jpg'}
                            className="w-[400px] h-[300px] rounded-2xl" />
                    </div>
                </div>
            </div>

            <div className="text-center text-3xl xs:text-4xl sm:text-[2.8rem] font-extrabold tracking-tight mb-16"><span className="text-blue-400">Mục Tiêu </span>Của Chúng Tôi</div>
            <div className="flex gap-24 justify-center text-center mt-14">
                {
                    target.map((item, index) => (
                        <div key={index}
                            data-aos="fade-up"
                            data-aos-delay={150 * index} className="flex flex-col items-center p-5 w-[200px] h-[200px] bg-(--color-bg-card) rounded-2xl shadow-xl border border-(--color-border-card)">
                            <div className="rounded-[100%] w-20 h-20 border flex justify-center items-center mb-5">
                                <div className={`rounded-[100%] ${item.iconColor} text-[40px] `}>{item.icon}</div>
                            </div>
                            <h3 className="text-[0.8rem]">{item.title}</h3>
                        </div>
                    ))
                }
            </div>

            <div className="mt-10 mb-10">
                <div className="text-center text-3xl xs:text-4xl sm:text-[2.8rem] font-extrabold tracking-tight mb-16"><span className="text-blue-400">Công Nghệ </span>Vượt Trội</div>
                <div className="flex">
                    <div className="relative border-r w-1/2 h-[480px] border-(--color-border-card) px-16 flex flex-col gap-20">
                        <div className="absolute w-[650px] left-[750px] top-7">
                            <div className="w-5 h-5 rounded-[100%] bg-red-500 "></div>
                        </div>
                        <div className="absolute w-[650px] left-[750px] top-38">
                            <div className="w-5 h-5 rounded-[100%] bg-blue-500 "></div>
                        </div>
                        <div className="absolute w-[650px] left-[750px] top-72">
                            <div className="w-5 h-5 rounded-[100%] bg-yellow-500 "></div>
                        </div>
                        <div className="absolute w-[650px] left-[750px] top-104">
                            <div className="w-5 h-5 rounded-[100%] bg-green-500 "></div>
                        </div>
                        <div
                            data-aos="fade-up-right"
                            data-aos-delay="500"
                            className="w-[650px] h-20 border border-(--color-border-card) bg-(--color-bg-card) rounded-2xl text-xl flex flex-col items-left p-3 mb-20">
                            <div className="flex items-center font-semibold text-red-500">
                                <GoDotFill /> AI và Machine Learning
                            </div>
                            <div>
                                Dự đoán xu hướng dựa trên mô hình học dữ liệu lịch sử.
                            </div>
                        </div>
                        <div
                            data-aos="fade-up-right"
                            data-aos-delay="700"
                            className="w-[650px] h-20 border border-(--color-border-card) bg-(--color-bg-card) rounded-2xl text-xl flex flex-col items-left p-3">
                            <div className="flex items-center font-semibold text-yellow-500">
                                <GoDotFill /> Tự động hóa chiến lược đầu tư
                            </div>
                            <div>
                                Bot thực thi lệnh dựa trên tính hiệu đã tính toán sẵn.
                            </div>
                        </div>
                    </div>
                    <div className="mx-7 mt-28 flex flex-col gap-16">
                        <div
                            data-aos="fade-up-left"
                            data-aos-delay="600"
                            className="w-[650px] h-28 border border-(--color-border-card) bg-(--color-bg-card) rounded-2xl text-xl flex flex-col items-left p-3 mb-20">
                            <div className="flex items-center font-semibold text-blue-500">
                                <GoDotFill /> Phân tích kỹ thuật thông minh
                            </div>
                            <div>
                                Tích hợp hàng trăm chỉ báo phân tích từ Amibroker, liên tục cập nhật và tối ưu.
                            </div>
                        </div>
                        <div
                            data-aos="fade-up-left"
                            data-aos-delay="800"
                            className="w-[650px] h-28 border border-(--color-border-card) bg-(--color-bg-card) rounded-2xl text-xl flex flex-col items-left p-3">
                            <div className="flex items-center font-semibold text-green-500">
                                <GoDotFill /> Tùy chỉnh linh hoạt
                            </div>
                            <div>
                                Nhà đầu tư có thể thiết lập chiến lược riêng phù hợp với phong cách và mục tiêu lợi nhuận.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <div className="text-center text-3xl xs:text-4xl sm:text-[2.8rem] font-extrabold tracking-tight mb-16"><span className="text-blue-400">Sản Phẩm </span>Của Chúng Tôi</div>
                {/* Để mấy con bot dô đây dùm t, t k biết lấy ra */}
            </div>
        </div >
    )
}

export default IntroductionPage;