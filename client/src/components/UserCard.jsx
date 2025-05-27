import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useUsersStore } from "../store/useUsersStore";
import Avatar from "./ui/Avatar";

function UserCard({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { authUser, checkAuth } = useAuthStore();
  const { followUser, unfollowUser } = useUsersStore();

  const [following, setFollowing] = useState(
    user.followers.includes(authUser?.id)
  );

  const handleFollowToggle = async () => {
    if (!authUser) return navigate("/login");

    if (!following) {
      setFollowing(true);
      try {
        const res = await followUser(user.id);
        if (!res.success) {
          setFollowing(false);
        }
      } catch (error) {
        console.error(error);
        setFollowing(false);
      }
    } else {
      setFollowing(false);
      try {
        const res = await unfollowUser(user.id);
        if (!res.success) {
          setFollowing(true);
        }
      } catch (error) {
        console.error(error);
        setFollowing(true);
      }
    }
    checkAuth();
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        to={
          authUser && authUser.id === user.id ? "/profile" : `/user/${user.id}`
        }
        className="flex items-center gap-3 min-w-0 flex-1"
      >
        <Avatar src={user.profilePic.url} size={42} />
        <h5 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap flex-1">
          {user.username}
        </h5>
      </Link>
      {authUser && authUser.id !== user.id && (
        <button
          className={`btn px-2 py-1 font-normal transition-colors shrink-0 ${
            following
              ? "text-text hover:text-primary shadow shadow-primary-light"
              : "btn-primary"
          }`}
          onClick={handleFollowToggle}
        >
          {following ? t("unfollowButton") : t("followButton")}
        </button>
      )}
    </div>
  );
}

export default UserCard;
