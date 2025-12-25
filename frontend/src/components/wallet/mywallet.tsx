'use client';

import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaHistory,
    FaEye,
    FaEyeSlash,
    FaChartBar,
    FaBell,
    FaMinus
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { formatCurrency } from "../shared/currency/formatCurrency";
import { useRouter } from "next/navigation";
import { formatDateFunc } from "../shared/date/formatDate";
import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import { GetAccessToken } from "../shared/token/accessToken";
import { data } from "framer-motion/client";
import handleUpload from "../shared/cloudinary/upload-image";

type ChartPoint = {
    x: string;
    y: number;
    transactionType: string;
    amount: number;
};

const MyWallet = () => {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState<string>('');
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState(true);
    const [user, setUser] = useState<any>('');
    const [wallet, setWallet] = useState<any>('');
    const [transaction, setTransaction] = useState<any[]>([]);
    const [openWithdrawMoney, setOpenWithdrawMoney] = useState<boolean>(false);
    const [banks, setBanks] = useState<Array<{ code: string; name: string; logo: string }>>([]);
    const [selectedBank, setSelectedBank] = useState<any>("");
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const currentMonth = format(new Date(), 'MM');

    const [bankUserName, setBankUserName] = useState<string>("");
    const [bankCode, setBankCode] = useState<string>("");
    const [qrCode, setQrCode] = useState<string>("");
    const [amounty, setAmounty] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const hasQr = !!qrCode?.trim();
    const [openPreview, setOpenPreview] = useState<boolean>(false);


    const currentMonthTransactions = transaction.filter(tx => {
        const txDate = parseISO(tx.timestamp);
        return isWithinInterval(txDate, { start: startOfCurrentMonth, end: endOfCurrentMonth });
    });
    //sửa dùm đoạn này lấy token lại///////////////////////////////
    useEffect(() => {
        const loadAll = async () => {
            if (!userInfo?.Id) return;
            let token = accessToken;
            if (!token) {
                token = await GetAccessToken(userInfo.Id);
                if (!token) {
                    console.warn("Không lấy được token!");
                    return;
                }
                setAccessToken(token);
            }
            handleGetUser();
            handleGetWallet(token);
            handleGetTransaction(token);
        };

        loadAll();
    }, [userInfo]);
    //////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        axios.get('https://api.vietqr.io/v2/banks')
            .then(res => {
                if (res.data?.data) {
                    console.log(res.data);
                    setBanks(res.data.data);
                }

            })
            .catch(err => {
                console.error('Không tải được danh sách ngân hàng', err);
            });
    }, []);

    useEffect(() => {
        if (openWithdrawMoney) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openWithdrawMoney]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadData = async () => {
        setIsLoadingUser(false);
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };


    const handleSelect = (bank: any) => {
        setSelectedBank(bank);
        setSearchTerm(bank.name);
        setOpen(false);
    };

    const filteredBanks = banks.filter((bank) => {
        const keyword = searchTerm.toLowerCase();
        return (
            bank.name.toLowerCase().includes(keyword) ||
            bank.code.toLowerCase().includes(keyword)
        );
    });


    const handleGetUser = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${userInfo?.Id}`)
            .then(res => {
                setUser(res.data.data);
            }).catch(err => {
                console.log(err);
            });
    }

    const chartData: ChartPoint[] = currentMonthTransactions
        .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((tx: any) => ({
            x: format(new Date(tx.timestamp), "dd/MM"),
            y: tx.balanceAfter || tx.amount,
            transactionType: tx.transactionType,
            amount: tx.amount
        }));


    const handleGetTransaction = async (accessToken: string) => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}WalletTransaction/GetHistory?userId=${userInfo?.Id}&pageNumber=${1}&pageSize=${10}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
            .then(res => {
                setTransaction(res.data.data);
            }).catch(err => {
                console.log(err);
            });
    }

    const handleGetWallet = async (accessToken: string) => {
        if (!accessToken) {
            toast.error('Bạn chưa đăng nhập, vui lòng đăng nhập');
            return;
        }
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Wallet/GetMoneyInWallet?userId=${userInfo?.Id}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            setWallet(res.data.data);
        }).catch(err => {
            console.log(err);
        })
    }


    const width = 1100;
    const height = 180;

    const generateSVGPath = (data: any) => {
        if (data.length === 0) return "";
        const scaleX = width / (data.length - 1);
        const scaleY = (value: any) => height - ((value - minY) / (maxY - minY)) * height;

        let d = `M0,${scaleY(data[0].y)}`;
        data.forEach((point: any, i: number) => {
            const x = i * scaleX;
            const y = scaleY(point.y);
            d += ` L${x},${y}`;
        });
        return d;
    };

    const maxY = Math.max(...chartData.map((d: any) => d.y));
    const minY = Math.min(...chartData.map((d: any) => d.y));

    const pathD = generateSVGPath(chartData);

    const hanldeRequestMoney = async () => {
        try {
            const payload = {
                bankName: searchTerm ?? "",
                bankAmount: Number(amounty.replace(/\./g, "")) || 0,
                bankCode: hasQr ? "Không" : (bankCode?.trim() || "Không"),
                userBankName: hasQr ? "Không" : (bankUserName?.trim() || "Không"),
                qrCode: hasQr ? qrCode.trim() : "Không",
                note: note?.trim() || "Không",
                userId: userInfo.Id
            };

            if (!payload.bankAmount || payload.bankAmount <= 0) {
                toast.error("Số tiền không hợp lệ");
                return;
            }

            if (!payload.qrCode && (!payload.bankCode || !payload.userBankName)) {
                toast.error("Vui lòng nhập Số TK hoặc tải QR");
                return;
            }


            if (hasQr && qrCode) {
                try {
                    const formData = new FormData();
                    const fileBlob = await fetch(qrCode).then(r => r.blob());

                    formData.append("file", fileBlob, "qr.png");

                    const qrRes = await axios.post(
                        "https://api.qrserver.com/v1/read-qr-code/",
                        formData
                    );

                    const qrText = qrRes?.data?.[0]?.symbol?.[0]?.data;

                    if (!qrText) {
                        toast.error("QR không hợp lệ, vui lòng thử ảnh khác");
                        return;
                    }
                } catch (e) {
                    toast.error("Không thể kiểm tra QR. Vui lòng thử lại");
                    return;
                }
            }

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_URL_API}Payment/RequestWithdrawMoney`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (res.data.status === 200) {
                toast.success("Gửi yêu cầu thành công");
                setOpenWithdrawMoney(false);
                setBankUserName("");
                setSearchTerm("");
                setAmounty("");
                setBankCode("");
                setQrCode("");
                setNote("");
                setPreviewImage("");
            } else {
                console.log(res.data);
            }
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8 flex justify-center">

            <div className="w-full max-w-6xl space-y-6">

                <div className="flex items-center justify-between pb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Ví Của Tôi</h1>
                        <p className="text-slate-500 text-sm">Quản lý chi tiêu cá nhân</p>
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-colors text-slate-600">
                        <FaBell />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-7 flex flex-col h-full">
                        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg h-full flex flex-col justify-between min-h-[300px]">

                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-blue-50 border border-white/10">
                                        <FaWallet /> Tài khoản chính
                                    </div>
                                    <button onClick={() => setIsVisible(!isVisible)} className="text-blue-100 hover:text-white transition-colors opacity-80 hover:opacity-100 cursor-pointer">
                                        {isVisible ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>

                                <div className="mb-10">
                                    <div>
                                        <p className="text-blue-100 text-sm mb-1 font-medium opacity-80">Chủ tài khoản</p>
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                                                {user && (
                                                    <div className="text-2xl uppercase font-bold">
                                                        {user.fullName}
                                                    </div>
                                                )}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <p className="text-blue-100 text-sm mb-1 font-medium opacity-80">Số dư khả dụng</p>
                                        <div className="flex gap-2">
                                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                                                {isVisible
                                                    ? "*********"
                                                    : user && wallet ? (
                                                        <div className="text-2xl font-bold">
                                                            {formatCurrency(wallet.balance)}
                                                        </div>
                                                    ) : (
                                                        <div className="text-2xl font-bold text-emerald-600">
                                                            Chưa kích hoạt ví
                                                        </div>
                                                    )}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
                                <button onClick={() => router.push(`/wallet/mywallet/deposit`)} className="flex items-center justify-center gap-2 bg-white text-blue-700 py-3.5 rounded-xl font-bold transition-all hover:bg-blue-50 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer">
                                    <FaArrowDown /> Nạp Tiền
                                </button>
                                <button
                                    onClick={() => setOpenWithdrawMoney(true)}
                                    className="flex items-center justify-center gap-2 bg-blue-800/50 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold backdrop-blur-sm transition-all border border-blue-400/30 active:scale-[0.98] cursor-pointer">
                                    <FaArrowUp /> Rút Tiền
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden min-h-[300px]">
                            <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                    <FaHistory className="text-slate-400" /> Biến động số dư
                                </h3>
                                <button className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Xem tất cả</button>
                            </div>

                            {transaction.length ? (
                                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                    <div className="space-y-1">
                                        {transaction.map((tx: any) => (
                                            <div key={tx.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                                        ${tx.transactionType === 'Tiền nạp' || tx.transactionType === 'Tiền rút' || tx.transactionType === 'Mua bot'
                                                                ? 'bg-green-50 text-green-600'
                                                                : 'bg-slate-50 text-slate-600'
                                                            }`}
                                                    >
                                                        {tx.transactionType === 'Tiền nạp' && <FaArrowUp />}
                                                        {tx.transactionType === 'Tiền rút' && <FaArrowDown />}
                                                        {tx.transactionType === 'Mua bot' && <FaMinus />}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 line-clamp-1">
                                                            {tx.description}
                                                        </p>

                                                        <p className="text-[11px] text-slate-400">
                                                            {formatDateFunc(tx.timestamp)}
                                                        </p>

                                                        {tx.transactionStatus === 'Success' && (
                                                            <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                                                                Thành công
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0 pl-2">
                                                    <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                                                        {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(tx.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-10 flex items-center justify-center">Bạn chưa có giao dịch</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaChartBar className="text-blue-500" /> Biểu đồ chi tiêu
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">Theo dõi biến động số dư trong tháng</p>
                        </div>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg self-end sm:self-auto">
                            <button className="px-4 py-1.5 text-xs font-bold text-white bg-white shadow-sm rounded-md">Tuần</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Tháng {currentMonth}</button>
                        </div>
                    </div>

                    {transaction.length ? (
                        <div className="relative h-56 w-full">
                            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300">
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                            </div>

                            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" width={width} height={height}>
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                {chartData.map((p: any, i: number) => {
                                    const x = (i / (chartData.length - 1)) * width;
                                    const y = height - ((p.y - minY) / (maxY - minY)) * height;

                                    return (
                                        <circle
                                            key={i}
                                            cx={x}
                                            cy={y}
                                            r="5"
                                            fill="#3b82f6"
                                            stroke="white"
                                            strokeWidth="2"
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        />
                                    );
                                })}
                            </svg>

                            {hoveredIndex !== null && (
                                <div
                                    className="absolute w-fit bg-white p-5 rounded-md shadow-lg text-xs text-center font-semibold pointer-events-none"
                                    style={{
                                        left: `${(hoveredIndex / (chartData.length - 1)) * width}px`,
                                        top: `${height - ((chartData[hoveredIndex].y - minY) / (maxY - minY)) * height - 40}px`,
                                        transform: "translateX(-50%)"
                                    }}
                                >
                                    <div>{chartData[hoveredIndex].transactionType}</div>
                                    <div>{chartData[hoveredIndex].amount > 0 ? "+" : ""}{chartData[hoveredIndex].amount}đ</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">Bạn chưa thực hiện giao dịch giao dịch</div>
                    )}
                </div>
            </div>
            {openWithdrawMoney && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        hanldeRequestMoney();
                    }}
                >
                    <div>
                        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-start p-4">


                            <div className="bg-white w-full mt-2 max-w-md z-50 rounded-2xl shadow-xl relative animate-fadeIn overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Yêu Cầu Rút Tiền</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-600">Số tiền muốn rút</label>
                                            <input
                                                value={amounty}
                                                type="text"
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, "");
                                                    const formatted = raw ? Number(raw).toLocaleString("vi-VN") : "";
                                                    setAmounty(formatted);
                                                }}
                                                className="mt-1 w-full p-3 text-black border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Nhập số tiền..."
                                            />
                                        </div>


                                        <div ref={containerRef} className="relative w-full text-black">
                                            <label className="text-sm font-semibold text-slate-600">Ngân hàng</label>
                                            <input
                                                type="text"
                                                placeholder="Chọn ngân hàng..."
                                                value={searchTerm}
                                                onFocus={() => setOpen(true)}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setSelectedBank(null); // Nếu nhập lại, reset ngân hàng đã chọn
                                                    setOpen(true);
                                                }}
                                                className="mt-1 w-full cursor-pointer border border-slate-300 rounded-xl bg-white px-3 py-3 flex items-center justify-between hover:border-blue-400 transition"
                                            />

                                            {open && (
                                                <div className="absolute top-full left-0 mt-1 w-full max-h-64 overflow-y-auto border rounded-xl shadow-lg bg-white z-50">
                                                    {filteredBanks.length > 0 ? (
                                                        filteredBanks.map((bank) => (
                                                            <div

                                                                key={bank.code}
                                                                onClick={() => handleSelect(bank)}
                                                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition"
                                                            >
                                                                <img
                                                                    src={bank.logo}
                                                                    className="w-10 h-10 shadowrounded-full object-contain p-1 bg-white"
                                                                    alt={bank.name}
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-slate-800">{bank.name}</p>
                                                                    <p className="text-xs text-slate-500">{bank.code}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-3 text-slate-500 text-sm">Không tìm thấy ngân hàng</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* CHỈ HIỆN KHI KHÔNG CÓ ẢNH QR */}
                                        {!previewImage && (
                                            <>
                                                <div>
                                                    <label className="text-sm font-semibold text-slate-600">Số tài khoản</label>
                                                    <input
                                                        value={bankCode}
                                                        onChange={(e) => setBankCode(e.target.value)}
                                                        type="text"
                                                        className="mt-1 w-full p-3 border text-black border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Nhập số tài khoản..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-semibold text-slate-600">Chủ tài khoản</label>
                                                    <input
                                                        value={bankUserName}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                                .normalize("NFD")
                                                                .replace(/[\u0300-\u036f]/g, "")
                                                                .replace(/đ/g, "d")
                                                                .replace(/Đ/g, "D")
                                                                .toUpperCase();
                                                            setBankUserName(value);
                                                        }}
                                                        type="text"
                                                        className="mt-1 w-full p-3 border text-black border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Nhập tên chủ tài khoản..."
                                                    />
                                                </div>
                                            </>
                                        )}



                                        <div>
                                            <label className="text-sm font-semibold text-slate-600">Tải ảnh QR của bạn</label>

                                            {/* INPUT ẨN */}
                                            <input
                                                id="qrUpload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    const file = input.files?.[0];
                                                    if (!file) return;

                                                    const url = await handleUpload(file);

                                                    if (url) {
                                                        setQrCode(url);
                                                        setPreviewImage(url);
                                                    }

                                                    input.value = "";
                                                }}
                                            />

                                            {/* LABEL HOẠT ĐỘNG NHƯ BUTTON */}
                                            {!previewImage && (
                                                <label
                                                    htmlFor="qrUpload"
                                                    className="mt-2 w-full py-3 px-4 bg-slate-100 
                                            hover:bg-slate-200 text-slate-700 
                                            font-semibold rounded-xl border border-dashed 
                                            border-slate-300 transition cursor-pointer text-center block"
                                                >
                                                    Tải ảnh QR
                                                </label>
                                            )}

                                            {/* Preview nhỏ */}
                                            {previewImage && (
                                                <div className="relative mt-2">
                                                    <img
                                                        src={previewImage}
                                                        className="w-full h-40 object-contain border rounded-xl p-2 cursor-zoom-in"
                                                        alt="QR Preview"
                                                        onClick={() => setOpenPreview(true)}
                                                    />

                                                    {/* Nút X */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewImage("");
                                                            setQrCode("");
                                                        }}
                                                        className="absolute top-2 right-2 bg-white text-slate-700 hover:text-red-500 
                                                    w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}

                                            {/* Modal zoom to */}
                                            {openPreview && previewImage && (
                                                <div
                                                    className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center"
                                                    onClick={() => setOpenPreview(false)}
                                                >
                                                    <div
                                                        className="relative"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {/* Nút đóng */}
                                                        <button
                                                            onClick={() => setOpenPreview(false)}
                                                            className="absolute -top-4 -right-4 bg-white text-slate-500 hover:text-slate-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 text-xl font-bold"
                                                        >
                                                            ✕
                                                        </button>

                                                        {/* Ảnh lớn */}
                                                        <img
                                                            src={previewImage}
                                                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl bg-white p-1"
                                                            alt="QR Full"
                                                        />
                                                    </div>
                                                </div>
                                            )}


                                        </div>


                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
                                            Gửi yêu cầu rút tiền
                                        </button>

                                        <button
                                            onClick={() => setOpenWithdrawMoney(false)}
                                            className="w-full text-slate-500 hover:text-slate-700 hover:bg-gray-100 text-sm  py-3  rounded-xl">
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    /</form>
            )
            }
        </div >
    );
};

export default MyWallet;