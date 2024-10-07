import React, { useState } from 'react'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'

const Upload = () => {

    // let [data, setData] = useState({title:"",desc:"",thumbnail:null,video:null})
    let [img,setImg] = useState(null)
    let [video,setVideo] = useState(null)
    let [loading, setLoading] = useState(false)
    // let {title,desc,thumbnail,video} = data

    // let handletitle = (e)=>{setData({...data,title:e.target.value})}
    // let handledesc = (e)=>{setData({...data,desc:e.target.value})}
    let handlethumb = (e)=>{setImg(img)}
    let handlevideo = (e)=>{setVideo(video)}

    let uploadFile = async (type)=>{
        const formData = new FormData()
        formData.append("file", type === 'image' ? img : video)
        formData.append("upload_preset", type === 'image' ? 'thumbnail_preset': 'video_preset')
        try{
            let cloudName = process.env.REACT_APP_CLOUDNARY_API
            let resourceType = type === 'image' ? 'image':'video'
            let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

            const res = await axios.post(apiUrl,formData)
            const {secure_url} = res.data
            console.log(secure_url);
            return secure_url
        }
        catch(err)
        {
            console.log(err);
        }
    }

   
    let handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)

            

            const thumbUrl = await uploadFile('image')
            const videoUrl = await uploadFile('video')
            
            // Backend API Reaquest:
            // await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/videos`, {thumbUrl,videoUrl})

            // setData({thumbnail:null,video:null})
            setImg(null)
            setVideo(null)
            console.log("File Uploaded sucessfully!");
            setLoading(false)
        }
        catch(err)
        {
            console.log(err);
        }
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            {/* <label htmlFor="title">Title:</label>
            <input type="text" required maxLength={50} onChange={handletitle} placeholder='Enter Your Title here'/>
            &nbsp;<small>Enter 50 characters only</small>
            <br /><br />
            <label htmlFor="desc">Description:</label>
            <input type="text" required  maxLength={200} onChange={handledesc} placeholder='Enter Your description here'/>
            &nbsp;<small>Enter 200 characters only</small>
            <br /><br /> */}
            <label htmlFor="thumb">Thumbnail:</label>
            <input type="file" name='thumb' accept='image/*' required onChange={handlethumb}/>
            <br /><br />
            <label htmlFor="video">Video:</label>
            <input type="file" name='video' accept='video/*' required onChange={handlevideo}/>
            <br /><br />
            <button>Upload to Cloudnary</button>
        </form>
        {
            loading && <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
                />
        }
    </div>
  )
}

export default Upload