import Content from "@/components/admin/content/content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang nội dung Admin - AutoBot Phái Sinh',
    description: 'Trang nội dung Admin AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const ContentPage = () =>{
    return(
        <div>
            <Content/>
        </div>
    )
}

export default ContentPage;