// import axios from "axios";

// export const uploadImage = async (img) => {
//     let imgUrl = null;

//     await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
//         .then(async ({ data: { uploadURL } }) => {
//             await axios({
//                 method: 'PUT',
//                 url: uploadURL,
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 data: img
//             })
//             // console.log(url)
//         })
//         .then(() => {
//             imgUrl = uploadURL.split('?')[0]
//             console.log(imgUrl)
//         })
//     return imgUrl;
// }
import axios from 'axios';

export const uploadImage = async (img) => {
    let imgUrl = null;

    try {
        const response = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url");
        const uploadURL = response.data.uploadURL;

        await axios({
            method: 'PUT',
            url: uploadURL,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: img
        });

        imgUrl = uploadURL.split('?')[0];
        console.log(imgUrl);
    } catch (error) {
        console.error("Error uploading image:", error);
    }

    return imgUrl;
}
