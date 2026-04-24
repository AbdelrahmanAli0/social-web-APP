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
import { useContext,useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Authcontext } from "../../Context/Authcontext";

export default function Postcard({ postsinfo, isPostDetailsPage = false }) {
  const { body, image, createdAt, user, topComment, commentsCount, id } =
    postsinfo;
  const { name, photo, _id } = user;
  const { userId } = useContext(Authcontext);
  const Firstcomment = topComment;
  const [isLiked, setIsLiked] = useState(postsinfo.likes?.includes(userId));
  const [count, setCount] = useState(postsinfo.likesCount || 0);
  const [showLikes, setShowLikes] = useState(false);
  const isEmptyPost = (!body || !body.trim()) && (!image || !image.trim());
  // console.log("Firstcomment", Firstcomment);
  // console.log("Post Info:", postsinfo);

  function getGetPostLikes() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${id}/likes?page=1&limit=20`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const {
    data: likesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["postLikes", id],
    queryFn: getGetPostLikes,
  });
  //  console.log( 'el laykaat' , likesData?.data?.data?.likes);

  function handleLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/like`,
      {},
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleLike,
    mutationKey: "handleLike",
    onMutate: () => {
      setIsLiked((prev) => {
        setCount((c) => c + (prev ? -1 : 1));
        return !prev;
      });
    },
    onSuccess: (res) => {
      const newLiked = res.data.data.liked;
      setIsLiked(newLiked);
    },
    onError: () => {
      setIsLiked((prev) => {
        setCount((c) => c + (prev ? -1 : 1));
        return !prev;
      });
    },
  });

  if (isEmptyPost) return null;
  return (
    <>
      <Card>
        <MyCardheader
          photo={photo}
          name={name}
          createdAt={createdAt}
          userCardId={_id}
          cardId={id}
          postId={id}
          cardType="posts"
          image={image}
        />
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
            <motion.div
              onClick={() => !isPending && mutate()}
              whileTap={{ scale: 0.85 }}
              animate={{ scale: isLiked ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex gap-2 justify-center items-center cursor-pointer"
            >
              <Like1
                size="32"
                color={isLiked ? "#0095f6" : "#FF8A65"}
                variant={isLiked ? "Bold" : "Outline"}
              />
              <h6 style={{ color: isLiked ? "#0095f6" : "#000" }}>Like</h6>
            </motion.div>
            <span
              className="cursor-pointer"
              onClick={async () => {
                setShowLikes(true);
                await refetch();
              }}
            >
              {count > 0 ? count : ""}
            </span>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <Message size="32" color="#FF8A65" />
            <Link
            to={`/PostDetails/${id}`}
            className="cursor-pointer"
          >
            <h6>Comment</h6>
          </Link>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <Share size="32" color="#FF8A65" />
            <h6>Share</h6>
          </div>
        </CardFooter>
        {!isPostDetailsPage && commentsCount > 1 && (
          <Link
            to={`/PostDetails/${id}`}
            className="text-center text-blue-500 mb-3 cursor-pointer"
          >
            view more comments...
          </Link>
        )}
        {showLikes && !isLoading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/70 flex justify-center items-center">
            <div className="bg-white w-[90%] max-w-md max-h-[80vh] overflow-y-auto rounded-xl p-4">
              <h3 className="text-lg font-bold mb-3">Likes</h3>

              {likesData?.data?.data?.likes?.map((user) => (
                <div key={user._id} className="flex items-center gap-3 mb-2">
                  <img src={user.photo} width="40" className="rounded-full" />
                  <span>{user.name}</span>
                </div>
              ))}

              <button
                onClick={() => setShowLikes(false)}
                className="mt-4 cursor-pointer bg-red-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {!isPostDetailsPage && Firstcomment && (
          <MyCardheader
            className="bg-gray-50 pl-10"
            photo={Firstcomment.commentCreator.photo}
            name={Firstcomment.commentCreator.name}
            createdAt={Firstcomment.createdAt}
            content={Firstcomment.content}
            userCardId={Firstcomment.commentCreator._id}
            cardId={Firstcomment._id}
            cardType={"comments"}
            postId={id}
          />
        )}

        <CommentCreation postId={id} />
      </Card>
    </>
  );
}
