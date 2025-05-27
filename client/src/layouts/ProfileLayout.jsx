import { Check, StickyNote, UserRoundPen, UserRoundX } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import PostCard from "../components/PostCard";
import { useEffect, useRef } from "react";
import PostsCardsSkeleton from "../components/skeletons/PostsCardsSkeleton";
import PageTitle from "../components/PageTitle";
import { usePostsStore } from "../store/usePostsStore";
import useModal from "../hooks/useModal";
import UpdateProfile from "../components/modals/UpdateProfile";
import DeleteProfile from "../components/modals/DeleteProfile";
import ProfileInfoSkeleton from "../components/skeletons/ProfileInfoSkeleton";
import UserProfileHeader from "./UserProfileHeader";

function ProfileLayout() {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { deleteProfile, updateProfile, checkAuth, isCheckingAuth } =
    useAuthStore();
  const { getUserPosts, isLoadingUserPosts } = usePostsStore();
  const authUser = useAuthStore((state) => state.authUser);
  const userPosts = usePostsStore((state) => state.userPosts);
  const loadMoreRef = useRef();
  const hasMore = userPosts.meta.currentPage < userPosts.meta.totalPages;

  useEffect(() => {
    checkAuth();
    getUserPosts(authUser.id);
  }, []);

  const handleUpdateProfile = async (data) => {
    const res = await updateProfile(data);
    return res;
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingUserPosts) {
          handleFetchingPosts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isLoadingUserPosts]);

  const handleFetchingPosts = () => {
    if (hasMore) {
      getUserPosts(authUser.id, userPosts.meta.nextPage);
    }
  };
  return (
    <>
      <PageTitle title={authUser.fullName} />
      {isCheckingAuth ? (
        <ProfileInfoSkeleton />
      ) : (
        <UserProfileHeader
          user={authUser}
          isAuth={true}
          onEdit={() =>
            openModal(
              <UpdateProfile user={authUser} onSubmit={handleUpdateProfile} />
            )
          }
          onDelete={() =>
            openModal(<DeleteProfile onConfirm={deleteProfile} />)
          }
        />
      )}
      <hr className="border-secondary-dark mb-6" />
      <section
        className="flex flex-col gap-6 mb-20 md:mb-0 max-w-3xl mx-auto"
        id="posts"
      >
        {userPosts.data.length > 0
          ? userPosts.data.map((post) => (
              <PostCard key={post.id} post={post} editable={true} />
            ))
          : !isLoadingUserPosts && (
              <div className="w-full flex flex-col items-center justify-center gap-4 p-8 bg-secondary-light text-text text-lg rounded-xl shadow">
                <StickyNote size={48} className="text-primary mb-2" />
                <h3 className="text-2xl font-semibold">
                  {t("noPostsAvailable")}
                </h3>
              </div>
            )}
        {/* Loading & Infinite Scroll Trigger */}
        {isLoadingUserPosts ? (
          <PostsCardsSkeleton count={1} />
        ) : (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </section>
    </>
  );
}

export default ProfileLayout;
