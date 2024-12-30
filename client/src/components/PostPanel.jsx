import { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ResizeModule from "@botom/quill-resize-module";
import { SendHorizonal } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import upload from "../assets/icons/upload.jpg";
import spinners from "../assets/loading/spinner.svg";
import { useMyContext } from "../config/CommonContext";

Quill.register("modules/resize", ResizeModule);

const URLs = import.meta.env.VITE_BASEURL;

function PostPanel() {
  const { editBlog, setEditBlog, setMenuSwitch } = useMyContext();

  const ids = useAuth().userId;
  const username = useUser().user.username;

  const quillRef = useRef(null);
  const [blogData, setBlogData] = useState({
    user_id: '',
    username: '',
    title: "",
    description: "",
    content: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [imgErr, setImgErr] = useState(null);

  useEffect(() => {
    if (editBlog) {
      setBlogData({
        user_id: editBlog.user_id,
        username: editBlog.username,
        title: editBlog.title,
        description: editBlog.description,
        content: editBlog.content,
        image: null,
      });
      setFileName(editBlog.imageName || "");
    }
  }, [editBlog]);
  console.log(editBlog)

  const changeHandle = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setImgErr(false);
    }
    setFileName(file.name);
    setBlogData((prev) => ({ ...prev, [name]: file }));
  };

  const handleQuillChange = (value) => {
    setBlogData((prev) => ({ ...prev, content: value }));
  };

  const postBlog = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", ids);
      formData.append("username", username);
      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("content", JSON.stringify(blogData.content));

      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const endpoint = editBlog ? `${URLs}/post/${editBlog._id}` : `${URLs}/post`;
      const method = editBlog ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method : method,
        body: formData 
      });
      
      if (response.ok) {
        setLoading(false);
        toast.success(editBlog ? "Blog updated successfully" : "Blog created successfully");
        setBlogData({ user_id: '', title: "", description: "", content: "", image: null });
        setImgErr(null);
        setFileName("");
        setEditBlog(null);
      } else {
        setLoading(false);
        toast.error("Failed to save blog");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("An error occurred while saving the blog");
    }
  };

  const onsubmitting = (e) => {
    e.preventDefault();
    postBlog();
  };

  return (
    <div className="p-2 relative">
      <form action="" className="space-y-2" onSubmit={onsubmitting}>
       <div className="space-y-4 ">
       <input
          name="title"
          required
          type="text"
          placeholder="Blog Title"
          value={blogData.title}
          className="border-2 w-full bg-transparent py-4 px-5 rounded-md"
          onChange={changeHandle}
       
        />
        <textarea
          required
          name="description"
          placeholder="Short Description..."
          value={blogData.description}
          className="border-2 bg-transparent w-full p-5 rounded-md"
          onChange={changeHandle}
        />
       
       </div>
        <div className="flex justify-between gap-5 items-center">
          <div className="">
          <label htmlFor="img" className={imgErr ? "border border-red-500" : "border flex items-center px-2 rounded-md"}>
          <img src={upload} className="w-16 " alt="Upload" />
          <span className="opacity-60 ml-2">{fileName || "Select Image"}</span >
        </label>
        <input id="img" name="image" type="file" onChange={HandleFileChange} />
        
          </div>
        <button type="submit" className="border hover:text-yellow-400 h-[50px] px-3 rounded-md">{editBlog ? "Update" : "Post"}</button>
        </div>
      </form>

      {/* Quill */}
      <div className="mt-3">
      <ReactQuill className="h-[250px]" ref={quillRef} theme="snow" modules={{ toolbar: true }} value={blogData.content} onChange={handleQuillChange} />
      </div>
      {loading && <div className="loading-spinner"><img src={spinners} alt="" /></div>}
    </div>
  );
}

export default PostPanel;
