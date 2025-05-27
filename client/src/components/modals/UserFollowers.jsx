import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import UserCard from "../UserCard";
import { useTranslation } from "react-i18next";

const UserFollowers = ({ userId }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/users/${userId}/followers`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      <h5 className="font-bold text-lg mb-5">{t("followers")}</h5>
      {isLoading ? (
        <div className="w-full flex items-center justify-center">
          <span className="border-2 border-b-transparent border-primary animate-spin w-8 h-8 rounded-full"></span>
        </div>
      ) : users.length > 0 ? (
        <ul className="space-y-4 max-h-[50vw] overflow-auto p-2 scrollbar-none">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{t("noFollowers")}</p>
      )}
    </div>
  );
};

export default UserFollowers;
