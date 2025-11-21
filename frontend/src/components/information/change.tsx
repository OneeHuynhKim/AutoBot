'use client';

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { parseISO, getDate, getMonth, getYear } from "date-fns";
import handleUpload from "../shared/cloudinary/upload-image";

export const ChangeInfor = ({ title, field, user, userId, identify, accessToken, errIdentify, setIdentify, setOpenInfo, setErrInfo, setUser }: { title: string; field: string, user: any, userId: string, accessToken: string | undefined, identify: any; errIdentify: any; setIdentify: (value: string) => void; setOpenInfo: (value: boolean) => void; setErrInfo: (value: string) => void; setUser: (value: string) => void }) => {
  const handleUpdateInfo = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}Authen/UpdateUserInfo`,
        { ...user, [field]: identify },
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      );
      if (res.data) {
        const updatedUser = res.data.data;
        setUser(updatedUser);
        setOpenInfo(false);
        toast.success(`Cập nhật ${title} thành công.`);
      }
    } catch (err: any) {
      if (err.response) {
      } else if (err.request) {
        toast.error(`Cập nhật ${title} thất bại.`);
      } else {
        toast.error(`Cập nhật ${title} thất bại.`);
      }
      setErrInfo("Lỗi kết nối server");
    }

  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdateInfo();
      }}>
        <div
          className="bg-liner max-w-[420px] w-full p-7 shadow-lg relative rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div onClick={() => { setOpenInfo(false); setErrInfo(''); }} className="cursor-pointer">
              <FaXmark className="text-[#777] text-2xl" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Cập nhật {title} của bạn</h2>
          <p className="text-sm text-gray-700 mb-4">
            {title} của bạn sẽ được hiển thị trên trang cá nhân, trong phần bình luận và bài đăng.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">{title}</label>
            <input
              autoFocus
              type="text"
              value={identify}
              onChange={(e) => setIdentify(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="w-full py-2 px-5 border border-gray-300 rounded-3xl focus:outline-[#1dbfaf]"
            />
            <div className={`text-[.75rem] ${!errIdentify ? 'text-gray-400' : 'text-red-600'}`}>
              {errIdentify || ''}
            </div>
          </div>

          <button
            type="submit" className="mt-6 w-full py-5 rounded-3xl bg-custom-gradient text-white font-semibold cursor-pointer">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>

  )
}

export const ChangeAvatar = ({ title, user, selectedAvatar, setOpenAvatar, setErrAvatar, setSelectedAvatar, setUser }: { title: string; selectedAvatar: string; user: any; setOpenAvatar: (value: boolean) => void; setErrAvatar: (value: string) => void; setSelectedAvatar: (value: string) => void; setUser: (value: any) => void }) => {
  const [preview, setPreview] = useState<string>(selectedAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    if (!file.type.startsWith("image/")) {
      setErrAvatar("Chỉ được chọn file ảnh!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedAvatar(URL.createObjectURL(file));
    const result = await handleUpload(file);
    console.log(result);
    console.log(user.id);
    const formData = new FormData();
    formData.append("UrlAvatar", result);
    axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/UpdateAvatar?Id=${user.id}`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        console.log(res.data);
        setUser((prev: any) => ({ ...prev, urlAvatar: result }));
        setOpenAvatar(false);
        toast.success(`Cập nhật ${title} thành công.`);
      }).catch(err => {
        toast.success(`Cập nhật ${title} thất bại.`);
      })
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="bg-liner max-w-[420px] w-full p-7 shadow-lg relative rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div onClick={() => { setOpenAvatar(false); setErrAvatar(''); }} className="cursor-pointer">
            <FaXmark className="text-[#777] text-2xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Cập nhật {title} của bạn</h2>
        <p className="text-sm text-gray-700 mb-4">
          {title} của bạn sẽ được hiển thị trên trang cá nhân, trong phần bình luận và bài đăng.
        </p>
        <div className="flex justify-center items-center">
          <Image
            loading="lazy"
            width={1000}
            height={500}
            alt="Ảnh đại diện"
            src={selectedAvatar}
            className="w-80 h-80 rounded-full"
          />
        </div>

        <div
          className="flex items-center justify-center gap-2 text-lg mt-6 w-full py-5 rounded-md text-gray-700 border-2 border-dashed border-gray-400 font-semibold cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <FaPlus />
          Tải ảnh lên hoặc kéo thả
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  )
}

