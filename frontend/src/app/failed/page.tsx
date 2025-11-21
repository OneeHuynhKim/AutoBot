import Failed from "@/components/layouts/failed";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang trạng thái - AutoBot Phái Sinh',
    description: 'Trang trạng thái AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const FailPage = () => {
    return (
        <div>
            <Failed />
        </div>
    )
}

export default FailPage;