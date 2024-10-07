// import axios from 'axios'
// import React, { useState } from 'react'
// import { DNA } from 'react-loader-spinner'


// const SecureUpload = () => {

//     let [img,setImg] = useState(null) 
//     let [video,setVideo] = useState(null)
//     let [loading,setLoading] = useState(null)

//     let UploadFile = async (type)=>{
//         const data = new FormData()
//         data.append('file', type === 'image' ? img : video)
//         data.append('upload_preser', type === 'image' ? 'thumbnail_preset' : 'video_preset')

//         try{
//             let cloudName =  process.env.REACT_APP_API_KEY
//             let resourceType = type === 'image' ? 'image':'video'
//             let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

//             const res = await axios.post(apiUrl,formData)
//             const {secure_url} = res.data
//             console.log(secure_url);
//             return secure_url
//         }
//         catch(err){
//             console.log(err);
//         }
//     }

//     let handleSubmit = async (e)=>{
//         e.preventDefault()
//         try{
//             setLoading(true)

//             const imgUrl = await UploadFile('image')
//             const videoUrl = await UploadFile('video')

//         setImg(null)
//         setVideo(null)
        
//         console.log("File Uploaded Successfully!");

//         }
//         catch(err){
//             console.log(err);
//         }
//     }

//   return (
//     <div>
//         <form onSubmit={handleSubmit}>
//         <label htmlFor="thumb">Thumbnail:</label>
//             <input type="file" name='thumb' accept='image/*' required onChange={(e)=>setImg((prev)=>e.target.files[0])}/>
//             <br /><br />
//             <label htmlFor="video">Video:</label>
//             <input type="file" name='video' accept='video/*' required onChange={(e)=>setVideo((prev)=>e.target.files[0])}/>
//             <br /><br />
//             <button>Upload to Cloudnary</button>
//         </form>
//         {
//             loading && <DNA
//                 visible={true}
//                 height="80"
//                 width="80"
//                 ariaLabel="dna-loading"
//                 wrapperStyle={{}}
//                 wrapperClass="dna-wrapper"
//                 />
//         }
//     </div>
//   )
// }

// export default SecureUpload


import axios from 'axios';
import React, { useState } from 'react';
import { DNA } from 'react-loader-spinner';

const SecureUpload = () => {
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false); // Corrected the initial state

  const uploadFile = async (type,timestamp,signature) => {
    const formData = new FormData();
    formData.append('file', type === 'image' ? img : video);
    formData.append("timestamp", timestamp)
    formData.append("signature", signature)
    formData.append("api_key", process.env.REACT_APP_CLOUDNARY_KEY)
    try {
      // Assuming you have a way to access your API key securely (see notes)
      const cloudName = process.env.REACT_APP_API_KEY;
      const resourceType = type === 'image' ? 'image' : 'video';
      const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(apiUrl, formData);
      const { secure_url } = res.data;
      console.log(secure_url);
      return secure_url;
    } catch (err) {
      console.error(err); // Use console.error for error messages
    }
  };

  const getSignatureForUpload = async (folder)=>{
    try{
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sign-uplaod`, {folder})
        return res.data
    }
    catch(err){
        console.log(err);
    }
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true before upload

    try {
        const { timestamp : imgTimestamp, signature: imgSignature} = await getSignatureForUpload('image')
        const { timestamp : vidTimestamp, signature: vidSignature} = await getSignatureForUpload('video')
        
        const imgUrl = await uploadFile('image', imgTimestamp, imgSignature);
        const videoUrl = await uploadFile('video', vidTimestamp, vidSignature);

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/videos`, {thumbUrl,videoUrl})


      setImg(null);
      setVideo(null);

      console.log('File Uploaded Successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading state back to false after upload (optional)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="thumb">Thumbnail:</label>
        <input type="file" name="thumb" accept="image/*" required onChange={(e) => setImg(e.target.files[0])} />
        <br /><br />
        <label htmlFor="video">Video:</label>
        <input type="file" name="video" accept="video/*" required onChange={(e) => setVideo(e.target.files[0])} />
        <br /><br />
        <button type="submit">Upload to Cloudinary</button>
      </form>
      {loading && (
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      )}
    </div>
  );
};

export default SecureUpload;
