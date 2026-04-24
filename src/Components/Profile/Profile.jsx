import React, { useContext, useRef, useState } from "react";
import { UserDataContext } from "../../Context/UserDataContext";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  HiddenSelect,
  Image,
  Skeleton,
} from "@heroui/react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast , Zoom } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Postcard from "../Postcard/Postcard";
import PostCreation from "../PostCreation/PostCreation";

export default function Profile() {

   const{userData}=useContext(UserDataContext)
          const name = userData?.name
          const photo = userData?.photo
          const id =userData?.id
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const [file, setFile] = useState(null); 
    function handleChangeImage(e) {
    const selectedFile= e.target.files[0]
      if (selectedFile) {
    setFile(selectedFile); 
    setSelectedImage(URL.createObjectURL(selectedFile));
  }
  }

  function handleUpload() {
  const formData = new FormData();
  formData.append("photo", file);

  return axios.put("https://route-posts.routemisr.com/users/upload-photo", formData, {
    headers: {
      token: localStorage.getItem("token"),
    },
  });
}


function getUserPosts(){
 return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`,{headers:{
    token:localStorage.getItem('token')
  }})
}

const{data}=useQuery({
  queryFn:getUserPosts,
  queryKey:'getUserPosts',
  enabled:!!id
})
// console.log('userposts',data);

const posts = data?.data?.data?.posts;
const totalPosts=data?.data?.meta.pagination.total



const{mutate , isPending }=useMutation({
  mutationFn:handleUpload,
  mutationKey:['upLoadProfilePicture',id],
  
  onSuccess:()=> {toast.success("Profile picture updated", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Zoom,
        
      })
      ,setFile( null)
      ,setSelectedImage(null)
      ,queryClient.invalidateQueries({ queryKey: ["userData"] })
      ,queryClient.refetchQueries({ queryKey: ["userData"] })
    }
      ,
      


      onError:()=>{toast.error(" Faild To Change Profile picture", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Zoom,
      })},
})




  return (
    <>
      {/* <h1>profile</h1> */}
      <div className="min-h-screen bg-gray-100">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <img
              
  src={selectedImage || photo || 'https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'}
  alt="profile"
  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
/>
          
            
          </div>
        </div>

        {/* Info */}
        <div className="mt-16 px-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-gray-500 text-sm">Frontend Developer 🚀</p>
            </div>


                <input
  type="file"
  ref={fileInputRef}
  onChange={handleChangeImage}
  className="hidden"
/>

            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Edit profile</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action event example"
                
              >
                <DropdownItem onClick={() => fileInputRef.current.click()}>Change profile picture</DropdownItem>
                <DropdownItem >Change Pssword</DropdownItem>
                <DropdownItem >Edit file</DropdownItem>
                <DropdownItem
                  className="text-danger"
                  color="danger"
                >
                  Delete file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
{selectedImage && (
  <button 
    className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
    onClick={mutate}
    disabled={!file || isPending}
  >
     {isPending? <div className="flex items-center gap-2">
    <ClipLoader color="#97def4" size={15} />
    <span>Updating</span>
  </div>   : <p>
      save
     </p> }
    
  </button>
)}
          {/* Stats */}
          <div className="flex gap-6 mt-4 text-center">
            <div>
              <h3 className="font-bold">{totalPosts? totalPosts:<Skeleton className="h-6 w-3/5 rounded-lg" />}</h3>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div>
              <h3 className="font-bold">1.2K</h3>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div>
              <h3 className="font-bold">320</h3>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        
        <div className="mt-6 px-6">
           <div className='bg-gray-100 min-h-screen w-full md:w-3/4 lg:w-1/2 mx-auto flex flex-col gap-5 rounded-2xl'>
                <PostCreation />
                {posts?.map(post=><Postcard key={post._id} postsinfo={post} />)}
              </div>
        </div>
      </div>
    </>
  );
}
