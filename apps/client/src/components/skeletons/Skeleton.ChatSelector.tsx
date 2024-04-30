import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonChatSelector = () => {
  return (
    <SkeletonTheme baseColor="#B4B4B8" highlightColor="#F6F5F5">
      <div className=" w-full p-4 flex flex-col gap-4 opacity-30">
        <Skeleton className=" rounded-lg h-16 " />
        <Skeleton className=" rounded-lg h-16 " />
        <Skeleton className=" rounded-lg h-16 " />
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonChatSelector;
