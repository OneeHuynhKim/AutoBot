// src/utils/getDeviceFingerprint.ts

/**
 * Lấy chuỗi fingerprint Base64 của thiết bị hiện tại.
 * @returns Chuỗi Base64 fingerprint | null
 */
export function getDeviceFingerprint(): string | null {
    // Chỉ chạy code này trong môi trường trình duyệt (Client-side)
    if (typeof window === 'undefined') {
        return null;
    }

    // Các biến này phụ thuộc vào đối tượng window
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    // Tạo chuỗi theo cấu trúc [User Agent]|[Platform]|[Timezone]|[Screen Resolution]
    return btoa(`${userAgent}|${platform}|${timezone}|${screenRes}`);
}