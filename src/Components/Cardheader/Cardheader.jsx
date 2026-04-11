import {
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import { User } from "iconsax-reactjs";
import React, { useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";
import { Authcontext } from "../../Context/Authcontext";
import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
export default function MyCardheader({
  photo,
  name,
  createdAt,
  content,
  className,
  userCardId,
  cardId,
  cardType,
  postId
}) {
  // console.log('Post ID:', postId);
  // console.log('Card ID:', cardId);
  // console.log('Card Type:', cardType);

  const { userId, UserToken } = useContext(Authcontext);
  const isPostOwner = userId === userCardId;

  
  function handleDeleteCard() {
    let url='';
    if(cardType==='posts'){
      url=`https://route-posts.routemisr.com/posts/${cardId}`
    } else if(cardType==='comments'){
      url=`https://route-posts.routemisr.com/posts/${postId}/comments/${cardId}`
    }
   return axios.delete(url, {
      headers: {
        token: UserToken,
      },
    });
  }
      const queryClient =useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: handleDeleteCard,
    onSuccess: () => {
       queryClient.invalidateQueries({queryKey:['getHomePosts']}),
       queryClient.invalidateQueries({queryKey:['GetPostComments']}),
      
      toast.success(cardType==='posts' ? "Post Deleted Successfully" : "Comment Deleted Successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: () => {
      toast.error(cardType==='posts' ? "Failed to delete post" : "Failed to delete comment", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  return (
    <>
      <CardHeader className={`justify-between ${className || ""}`}>
        <div className="flex flex-row items-center gap-2">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src={photo || "https://via.placeholder.com/40"}
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">{name}</p>
            <p className="text-small text-default-500">
              {createdAt?.slice(0, 10)}
            </p>
            {content && <p className="text-small   text-black ">{content}</p>}
          </div>
        </div>
        <div>
          {isPostOwner && (
            <Dropdown className="min-w-fit" isDisabled={isPending}>
              <DropdownTrigger>
                <BsThreeDotsVertical className="cursor-pointer hover:scale-125 transition-all" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="new">
                  <div className="flex justify-between">
                    Edit
                    <MdEdit size={15} />
                  </div>
                </DropdownItem>
                <DropdownItem
                  onClick={mutate}
                  key="delete"
                  className=" text-danger "
                  color="danger"
                >
                  <div className="flex  gap-2">
                    <p>Delete</p>
                    <MdDelete size={20} />
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </CardHeader>
    </>
  );
}
