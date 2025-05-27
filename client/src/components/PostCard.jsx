import {
  CircleX,
  Delete,
  Dot,
  Edit,
  Heart,
  MessageCircle,
  PenLine,
} from "lucide-react";
import { dateFormate } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { usePostsStore } from "../store/usePostsStore";
import { Link, useNavigate } from "react-router-dom";
import PostImage from "./PostImage";
import useModal from "../hooks/useModal";
import UpdatePost from "../components/modals/UpdatePost";
import DeletePost from "../components/modals/DeletePost";
import Avatar from "./ui/Avatar";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

function PostCard({ post: propPost, editable = false }) {
  const { t } = useTranslation();
  const [post, setPost] = useState(propPost);
  const {
    id,
    content,
    postImage,
    author,
    likesCount,
    commentsCount,
    createdAt,
  } = post;
  const navigate = useNavigate();
  const { openModal } = useModal();

  // Stores
  const { authUser } = useAuthStore();
  const {
    addLike,
    removeLike,
    deletePost,
    addComment,
    getPostById,
    updatePost,
  } = usePostsStore();

  // States
  const [likedPost, setLikedPost] = useState(post.likes.includes(authUser?.id));
  const [likes, setLikes] = useState(likesCount);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!authUser) return navigate("/login");
    if (likedPost) {
      setLikedPost(false);
      setLikes((prev) => prev - 1);

      try {
        const res = await removeLike(id);
        if (!res.success) {
          setLikedPost(true);
          setLikes((prev) => prev + 1);
        }
      } catch (error) {
        console.error(error);
        setLikedPost(true);
        setLikes((prev) => prev + 1);
      }
    } else {
      setLikedPost(true);
      setLikes((prev) => prev + 1);

      try {
        const res = await addLike(id);
        if (!res.success) {
          setLikedPost(false);
          setLikes((prev) => prev - 1);
        }
      } catch (error) {
        console.error(error);
        setLikedPost(false);
        setLikes((prev) => prev - 1);
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    const newComment = {
      commenter: {
        fullName: authUser.fullName,
        username: authUser.username,
        profilePic: authUser.profilePic,
      },
      text: comment,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update comments
    setComments((prevComments) => [newComment, ...prevComments]);
    setComment("");

    try {
      const response = await addComment(id, { comment });
      if (!response.success) {
        toast.error("Failed to add comment");
      }

      const postResponse = await getPostById(id);

      // Update the comment with the real data
      setPost(postResponse);
    } catch (error) {
      const postResponse = await getPostById(id);
      console.error("Error adding comment:", error);

      toast.error("Failed to add comment");
      // Revert the optimistic update
      setPost(postResponse);
    }
  };

  const handlePostUpdate = async (data) => {
    try {
      const post = await updatePost(id, data);
      setPost(post);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <article className="bg-secondary-light max-w-full shadow py-8 px-6 flex flex-col gap-5">
      <Link
        to={
          authUser && authUser.id === author.id
            ? "/profile"
            : `/user/${author.id}`
        }
        className="flex gap-2 items-center"
      >
        <Avatar src={post.author.profilePic.url} size={48} />
        <div className="flex items-center">
          <div>
            <h2 className="font-bold text-text-light ">{author.username}</h2>
          </div>
          <Dot size={24} />
          <div>
            <h6 className="text-text-light font-medium text-sm">
              {dateFormate(createdAt)}
            </h6>
          </div>
        </div>
        {/* Edit and delete buttons */}
        {authUser && authUser.id === author.id && editable && (
          <div>
            <button
              onClick={() =>
                openModal(
                  <UpdatePost post={post} onSubmit={handlePostUpdate} />
                )
              }
              className="btn hover:text-primary transition-colors p-2"
            >
              <Edit size={18} />
            </button>
            <button
              className="btn text-red-500 hover:text-primary transition-colors p-2"
              onClick={() =>
                openModal(<DeletePost onConfirm={() => deletePost(id)} />)
              }
            >
              <CircleX size={18} />
            </button>
          </div>
        )}
      </Link>
      {/* Post Text */}
      <div>
        <p dir="auto">{content}</p>
      </div>
      {/* Post Image */}
      {postImage?.url ? <PostImage url={postImage.url} /> : null}
      {/* Action Buttons */}
      <div className="flex gap-5">
        <button
          className={`flex items-center gap-2 cursor-pointer hover:text-primary transition-colors ${
            likedPost ? "text-primary" : "text-text"
          }`}
          type="button"
          onClick={handleToggleLike}
        >
          <Heart />
          <span>{likes}</span>
        </button>
        <button
          className={`flex items-center gap-2 cursor-pointer hover:text-primary transition-colors ${
            showComments ? "text-primary" : ""
          }`}
          type="button"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle />
          <span>{commentsCount}</span>
        </button>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="flex flex-col">
          <h5 className="font-semibold py-2">{t("comments")}</h5>
          {/* Comment form */}
          {authUser && (
            <div className="mb-4">
              <form
                className="w-full flex gap-2  border-b-1 border-text-light"
                onSubmit={handleComment}
              >
                <input
                  placeholder={t("addComment")}
                  type="text"
                  className="flex-1 py-2 focus:outline-none"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                {comment && (
                  <button
                    className="text-text hover:text-primary transition-colors p-2 cursor-pointer"
                    type="submit"
                  >
                    <PenLine />
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Comments */}
          {comments.length > 0 ? (
            comments.map((comment, i) => {
              return (
                <div key={i} className="flex gap-2 items-center my-2">
                  <Avatar
                    src={
                      comment.commenter?.profilePic.url
                        ? comment.commenter.profilePic.url
                        : null
                    }
                    size={32}
                  >
                    {comment.commenter.username}
                  </Avatar>
                  <div>
                    <Link
                      className="flex gap-2 items-center"
                      to={
                        authUser && authUser.id === comment.commenter.id
                          ? "/profile"
                          : `/user/${comment.commenter.id}`
                      }
                    >
                      <div className="font-bold">
                        {comment.commenter.username}
                      </div>
                      <span className="bg-text-light/70 rounded-full w-1 h-1"></span>
                      <span className="text-sm font-light">
                        {dateFormate(comment.createdAt)}
                      </span>
                    </Link>
                    <div>{comment.text}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-text-light/30">{t("noCommentsToShow")}</div>
          )}
        </div>
      )}
    </article>
  );
}

export default PostCard;
