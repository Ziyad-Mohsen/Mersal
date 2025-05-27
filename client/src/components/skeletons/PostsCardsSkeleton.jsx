import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useThemeStore } from "../../store/useThemeStore";

function PostsCardsSkeleton({ count = 1 }) {
  const [colors, setColors] = useState({});
  const { isDark } = useThemeStore();
  const arr = new Array(count).fill(null);

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
      {arr.map((_, i) => {
        return (
          <div
            key={i}
            className="bg-secondary-light max-w-full shadow py-8 px-6 flex flex-col gap-5"
          >
            <div>
              <Skeleton circle width={64} height={64} />
            </div>
            {/* Post Text */}
            <div>
              <Skeleton count={4} style={{ width: "100%" }} />
            </div>
            {/* Post Image */}
            {/* Action Buttons */}
            <div>
              <Skeleton height={200} style={{ width: "100%" }} />
            </div>
            {/* Comments Section */}
          </div>
        );
      })}
    </SkeletonTheme>
  );
}

export default PostsCardsSkeleton;
