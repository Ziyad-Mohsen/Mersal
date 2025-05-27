import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import { useAuthStore } from "../store/useAuthStore";
import { usePostsStore } from "../store/usePostsStore";
import CreatePost from "./CreatePost";
import PostsCardsSkeleton from "./skeletons/PostsCardsSkeleton";
import { useTranslation } from "react-i18next";
import { Compass, StickyNote, UserCheck } from "lucide-react";

function Timeline() {
  const { t } = useTranslation();
  const {
    posts,
    followingPosts,
    getPosts,
    getFollowingPosts,
    isPostsLoading,
    activeFeed,
    setActiveFeed,
  } = usePostsStore();
  const { authUser } = useAuthStore();

  // Initial Fetch
  useEffect(() => {
    getPosts(1);
    getFollowingPosts(1);
  }, [getPosts, getFollowingPosts]);

  const loadMoreRef = useRef(null);

  const Feeds = {
    explore: posts,
    following: followingPosts,
  };

  const FeedsFetchFunc = {
    explore: getPosts,
    following: getFollowingPosts,
  };

  const activePosts = Feeds[activeFeed];

  // Reset feed to explore when authUser changes (optional)
  useEffect(() => {
    setActiveFeed("explore");
  }, [authUser, setActiveFeed]);

  // Infinite Scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isPostsLoading) {
          handleFetchingPosts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [activeFeed, activePosts.meta, isPostsLoading]);

  const handleFetchingPosts = () => {
    const { nextPage, currentPage, totalPages } = activePosts.meta;
    if (currentPage < totalPages) {
      FeedsFetchFunc[activeFeed](nextPage);
    }
  };

  // Track last clicked feed for double click detection
  const lastClickRef = useRef({ feed: null, time: 0 });

  const handleFeedClick = (feed) => {
    const now = Date.now();
    if (activeFeed === feed) {
      if (
        lastClickRef.current.feed === feed &&
        now - lastClickRef.current.time < 5000
      ) {
        // Refetch posts for the active feed
        FeedsFetchFunc[feed](1);
      }
      lastClickRef.current = { feed, time: now };
    } else {
      setActiveFeed(feed);
      lastClickRef.current = { feed, time: now };
    }
  };

  return (
    <div className="mb-10">
      {authUser && <CreatePost />}
      <div className="p-2 bg-secondary flex justify-center sticky top-20 z-10">
        <ul className="flex gap-4 items-center">
          <li
            className={`flex flex-col items-center hover:text-primary transition-colors cursor-pointer ${
              activeFeed === "explore" ? "text-primary" : "text-text"
            }`}
            onClick={() => handleFeedClick("explore")}
            onDoubleClick={() => FeedsFetchFunc["explore"](1)}
          >
            <Compass />
            {t("explore")}
          </li>
          {authUser && (
            <li
              className={`flex flex-col items-center hover:text-primary transition-colors cursor-pointer ${
                activeFeed === "following" ? "text-primary" : "text-text"
              }`}
              onClick={() => handleFeedClick("following")}
              onDoubleClick={() => FeedsFetchFunc["following"](1)}
            >
              <UserCheck />
              {t("following")}
            </li>
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-5 mb-20 md:mb-0">
        {activePosts.data.length > 0
          ? activePosts.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          : !isPostsLoading && (
              <div className="w-full flex flex-col items-center justify-center gap-4 p-6 bg-secondary-light text-text text-lg">
                <StickyNote size={48} className="text-primary mb-2" />
                <h3 className="text-2xl font-semibold">
                  {t("noPostsAvailable")}
                </h3>
              </div>
            )}
      </div>
      {/* Loading & Infinite Scroll Trigger */}
      {isPostsLoading ? (
        <PostsCardsSkeleton count={3} />
      ) : (
        <div ref={loadMoreRef} className="h-10" />
      )}
    </div>
  );
}

export default Timeline;
