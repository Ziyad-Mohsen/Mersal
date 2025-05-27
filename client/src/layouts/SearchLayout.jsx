import { useTranslation } from "react-i18next";
import PageTitle from "../components/PageTitle";
import { useUsersStore } from "../store/useUsersStore";
import { useEffect } from "react";
import UserCard from "../components/UserCard";
import { X } from "lucide-react";
import UserCardSkeleton from "../components/skeletons/UserCardSkeleton";

function SearchLayout() {
  const { t } = useTranslation();
  const { getUsers } = useUsersStore();
  const users = useUsersStore((state) => state.users);
  const search = useUsersStore((state) => state.search);
  const { setSearch, isLoadingUsers } = useUsersStore();
  const hasMore = users.meta.currentPage < users.meta.totalPages;

  useEffect(() => {
    const handler = setTimeout(() => {
      getUsers(search);
    }, 200);

    return () => clearTimeout(handler);
  }, [search]);

  const handleLoadMore = () => {
    if (hasMore) {
      getUsers(search, users.meta.nextPage);
    }
  };

  return (
    <div>
      <PageTitle title={t("search")} />
      <div className="bg-secondary-light max-w-full p-5">
        <form onSubmit={(e) => e.preventDefault()} className="relative mb-10">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="px-4 py-3 pe-10   w-full focus:outline-none focus:shadow-lg shadow-black/20 transition-shadow border-1 border-text-light/10 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setSearch("")}
            >
              <X />
            </button>
          )}
        </form>
        <div className="flex flex-col gap-4">
          {users.data.length > 0
            ? users.data.map((user) => {
                return <UserCard key={user.id} user={user} />;
              })
            : !isLoadingUsers && (
                <div className="w-full text-center text-xl text-text/50">
                  No users found
                </div>
              )}
          {isLoadingUsers ? (
            <UserCardSkeleton count={1} />
          ) : (
            hasMore && (
              <button
                className="btn hover:text-primary transition-colors"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchLayout;