export const ChangePassword = ({ title, isPassWord, setOpenPassword }: { title: string; isPassWord: string; setOpenPassword: (value: boolean) => void }) => {
  const [currentPassword, setCurrentPassword] = useState<any>('');
  const [newPassword, setNewPassword] = useState<any>('');
  const [confirmPassword, setConfirmPassword] = useState<any>('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="bg-liner max-w-[420px] w-full p-7 shadow-lg relative rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div onClick={() => { setOpenPassword(false) }} className="cursor-pointer">
            <FaXmark className="text-[#777] text-2xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Cập nhật {title} của bạn</h2>
        <p className="text-sm text-gray-700 mb-4">
          {title} của bạn sẽ được hiển thị trên trang cá nhân, trong phần bình luận và bài đăng.
        </p>

        <div className="space-y-3">
          {isPassWord !== '' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">Mật khẩu hiện tại</label>
              <input
                autoFocus={true}
                type="text"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="w-full py-2 px-5 border border-gray-300 rounded-3xl focus:outline-[#1dbfaf]"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Mật khẩu mới</label>
            <input
              autoFocus={isPassWord === ''}
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="w-full py-2 px-5 border border-gray-300 rounded-3xl focus:outline-[#1dbfaf]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Xác nhận mật khẩu</label>
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu..."
              className="w-full py-2 px-5 border border-gray-300 rounded-3xl focus:outline-[#1dbfaf]"
            />
          </div>
        </div>

        <button className="mt-6 w-full py-5 rounded-3xl bg-custom-gradient text-white font-semibold cursor-pointer">
          Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

export const ChangeTwoStep = ({ title, isTwoStep, userId, setOpenTwoStep, setIsTwoStep }: { title: string; isTwoStep: boolean; userId: string; setOpenTwoStep: (value: boolean) => void; setIsTwoStep: (value: boolean) => void }) => {
  const handleChecked = async () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return;
    await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/OnOffTwoStep`, {
      userId,
      isTwoStep: isTwoStep ? false : true
    },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    ).then(res => {
      setIsTwoStep(!isTwoStep);
      toast.success(`${isTwoStep ? 'Đã tắt' : 'Đã bật'} xác thực 2 bước.`)
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="bg-liner max-w-[420px] w-full p-7 shadow-lg relative rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div onClick={() => { setOpenTwoStep(false) }} className="cursor-pointer">
            <FaXmark className="text-[#777] text-2xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Cập nhật {title}</h2>
        <p className="text-sm text-gray-700 mb-4">
          Sử dụng xác thực 2 bước trong đăng nhập, nâng cao tính bảo mật cho tài khoản của bạn.
        </p>
        <div className="my-5">
          <div className="flex flex-col">
            <div className="flex items-center justify-center mt-2">
              <label className="plane-switch">
                <input type="checkbox"
                  checked={isTwoStep}
                  onChange={handleChecked}
                />
                <div>
                  <div>
                    <svg viewBox="0 0 13 13">
                      <path d="M1.55989957,5.41666667 L5.51582215,5.41666667 L4.47015462,0.108333333 L4.47015462,0.108333333 C4.47015462,0.0634601974 4.49708054,0.0249592654 4.5354546,0.00851337035 L4.57707145,0 L5.36229752,0 C5.43359776,0 5.50087375,0.028779451 5.55026392,0.0782711996 L5.59317877,0.134368264 L7.13659662,2.81558333 L8.29565964,2.81666667 C8.53185377,2.81666667 8.72332694,3.01067661 8.72332694,3.25 C8.72332694,3.48932339 8.53185377,3.68333333 8.29565964,3.68333333 L7.63589819,3.68225 L8.63450135,5.41666667 L11.9308317,5.41666667 C12.5213171,5.41666667 13,5.90169152 13,6.5 C13,7.09830848 12.5213171,7.58333333 11.9308317,7.58333333 L8.63450135,7.58333333 L7.63589819,9.31666667 L8.29565964,9.31666667 C8.53185377,9.31666667 8.72332694,9.51067661 8.72332694,9.75 C8.72332694,9.98932339 8.53185377,10.1833333 8.29565964,10.1833333 L7.13659662,10.1833333 L5.59317877,12.8656317 C5.55725264,12.9280353 5.49882018,12.9724157 5.43174295,12.9907056 L5.36229752,13 L4.57707145,13 L4.55610333,12.9978962 C4.51267695,12.9890959 4.48069792,12.9547924 4.47230803,12.9134397 L4.47223088,12.8704208 L5.51582215,7.58333333 L1.55989957,7.58333333 L0.891288881,8.55114605 C0.853775374,8.60544678 0.798421006,8.64327676 0.73629202,8.65879796 L0.672314689,8.66666667 L0.106844414,8.66666667 L0.0715243949,8.66058466 L0.0715243949,8.66058466 C0.0297243066,8.6457608 0.00275502199,8.60729104 0,8.5651586 L0.00593007386,8.52254537 L0.580855011,6.85813984 C0.64492547,6.67265611 0.6577034,6.47392717 0.619193545,6.28316421 L0.580694768,6.14191703 L0.00601851064,4.48064746 C0.00203480725,4.4691314 0,4.45701613 0,4.44481314 C0,4.39994001 0.0269259152,4.36143908 0.0652999725,4.34499318 L0.106916826,4.33647981 L0.672546853,4.33647981 C0.737865848,4.33647981 0.80011301,4.36066329 0.848265401,4.40322477 L0.89131128,4.45169723 L1.55989957,5.41666667 Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <span className="street-middle"></span>
                  <span className="cloud"></span>
                  <span className="cloud two"></span>
                </div>
              </label>
            </div>
            <label className="text-center text-sm italic font-semibold mt-5">
              {isTwoStep == true ? `Đã bật` : `Đã tắt`} xác thực 2 bước
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ChangeBirthDay = ({
  title,
  birthDay,
  userId,
  user,
  setOpenChangeBirthDay,
  setBirthDay,
  setUser
}: {
  title: string;
  birthDay: string;
  userId: string;
  user: any;
  setOpenChangeBirthDay: (value: boolean) => void;
  setBirthDay: (value: string) => void;
  setUser: (value: string) => void;
}) => {
  const [newDay, setNewDay] = useState("");
  const [newMonth, setNewMonth] = useState("");
  const [newYear, setNewYear] = useState("");

  useEffect(() => {
    if (birthDay) {
      try {
        const date = parseISO(birthDay);
        setNewDay(String(getDate(date)).padStart(2, "0"));
        setNewMonth(String(getMonth(date) + 1).padStart(2, "0"));
        setNewYear(String(getYear(date)));
      } catch (e) {
        console.log("Ngày sinh không hợp lệ", e);
      }
    }
  }, [birthDay]);

  const handleDayChange = (e: any) => setNewDay(e.target.value);
  const handleMonthChange = (e: any) => setNewMonth(e.target.value);
  const handleYearChange = (e: any) => setNewYear(e.target.value);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!newDay || !newMonth || !newYear) {
      return alert("Vui lòng nhập đầy đủ");
    }

    const newBirthDay = `${newYear}-${newMonth}-${newDay}`;

    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    try {
      const updatUser = {
        ...user,
        birthDay: newBirthDay,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}Authen/UpdateUserInfo`,
        updatUser,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      setOpenChangeBirthDay(false);
      const updatedUser = res.data.data;
      setUser(updatedUser);
      setOpenChangeBirthDay(false);
      toast.success(`Cập nhật ${title} thành công.`);
    } catch (err) {
      toast.success(`Cập nhật ${title} thất bại.`);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-liner max-w-[420px] w-full p-7 shadow-lg relative rounded-3xl">

        <div className="flex items-center justify-between mb-4">
          <div></div>
          <FaXmark
            onClick={() => setOpenChangeBirthDay(false)}
            className="cursor-pointer text-[#777] text-2xl"
          />
        </div>

        <h2 className="text-xl font-semibold mb-2">Cập nhật {title}</h2>
        <p className="text-sm text-gray-700 mb-4">
          {title} của bạn sẽ được hiển thị trên trang cá nhân, trong phần bình luận và bài đăng.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-between gap-2 mt-5">
            <div className="w-[50%]">
              <label className="font-semibold">Ngày</label>
              <select value={newDay} onChange={handleDayChange} className="mt-3 py-2 px-5 border rounded w-full">
                <option value="">--</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d).padStart(2, "0")}>{d}</option>
                ))}
              </select>
            </div>
            <div className="w-[50%]">
              <label className="font-semibold">Tháng</label>
              <select value={newMonth} onChange={handleMonthChange} className="mt-3 py-2 px-5 border rounded w-full">
                <option value="">--</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={String(m).padStart(2, "0")}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full mt-2">
            <label className="font-semibold">Năm</label>
            <select value={newYear} onChange={handleYearChange} className="mt-3 py-2 px-5 border rounded w-full">
              <option value="">--</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button className="mt-6 w-full py-5 rounded-3xl bg-custom-gradient text-white font-semibold cursor-pointer">
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};