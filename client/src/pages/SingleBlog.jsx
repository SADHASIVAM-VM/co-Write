import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import CommentBox from "../components/comment";
import loading from "../assets/loading/spinner.svg";
import { useMyContext } from "../config/CommonContext";
import Navbar from "../components/Header";

const BASE_URL = import.meta.env.VITE_BASEURL;

const SingleBlog = () => {
  const { id } = useParams();
  const { user } = useUser(); 
  const userId = user?.id;
  const { stared, setStared } = useMyContext();
  const [blog, setBlog] = useState(null); // Blog state
console.log(blog)
  // Fetch Blog Data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${BASE_URL}/post/${id}`);
        const result = await response.json();
        if (result.data.length > 0) {
          setBlog(result.data[0]); // Set blog data
        } else {
          toast.error("Blog not found!");
        }
      } catch (error) {
        toast.error("Failed to fetch blog data.");
      }
    };
    fetchBlog();
  }, [id]);

  // Save Blog Function
  const saveBlog = async () => {
    if (!userId) return toast.error("Sign in to save blogs!");

    setStared(true);
    const data = { saveBlogId: id, user_id: userId, star: true };

    try {
      const response = await fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 400) {
        toast.error("Already saved!");
      } else {
        toast.success("Blog saved successfully!");
      }
    } catch (error) {
      toast.error("Error saving blog.");
    }
  };

  // Remove Blog from Saved
  const removeBlog = async () => {
    if (!userId) return toast.error("Sign in to remove saved blogs!");

    setStared(false);
    try {
      const response = await fetch(`${BASE_URL}/save/${id}?user_id=${userId}`, {
        method: "DELETE",
      });
      const resData = await response.json();
      toast.success(resData.msg || "Removed from saved.");
    } catch (error) {
      toast.error("Error removing saved blog.");
    }
  };

  // Format Date
  const formatDate =(postDate)=>{
    const date = new Date(postDate);
    return new Intl.DateTimeFormat('en-GB',{
        day:"2-digit",
        month:"short",
        year:'numeric'
    }).format(date)
  }
  const defaultImage = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
  return (
    <>
    <Navbar/>
      {blog ? (
        <div className="px-4 md:px-10">
          {/* Breadcrumb Navigation */}
          <nav className="text-gray-500 text-sm mb-4">
            <a href="/" className="hover:text-black">Home</a> &gt;
            <a href="/blogs" className="hover:text-black"> Blogs</a> &gt;
            <span className="text-black"> {blog.title.length > 30 ? `${blog.title.slice(0, 30)}...` : blog.title}</span>
          </nav>

          {/* Blog Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{blog.title}</h1>
            <button onClick={stared ? removeBlog : saveBlog} className="text-red-500">
              <Star fill={stared ? "red" : "none"} />
            </button>
          </div>
          <p className="text-gray-600 my-2">{formatDate(blog.postAt) } • 8 min read</p>

          {/* Featured Image */}
          <div className="w-full my-6 p-5 justify-center flex  rounded-md border">
            <img src={`${BASE_URL}/${blog.image}`} alt="Blog" className="w-[300px] h-[400px] object-contain"
            onError={(e)=> e.target.src = defaultImage} />
          </div>

          {/* Blog Content */}
          <div className="prose max-w-none text-opacity-75 text-[current] leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />

          {/* Blog Author */}
          <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-md my-6">
            <img src="https://via.placeholder.com/50" alt="Author" className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="font-semibold">{blog.author || "John Smith"}</h3>
              <p className="text-sm text-gray-500">Senior Web Developer & Technical Writer</p>
            </div>
          </div>

          {/* Comments Section */}
          <CommentBox id={id} key={id} />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <img src={loading} alt="Loading" className="w-16" />
        </div>
      )}
    </>
  );
};

export default SingleBlog;
