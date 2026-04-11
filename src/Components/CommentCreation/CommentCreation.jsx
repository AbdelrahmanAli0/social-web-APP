// import { Input } from "@heroui/react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { ArrowRight } from "iconsax-reactjs";
// import React, { useState } from "react";

// export default function CommentCreation({postId}) {
// console.log('Post ID:', postId);

// const [commentValue, setCommentValue]= useState('')

// function handleCommentSubmit(){
//     if(!commentValue.trim()) return;
//     const commentObj={
//     comment:commentValue,
//     image:null
// }

//    return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`,
//         commentObj
//         ,
//         {headers:{
//             token:localStorage.getItem('token')
//         }}
//     )
// }
//  const {isPending, isError, isSuccess, mutate} =useMutation({
//     mutationFn: handleCommentSubmit,
// })

//   return (
//     <div className="p-5">
//       <Input id="inputComment"
//         labelPlacement="outside"
//         placeholder="Add Comment"
//         endContent={
//           <div onClick={mutate} className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition cursor-pointer">
//             <ArrowRight
//               size="20"
//               className="text-blue-500 hover:text-blue-800 transition"
//             />
//           </div>
//         }
//         type="text"
//         value={commentValue}
//         onChange={(e) => setCommentValue(e.target.value)}

//       />
//     </div>
//   );
// }


import { Input } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Gallery } from "iconsax-reactjs";
import React, { useState, useRef } from "react";

export default function CommentCreation({ postId }) {
              console.log('postId', postId);
  const [commentValue, setCommentValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  
  const { mutate , isPending } = useMutation({
    mutationFn: (formData) =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      ),

    onSuccess: () => {
      setCommentValue("");
      setImageFile(null);

      queryClient.invalidateQueries({ queryKey: ['GetPostComments'] });
      queryClient.invalidateQueries({ queryKey: ['getHomePosts'] });
    },
  });

    const handleImageClick = () => {
    fileInputRef.current.click();
  };

  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  
  const handleSend = () => {
    if (!commentValue.trim()) return;
     const CurrentComment =commentValue;
     setCommentValue('');
     setImageFile(null);
    const formData = new FormData();
    formData.append("content", commentValue);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      
      const dummyImage = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,12,73,68,65,
        84,8,153,99,0,1,0,0,5,0,1,13,10,26,10,0,0,0,0,73,69,78,68,
        174,66,96,130
      ]);
      const dummyFile = new File([dummyImage], "empty.png", { type: "image/png" });
      formData.append("image", dummyFile);
    }

    mutate(formData);
  };

  return (
    <div className="p-5">
      <Input
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
        placeholder="Add Comment"
        type="text"
        endContent={
          <div className="flex items-center gap-2">
            <div
              onClick={handleImageClick}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <Gallery size={18} className="text-gray-600" />
            </div>
            <div
              onClick={handleSend}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 cursor-pointer"
            >
              {isPending ? (
                <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin" />
              ) : (
                <ArrowRight size={18} className="text-blue-500" />
              )}
            </div>
          </div>
        }
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
}