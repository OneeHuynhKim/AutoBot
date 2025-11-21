import axios from "axios";

const handleUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 's28ysytn');
        const resourceType = 'image';
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/drpxjqd47/${resourceType}/upload`, formData);
            return response.data.secure_url;
        } catch (error) {
            console.log('Upload thất bại: ' + error);
        }
    }

export default handleUpload;