import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { Like1, Message, Share } from "iconsax-reactjs";
import MyCardheader from "../Cardheader/Cardheader";
import { Link } from "react-router-dom";
import CommentCreation from "../CommentCreation/CommentCreation";

export default function Postcard({ postsinfo , isPostDetailsPage= false }) {
  const { body, image, createdAt, user, topComment, commentsCount , id } = postsinfo;
  const { name, photo, _id } = user;
  const Firstcomment = topComment;
  console.log( 'Post Info:', postsinfo);
  
  
  
  const isEmptyPost =
    (!body || !body.trim()) &&
    (!image ||  !image.trim());

  if (isEmptyPost) return null;
  return (
    <>
    
    <Card>
      <MyCardheader photo={photo} name={name} createdAt={createdAt} userCardId={_id} cardId={id} postId={id} cardType="posts" />
      <Divider />
      <CardBody className="flex gap-3 flex-col">
        <p>{body}</p>
        {image && (
          <div className="w-full flex justify-center">
            <Image className="object-cover h-100" alt={name} src={image} />
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
      { !isPostDetailsPage && commentsCount > 1 && 
        <Link to={`/PostDetails/${id}`}  className="text-center text-blue-500 mb-3 cursor-pointer">
          view more comments...
        </Link>
      }
      {!isPostDetailsPage && Firstcomment && (
        <MyCardheader
          className="bg-gray-50 pl-10"
          photo={Firstcomment.commentCreator.photo}
          name={Firstcomment.commentCreator.name}
          createdAt={Firstcomment.createdAt}
          content={Firstcomment?.content}
          userCardId={Firstcomment.commentCreator._id}
          cardId={Firstcomment._id}
          cardType={'comments'}
          postId={id}
        />
      )}
      
     <CommentCreation postId={id} />
      
    </Card>
    </>
  );
}

