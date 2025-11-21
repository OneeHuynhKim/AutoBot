import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";

export const useAutoLogin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        if (accessToken && refreshToken) {
            try {
                const decoded = jwtDecode(accessToken);
                dispatch(
                    setUser({
                        accessToken,
                        refreshToken,
                        userInfo: decoded,
                    })
                );
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                dispatch(clearUser());
            }
        }
    }, [dispatch]);
};
