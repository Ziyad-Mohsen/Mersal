import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useThemeStore } from "../../store/useThemeStore";

function UserCardSkeleton({ count = 1 }) {
  const [colors, setColors] = useState({});
  const { isDark } = useThemeStore();
  const arr = Array(count).fill(null);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const baseColor = rootStyles.getPropertyValue("--color-secondary");
    const highlightColor = rootStyles.getPropertyValue(
      "--color-secondary-light"
    );
    setColors({ baseColor, highlightColor });
  }, [isDark]);
  return (
    <SkeletonTheme
      baseColor={colors.baseColor}
      highlightColor={colors.highlightColor}
    >
      <div className="flex flex-col items-start">
        {arr.map((_, i) => {
          return (
            <div key={i} className="flex w-full gap-2 items-center">
              <Skeleton circle width={64} height={64} />
              <div className="flex-1">
                <Skeleton count={2} height={10} />
              </div>
            </div>
          );
        })}
      </div>
    </SkeletonTheme>
  );
}

export default UserCardSkeleton;
