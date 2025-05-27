import Avatar from "../components/ui/Avatar";
import { UserRoundPen, UserRoundX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useModal from "../hooks/useModal";
import UserFollowers from "../components/modals/UserFollowers";
import UserFollowing from "../components/modals/UserFollowing";

function UserProfileHeader({
  user,
  isAuth = false,
  onEdit,
  onDelete,
  following,
  onFollowToggle,
}) {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const [previewImg, setPreviewImg] = useState(false);

  return (
    <section className="bg-secondary-light px-4 py-8 shadow mb-6 max-w-4xl mx-auto">
      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewImg(false)}
        >
          <img
            src={user?.profilePic?.url}
            alt="Profile Preview"
            className="max-w-full max-h-full rounded-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar + Actions */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <div className="relative group">
            <Avatar
              onClick={() => setPreviewImg(true)}
              src={user?.profilePic?.url}
              size={120}
              className="ring-4 ring-primary/10 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
            />
            {isAuth && (
              <button
                onClick={onEdit}
                className="absolute bottom-2 end-2 bg-primary text-white p-2 rounded-full shadow hover:bg-primary/90 transition-colors cursor-pointer"
                title={t("editProfile")}
              >
                <UserRoundPen size={18} />
              </button>
            )}
          </div>
          {isAuth ? (
            <button
              title={t("deleteProfile")}
              className="group btn p-2 rounded-lg hover:text-red-500 text-sm border border-red-200 mt-2 flex items-center transition-all ease-out"
              onClick={onDelete}
            >
              <UserRoundX size={18} />
              <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 whitespace-nowrap">
                {t("deleteProfile")}
              </span>
            </button>
          ) : (
            <button
              className={`btn px-4 py-2 font-medium transition-colors ${
                following
                  ? "text-text hover:text-primary shadow shadow-primary-light"
                  : "btn-primary"
              }`}
              onClick={onFollowToggle}
            >
              {following ? t("unfollowButton") : t("followButton")}
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-2 items-start md:items-start text-start">
          <h3 className="text-3xl font-bold text-text break-words mb-1">
            {user.fullName}
          </h3>
          <p className="text-lg font-medium text-text/70 break-all" dir="auto">
            @{user.username}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <button
              className="btn text-sm bg-secondary hover:bg-secondary-dark/80 rounded-lg shadow"
              onClick={() => openModal(<UserFollowers userId={user.id} />)}
            >
              <span className="font-bold">{user.followersCount}</span>
              <span className="ml-1 font-medium">{t("profileFollowers")}</span>
            </button>
            <button
              className="btn text-sm bg-secondary hover:bg-secondary-dark/80 rounded-lg shadow"
              onClick={() => openModal(<UserFollowing userId={user.id} />)}
            >
              <span className="font-bold">{user.followingCount}</span>
              <span className="ml-1 font-medium">{t("profileFollowing")}</span>
            </button>
            <a
              href="#posts"
              className="btn text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg shadow"
            >
              <span className="font-bold">{user.postsCount}</span>
              <span className="ml-1 font-medium">{t("profilePosts")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfileHeader;
