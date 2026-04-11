import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import Loaderpage from "../Loaderpage/Loaderpage";
import MyCardheader from "../Cardheader/Cardheader";
import { Card } from "@heroui/react";
import CommentCreation from "../CommentCreation/CommentCreation";
export default function PostDetails() {
  const { id } = useParams();

  //   function GetPostDetails() {
  //     return axios.get(
  //       `https://route-posts.routemisr.com/posts/${id}`,
  //       {
  //         headers: {
  //           token: localStorage.getItem("token"),
  //         },
  //       }
  //     );
  //   }

  function GetPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["GetPostComments", id],
    queryFn: GetPostComments,
  });

  //   const { data: commentsData, isLoading: loadingComments } = useQuery({
  //     queryKey: ["postComments", id],
  //     queryFn: GetPostComments,
  //   });

  //   if (loadingPost || loadingComments) {
  //     return <Loaderpage />;
  //   }
  if (isLoading) {
    return <Loaderpage />;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const comments = data?.data.data.comments;
  console.log("Comments", comments);
  


  return (
    
    <div className="w-3/4 mx-auto py-5">
        <CommentCreation  postId={id} />
      <div className="flex flex-col gap-4">
        {comments?.map((comment) => (
          <Card key={comment._id}>
            <MyCardheader
              photo={comment.commentCreator.photo}
              name={comment.commentCreator.name}
              createdAt={comment.createdAt}
              content={comment.content}
              userCardId={comment.commentCreator._id}
              cardId={comment._id}
              cardType="comments"
              postId={id}
            />
          </Card>
        ))}
      </div>

      {/* <Card>
      <MyCardheader photo={id.photo} name={id.name} createdAt={id.createdAt} />
      <Divider />
      <CardBody className="flex gap-3 flex-col">
        <p>{id.body}</p>
        {id.image && (
          <div className="w-full flex justify-center">
            <Image className="object-cover h-100" alt={id.name} src={id.image} />
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 justify-center items-center">
          <Like1 size="32" color="#FF8A65" variant="Outline" />
          <h6>Like</h6>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Message size="32" color="#FF8A65" />
          <h6>Comment</h6>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Share size="32" color="#FF8A65" />
          <h6>Share</h6>
        </div>
      </CardFooter>
      
        
      
     
      
    </Card> */}
    </div>
  );
}
