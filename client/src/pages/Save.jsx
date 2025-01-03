import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard';
import { useUser } from '@clerk/clerk-react';

const URLs = import.meta.env.VITE_BASEURL;
const Save = () => {
  const [data, setData] = useState();
  const {user,isLoaded} = useUser();
  const user_id = user.id 

  useEffect(()=>{

    const fetchingData = async()=>{

      await fetch(`${URLs}/save/${user_id}`)
      .then((res)=> res.json())
      .then((res)=> setData(res.data))
    }
    fetchingData();
  },[])

  return (
    <div>
      <h1 className='text-3xl hq '>saved Blogs : {data && data.length}</h1>

      {
        isLoaded && 
        <div className="grid md:grid-cols-3 gap-5">
        {data && data.length > 0 ?
          data.map((e,inx)=>
           <BlogCard key={inx} id={e.saveBlogId._id} title={e.saveBlogId.title} img={e.saveBlogId.image} star={e.star} />
            
          )
          :
          <div className="flex justify-center items-center w-screen">
          <img src="/noresult.png" alt="No Results" className="object-fit" />
        </div>
        }
      </div>
      }
    </div>
  )
}

export default Save
