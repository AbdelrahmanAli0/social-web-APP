import {
  Avatar,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@heroui/react";
import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CloseCircle, Gallery } from "iconsax-reactjs";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { EditPostContext } from "../../Context/EditPostContext";
import { UserDataContext } from "../../Context/UserDataContext";

export default function PostCreation() {
  const { setIsEditmode, isEditmode, selectedPost } =
    useContext(EditPostContext);

  const { userData } = useContext(UserDataContext);
  const name = userData?.name;
  const photo = userData?.photo;

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const imageInputRef = useRef(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (isEditmode) {
      onOpen();
    }
  }, [selectedPost]);

  useEffect(() => {
    return () => {
      setIsEditmode(false);
    };
  }, []);

  useEffect(() => {
    if (isEditmode && selectedPost) {
      setCaption(selectedPost.body || "");
      setSelectedImage(selectedPost.image || null);
    }
  }, [isEditmode, selectedPost]);

  function handleChangeImage(e) {
    setSelectedImage(URL.createObjectURL(e.target.files[0]));
  }

  function handleClearImage() {
    setSelectedImage(null);
    imageInputRef.current.value = null;
    setCaption("");
  }

  function handleCreatePost() {
    const postObject = new FormData();
    if (caption) {
      postObject.append("body", caption);
    }
    if (imageInputRef.current.files[0]) {
      postObject.append("image", imageInputRef.current.files[0]);
    }
    if (isEditmode) {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${selectedPost.id}`,
        postObject,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    }
    return axios.post(`https://route-posts.routemisr.com/posts`, postObject, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: (data) => {
      console.log("dataaaaaaaa", data);

      onClose();
      handleClearImage();
      setIsEditmode(false);
      queryClient.invalidateQueries({ queryKey: ["getHomePosts"] });

      toast.success(
        isEditmode ? "Post Updated Successfully" : "Post Created Successfully",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        },
      );
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        isEditmode ? "Failed to update post" : "Failed to create post",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        },
      );
    },
  });

  return (
    <>
      <Card>
        <CardBody className="flex flex-row gap-2 items-center">
          <Avatar size="md" className="w-fit" src={photo ? photo : null} />
          <input
            onClick={onOpen}
            className="bg-transparent border-none focus:outline-none w-full cursor-pointer"
            placeholder={`Whats on your mind ${name} ?`}
          ></input>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {isEditmode ? (
                <h1 className="flex justify-center text-2xl font-bold pt-3">
                  Edit Post
                </h1>
              ) : (
                <h1 className="flex justify-center text-2xl font-bold pt-3">
                  Create Post
                </h1>
              )}
              <ModalHeader className="flex flex-col gap-1 ">
                <div className="flex flex-row items-center gap-2">
                  <Avatar
                    size="md"
                    className="w-fit"
                    src={
                      photo ||
                      "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
                    }
                  />
                  <p>{name}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-transparent border-none focus:outline-none w-full"
                  placeholder="What's on your mind?"
                  rows={3}
                />
                {selectedImage && (
                  <div className="flex justify-center ">
                    <Image alt="Image" src={selectedImage} width={300} />
                    <CloseCircle
                      className="cursor-pointer "
                      size="32"
                      color="#f47373"
                      variant="Outline"
                      onClick={() => {
                        handleClearImage();
                      }}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="flex items-center">
                <label className="cursor-pointer  hover:bg-gray-200 p-2 rounded-2xl">
                  <Gallery size="32" color="#555555" variant="Outline" />
                  <input
                    type="file"
                    hidden
                    ref={imageInputRef}
                    onChange={handleChangeImage}
                  ></input>
                </label>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  onClick={() => {
                    handleClearImage();
                    setIsEditmode(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={
                    isPending || (!caption && !imageInputRef.current?.files[0])
                  }
                  onClick={mutate}
                >
                  {isEditmode ? "Update" : "Share"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
