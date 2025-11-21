// src/utils/deviceUtils.ts

import { UAParser } from 'ua-parser-js';

// Định nghĩa kiểu dữ liệu trả về mong muốn
interface DeviceInfo {
    browser: string;
    os: string;
    deviceType: string;
    rawFingerprint: string;
}

/**
 * Giải mã chuỗi fingerprint Base64 và phân tích thông tin thiết bị (Browser, OS, Type).
 * @param fingerprint Chuỗi fingerprint đã mã hóa Base64 từ server.
 * @returns DeviceInfo | null
 */
const getDeviceInfoFromFingerprint = (fingerprint: string): DeviceInfo | null => {
    if (!fingerprint) return null;

    try {
        // 1. Giải mã Base64
        const decodedString = atob(fingerprint);
        // Cấu trúc: [User Agent] | [Platform] | [Timezone] | [Screen Resolution]
        const parts = decodedString.split('|');

        if (parts.length < 1) return null; // Đảm bảo có ít nhất User Agent

        const userAgent = parts[0];

        // 2. Sử dụng UAParser để phân tích User Agent
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        // 3. Trích xuất thông tin
        const browser = result.browser.name || 'Unknown Browser';
        // Kết hợp tên và phiên bản OS (nếu có)
        const os = result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : 'Unknown OS';

        // device.type có thể là 'mobile', 'tablet', 'smarttv', 'wearable', 'embedded', hoặc undefined.
        let deviceType = 'Desktop';
        if (result.device.type) {
            // Viết hoa chữ cái đầu tiên
            deviceType = result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1);
        }

        return {
            browser,
            os,
            deviceType,
            rawFingerprint: fingerprint,
        };

    } catch (error) {
        console.error("Error decoding or parsing fingerprint:", error);
        return null;
    }
};

export default getDeviceInfoFromFingerprint;