

const ExtensionPage = () => {
    return (
        <div className="h-[400px] w-full">
            <div className="mt-32">
                <div className="text-[30px] text-center font-semibold ">Công Cụ Hỗ Trợ <br /> <span className="text-[44px] text-blue-400 font-semibold">Đầu Tư Chứng Khoán Hiệu Quả</span></div>

                <div className="flex flex-col justify-center items-center gap-5">
                    <div>Tải Extension ngay tại đây</div>
                    <a href="/assets/files/ext.rar" download>
                        <div className="w-[200px] h-[70px] border border-(--color-border-card) bg-(--color-bg-card) rounded-2xl text-3xl flex items-center justify-center font-bold hover:text-blue-500">
                            Tải ngay
                        </div>
                    </a>

                </div>

            </div>
        </div>
    )
}

export default ExtensionPage;