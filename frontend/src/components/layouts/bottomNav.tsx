"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Thêm icon cho trang chủ
import { FaHome, FaUser, FaSearch, FaBars } from "react-icons/fa"; 
// Thêm icon home vào để Bottom Nav có 3 hoặc 4 mục chính (thường có Home)

export default function BottomNav() {
    const pathname = usePathname();

    // Định nghĩa các liên kết
    const navItems = [
        { href: "/", icon: FaHome, label: "Trang chủ" },
        { href: "/menu", icon: FaBars, label: "Menu" },
        { href: "/information", icon: FaUser, label: "Tài khoản" },
    ];

    // Màu accent chính (xanh lá)
    const ACCENT_COLOR_CLASS = "text-blue-500";
    // Màu nền cho Dark Mode
    const DARK_BG_CLASS = "bg-[#2A2C31]"; 
    // Màu border cho Dark Mode
    const DARK_BORDER_CLASS = "border-[#3A3C42]"; 

    return (
        <div
            className={`
                fixed bottom-4 left-0 right-0 mx-4 xs:mx-6 sm:mx-10
                ${DARK_BG_CLASS} 
                ${DARK_BORDER_CLASS}
                border 
                flex items-center justify-around
                px-4 py-3
                rounded-3xl // Tăng độ cong
                shadow-2xl shadow-black/50 // Shadow đậm hơn cho Dark Mode
                z-50
                md:hidden
            `}
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.href === "/") {
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                absolute left-1/2 -translate-x-1/2 -top-5 
                                bg-linear-to-r from-blue-400 to-teal-500 text-white
                                w-16 h-16
                                rounded-full
                                flex items-center justify-center
                                shadow-xl shadow-blue-500/50
                                transition-all duration-300
                                hover:scale-105 active:scale-95
                                border-4 border-[#2A2C31]
                            `}
                        >
                            <item.icon size={24} />
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            flex flex-col items-center text-xs font-medium transition duration-300 space-y-1
                            ${isActive ? ACCENT_COLOR_CLASS : "text-white hover:text-white"}
                        `}
                    >
                        <item.icon size={22} />
                        {/* Ẩn label để giữ gọn, nhưng có thể thêm nếu cần */}
                        {/* <span>{item.label}</span> */}
                    </Link>
                );
            })}
        </div>
    );
}

// Giữ lại import gốc để tránh lỗi nếu người dùng không muốn dùng Home
/*
// Đã loại bỏ các phần tử gốc để thay thế bằng .map và icon Home ở giữa

<Link
    href="/menu"
    className={`... ${pathname === "/menu" ? "text-blue-500" : "text-gray-500"}`}
>
    <FaBars size={22} />
</Link>
<div
    className="absolute left-1/2 -translate-x-1/2 -top-4 bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
>
    <FaSearch size={22} />
</div>
<Link
    href="/information"
    className={`... ${pathname === "/information" ? "text-blue-500" : "text-gray-500"}`}
>
    <FaUser size={22} />
</Link>
*/