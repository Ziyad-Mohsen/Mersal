import { Image, LoaderCircle, SendHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostsStore } from "../store/usePostsStore";

function CreatePost() {
  const { t } = useTranslation();
  const textareaRef = useRef(null);
  const { isCreatingPost, createPost, setActiveFeed } = usePostsStore();

  const [postData, setPostData] = useState({
    content: "",
    postImage: "",
  });
  const [preview, setPreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleImageImport = (e) => {
    const image = e.target.files[0];
    setPreview(URL.createObjectURL(image));
    setPostData({ ...postData, postImage: image });
  };

  const handleImageRemove = () => {
    setPreview(null);
    setPostData({ ...postData, postImage: "" });
  };

  const handlePostCreation = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("postImage", postData.postImage);
    createPost(formData);
    setPreview(null);
    setPostData({ content: "", postImage: "" });
    setActiveFeed("explore");
  };

  if (isCreatingPost)
    return (
      <div className="flex justify-center items-center p-10 gap-2 bg-secondary mb-5 shadow-lg">
        <LoaderCircle className="animate-spin text-primary mr-3" size={32} />
        <span className="text-primary font-medium">{t("creatingPost")}</span>
      </div>
    );

  return (
    <form className="mb-5 w-full bg-secondary" onSubmit={handlePostCreation}>
      <div
        className={`flex gap-2 items-center p-5 transition-all ${
          isFocused ? "shadow-xl" : "shadow"
        }`}
      >
        <label
          htmlFor="postImage"
          className="flex justify-center items-center cursor-pointer hover:text-primary transition-colors"
        >
          <Image size={24} />
        </label>
        <textarea
          id="content"
          type="text"
          ref={textareaRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={handleInput}
          placeholder={t("postTextInputPlaceholder")}
          className="flex-1 p-2 focus:outline-0 h-auto resize-none overflow-hidden placeholder:text-text/50"
          rows={1}
          value={postData.content}
          maxLength={300}
          onChange={(e) =>
            setPostData({ ...postData, content: e.target.value })
          }
        />
        {postData.content && (
          <button
            htmlFor="content"
            className="btn hover:text-primary transition-colors disabled:text-gray-700 disabled:cursor-default"
            disabled={isCreatingPost}
          >
            {isCreatingPost ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <SendHorizontal className="rtl:rotate-180" />
            )}
          </button>
        )}
        <input
          type="file"
          id="postImage"
          name="postImage"
          className="hidden"
          accept="image/*"
          onChange={handleImageImport}
        />
      </div>
      {preview && (
        <div className="relative min-w-full">
          <button
            className="btn absolute hover:text-primary transition-colors"
            onClick={handleImageRemove}
          >
            <X />
          </button>
          <img className="object-cover w-full" src={preview} />
        </div>
      )}
    </form>
  );
}

export default CreatePost;
