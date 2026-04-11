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
    import { useState } from "react";
    import { useRef } from "react";
import { toast } from "react-toastify";

    export default function PostCreation() {
    const { isOpen, onOpen, onOpenChange ,onClose } = useDisclosure();
    const [selectedImage, setSelectedImage]=useState(null);
    const imageInputRef = useRef(null);
    const captionRef=useRef(null);

    function handleChangeImage(e){
        setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
    
    function handleClearImage(){
        setSelectedImage(null);
        imageInputRef.current.value = null;
        captionRef.current.value=null;
    }

    function handleCreatePost(){
      const postObject =new FormData();
        if(captionRef.current.value){
            postObject.append('body',captionRef.current.value)
        }
        if(imageInputRef.current.files[0]){
            postObject.append('image', imageInputRef.current.files[0])
        }
         return axios.post(`https://route-posts.routemisr.com/posts`,postObject,{
            headers:{
                token:localStorage.getItem('token')
            }
        })
    }
    const queryClient = useQueryClient();
   const { isPending, mutate } = useMutation({
        mutationFn:handleCreatePost,
        onSuccess:(data)=>{
            console.log('dataaaaaaaa',data);
            
            onClose();
            handleClearImage();
            queryClient.invalidateQueries({ queryKey: ['getHomePosts'] });

            toast.success('Post Created Successfully',{position: "top-center",
autoClose: 2000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",});

        },
        onError:(error)=>{
            console.log(error);
            toast.error('Failed to create post',{position: "top-center",
autoClose: 2000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",});
        }
        
        
    });

    return (
        <>
        <Card>
            <CardBody className="flex flex-row gap-2 items-center">
            <Avatar
                size="md"
                className="w-fit"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
            />
            <input
                onClick={onOpen}
                className="bg-transparent border-none focus:outline-none w-full cursor-pointer"
                placeholder="Whats on your mind boda?"
            ></input>
            </CardBody>
        </Card>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <h1 className="flex justify-center text-2xl font-bold pt-3"> 
                Create Post
                </h1>
                <ModalHeader className="flex flex-col gap-1 ">
                    <div className="flex flex-row items-center gap-2">
                    <Avatar
                    size="md"
                    className="w-fit"
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
                    
                    />
                    <p>
                    username  
                    </p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <textarea
                    ref={captionRef}
                    className="bg-transparent border-none focus:outline-none w-full"
                    placeholder="What's on your mind?"
                    rows={3}
                    />
                    {selectedImage && <div className="flex justify-center ">
                        
                        <Image
        alt="HeroUI hero Image"
        src={selectedImage}
        width={300}
        />
        <CloseCircle className="cursor-pointer " size="32" color="#f47373" variant="Outline" onClick={handleClearImage}/>
                    </div>}
                </ModalBody>
                <ModalFooter className="flex items-center">
                    <label className="cursor-pointer  hover:bg-gray-200 p-2 rounded-2xl">
                    <Gallery size="32" color="#555555"  variant="Outline"/>
                    <input type="file" hidden ref={imageInputRef} onChange={handleChangeImage} >
                    </input>
                </label>
                    <Button color="danger" variant="light" onPress={onClose} onClick={handleClearImage}>
                    Close
                    </Button>
                    <Button color="primary" disabled={isPending || !captionRef.current?.value && !imageInputRef.current?.files[0]} onClick={mutate}>
                    Share
                    </Button>
                
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
        </>
    );
    }
