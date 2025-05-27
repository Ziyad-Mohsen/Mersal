import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsersStore } from "../store/useUsersStore";
import PageTitle from "../components/PageTitle";
import { useTranslation } from "react-i18next";
import Avatar from "../components/ui/Avatar";
import ProfileInfoSkeleton from "../components/skeletons/ProfileInfoSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { StickyNote } from "lucide-react";
import PostsCardsSkeleton from "../components/skeletons/PostsCardsSkeleton";
import PostCard from "../components/PostCard";
import { axiosInstance } from "../lib/axios";
import UserProfileHeader from "./UserProfileHeader";

function UserLayout() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const loadMoreRef = useRef();
  const { getUser, followUser, unfollowUser } = useUsersStore();
  const [following, setFollowing] = useState(false);
  // user
  const [user, setUser] = useState({});
  const [isGettingUser, setIsGettingUser] = useState(false);
  // user posts
  const [userPosts, setUserPosts] = useState({ data: [], meta: {} });
  const [isGettingPosts, setIsGettingPosts] = useState(true);
  const hasMore = userPosts.meta.currentPage < userPosts.meta.totalPages;

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      const resUser = await getUser(id);
      setUser(resUser);
      setFollowing(resUser.followers.includes(authUser?.id));
      getPosts();
    } catch (error) {
      console.log("error in getting user data", error);
    } finally {
      setIsGettingUser(false);
    }
  };

  const getPosts = async (page) => {
    setIsGettingPosts(() => true);
    const resPosts = await axiosInstance.get(`/users/${id}/posts?page=${page}`);
    const { data, meta } = resPosts.data;
    setUserPosts({
      data: page === 1 ? data : [...userPosts.data, ...data],
      meta,
    });
    setIsGettingPosts(() => false);
  };

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
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isGettingPosts) {
          handleFetchingPosts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isGettingPosts]);

  const handleFetchingPosts = () => {
    if (hasMore) {
      getPosts(userPosts.meta.nextPage);
    }
  };

  return (
    <div>
      <PageTitle title={user.fullName} />
      {isGettingUser ? (
        <ProfileInfoSkeleton />
      ) : (
        <UserProfileHeader
          user={user}
          isAuth={false}
          following={following}
          onFollowToggle={handleFollowToggle}
        />
      )}
      <hr className="text-secondary-dark" />
      <div className="flex flex-col gap-5 mb-20 md:mb-0" id="posts">
        {userPosts.data.length > 0
          ? userPosts.data.map((post) => (
              <PostCard key={post.id} post={post} editable={true} />
            ))
          : !isGettingPosts && (
              <div className="w-full flex flex-col items-center justify-center gap-4 p-6 bg-secondary-light text-text text-lg">
                <StickyNote size={48} className="text-primary mb-2" />
                <h3 className="text-2xl font-semibold">
                  {t("noPostsAvailable")}
                </h3>
              </div>
            )}
        {/* Loading & Infinite Scroll Trigger */}
        {isGettingPosts ? (
          <PostsCardsSkeleton count={1} />
        ) : (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>
    </div>
  );
}

export default UserLayout;
