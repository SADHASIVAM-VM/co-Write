import {Edit, Edit2, Trash, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "./ui/alert-dialog"
import toast from 'react-hot-toast'
import { useMyContext } from '../config/CommonContext'
  


const defaultImage = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";


// import blog from '../assets/blogexp.webp'
const BlogCard = ({title, img, date, id, del,EditContent,star}) => {
    const [delEditId, setDelEditId] = useState('');
   console.log(id)
    const URLs = import.meta.env.VITE_BASEURL
    //console.log(URLs)
    const navigate = useNavigate()
    const {editBlog, setEditBlog, setMenuSwitch, setStared} = useMyContext()
    console.log(star)
    setStared(star);
 

    const formatDate =(postDate)=>{
        const date = new Date(postDate);
        return new Intl.DateTimeFormat('en-GB',{
            day:"2-digit",
            month:"short"
        }).format(date)
    }

    // delete 
   console.log(delEditId);
    const handleDeleteBlog =async()=>{
       const response =  await fetch(`${URLs}/post/${delEditId}`,
        {
          method:"DELETE"
        }
      )

      if(response.ok){
        toast.success("BLOG Deleted")
        window.location.reload()
      }
    }
    const handleEditBlog = async()=>{
      setEditBlog(EditContent)
      setMenuSwitch("newpost")
    }
  return (
  
        <div  >
           
          {
            del &&  <div className= " flex gap-3 float-end mr-5 mb-3">

                
            <div onClick={()=> setDelEditId(id)}>
            <AlertDialog>
<AlertDialogTrigger><Trash2 color='red'/></AlertDialogTrigger>
<AlertDialogContent>
<AlertDialogHeader>
  <AlertDialogTitle > Are you sure?</AlertDialogTitle>
  <AlertDialogDescription>
    This action cannot be undone. This will permanently delete your Blog
    and remove your data from our servers.
  </AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction><button onClick={handleDeleteBlog}>Continue</button></AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
            </AlertDialog>
            </div>

            <button onClick={()=>handleEditBlog(id)}><Edit color='blue' /></button>
        </div>
          }

            <div className="img p-2 hover:p-1 border-2 border-[#d8d8d8] hover:border-[#84ff71f7] rounded-md w-full h-[300px]  inline-flex transition-all" onClick={()=> navigate('/blog/'+id)}>
                    <img src={`${URLs}/`+img} alt="" className='object-fit rounded-md w-full h-full transition-all cursor-pointer' onError={(e)=> e.target.src = defaultImage}/>
            </div>
            <div className="flex space-y-1 flex-row justify-between mt-2">
                <p className="font-bold  text-xl ">
                    {title.length > 25 ? title.slice(0, 25)+"....":title}
                </p>
                <p className='opacity-70 text-sm font-mono font-bold'>🕛{date && formatDate(date)}</p>
            </div>

          
        </div>
   
  )
}

export default BlogCard
