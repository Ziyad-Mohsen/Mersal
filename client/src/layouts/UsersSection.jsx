import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUsersStore } from "../store/useUsersStore";
import UserCardSkeleton from "../components/skeletons/UserCardSkeleton";
import UserCard from "../components/UserCard";
import { useAuthStore } from "../store/useAuthStore";

function UsersSection() {
  const { t } = useTranslation();
  const { getPopularUsers, isLoadingPopularUsers } = useUsersStore();
  const { authUser } = useAuthStore();
  const popularUsers = useUsersStore((state) => state.popularUsers);

  useEffect(() => {
    getPopularUsers();
  }, [getPopularUsers, authUser]);

  return (
    <>
      <div className="mb-5 text-gray-500 font-medium">
        {t("usersSectionTitle")}
      </div>
      {isLoadingPopularUsers ? (
        <UserCardSkeleton count={3} />
      ) : (
        <ul className="flex flex-col gap-5">
          {popularUsers.map((user) => {
            return (
              <li key={user.id}>
                <UserCard user={user} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default UsersSection;
