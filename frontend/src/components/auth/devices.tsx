// Devices.tsx

'use client';

import { RootState } from "@/redux/store";
// Import hàm lấy fingerprint của thiết bị hiện tại
import { getDeviceFingerprint as getCurrentFingerprint } from "@/utils/getDeviceFingerprint";
// Import hàm phân tích thông tin từ fingerprint
import getDeviceInfoFromFingerprint from "@/utils/deviceUtils";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Devices = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [devices, setDevices] = useState<any[]>([]);

    // Lấy fingerprint của thiết bị hiện tại (chỉ chạy trong client-side)
    // Lưu ý: Đặt trong thân component/effect để đảm bảo giá trị đã có.
    // Tạm thời lấy ở đây, nhưng tốt nhất nên dùng state hoặc useEffect để đảm bảo client-side.
    const currentFingerprint = getCurrentFingerprint();

    useEffect(() => {
        if (!userInfo?.Id) return;
        const fetchDevices = async () => {
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetDevices`, {
                    userId: userInfo?.Id
                });
                // Dữ liệu API trả về là res.data.data
                console.log(res.data);
                setDevices(res.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách thiết bị:", error);
            }
        };
        fetchDevices();
    }, [userInfo?.Id]); // Dependency array: chạy lại khi userId thay đổi

    const handleLogoutOtherDevices = async () => {
        if (!currentFingerprint) {
            alert("Không thể xác định fingerprint của thiết bị hiện tại.");
            return;
        }
        if (!userInfo?.Id) return;
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/LogoutOtherDevices`,
                {
                    userId: userInfo?.Id,
                    currentFingerprint: currentFingerprint
                });
            alert("Đăng xuất các thiết bị khác thành công");
            // Sau khi đăng xuất, gọi lại API để làm mới danh sách
            // (Tuy nhiên, API này chỉ đăng xuất *các thiết bị khác*, nên thiết bị hiện tại vẫn còn)
            // Có thể thêm logic gọi fetchDevices() nếu cần cập nhật UI
        } catch (error) {
            alert("Lỗi khi đăng xuất các thiết bị khác.");
        }
    };

    return (
        <div className="mt-50 text-white!">
            <h2>Thiết bị đăng nhập</h2>
            <ul>
                {devices.map((d, i) => {
                    // Phân tích thông tin thiết bị từ fingerprint của từng thiết bị
                    const info = getDeviceInfoFromFingerprint(d.fingerprint);

                    if (!info) return <li key={i}>Không thể phân tích thông tin thiết bị.</li>;

                    // Xác định thiết bị hiện tại bằng cách so sánh fingerprint
                    const isCurrent = d.fingerprint == currentFingerprint;

                    return (
                        <li key={i} className={`mb-2 p-2 rounded ${isCurrent ? 'bg-gray-700 font-bold' : ''}`}>
                            {/* Hiển thị thông tin đã được phân tích */}
                            **{info.browser}** / **{info.os}** / **{info.deviceType}** {isCurrent ? ' — (Thiết bị hiện tại)' : ''}
                            {' — Hoạt động cuối: '} {new Date(d.lastActive).toLocaleString()}
                        </li>
                    );
                })}
            </ul>
            <button
                onClick={handleLogoutOtherDevices}
                className="mt-4 p-2 bg-red-600 hover:bg-red-700 rounded transition duration-200"
            >
                Đăng xuất các thiết bị khác
            </button>
        </div>
    );
}

export default Devices