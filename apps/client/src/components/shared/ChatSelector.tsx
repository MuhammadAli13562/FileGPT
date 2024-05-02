import { Link, useParams } from "react-router-dom";
import { useFetchDataFixedCache } from "src/redux/api/user";
import { SelectAllMetaContextWindows } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";
import SkeletonChatSelector from "../skeletons/Skeleton.ChatSelector";
import ContextDeleteButton from "./ContextDeleteButton";

const ChatSelector = () => {
  const { id } = useParams();
  const { isLoading, isError } = useFetchDataFixedCache();
  const ContextWindowsData = useTypedSelector(SelectAllMetaContextWindows);
  const sortedContextWindowsData = [...ContextWindowsData].sort((ctx1, ctx2) => {
    // Convert createdAt values to Date objects for proper comparison
    const date1 = new Date(ctx1.createdAt);
    const date2 = new Date(ctx2.createdAt);

    // Compare the dates in descending order
    if (date1 > date2) {
      return -1; // ctx1 should come before ctx2 (newer date)
    }
    if (date1 < date2) {
      return 1; // ctx1 should come after ctx2 (older date)
    }
    return 0; // Dates are equal
  });

  if (isLoading) return <SkeletonChatSelector />;
  if (isError) return <>Error Occured</>;
  return (
    <div className="flex flex-col  p-2 gap-4 ">
      {sortedContextWindowsData.map((ctx_win) => {
        const IsSelected = id === ctx_win.fileKey;

        return (
          <div
            className={` relative border-black border-[1px] rounded-lg py-3 ${
              IsSelected ? "bg-black" : ""
            }`}
          >
            <Link
              key={ctx_win.fileKey}
              to={`/chat/${ctx_win.fileKey}`}
              className={`hover:opacity-100  py-[8px]  ${
                IsSelected ? "  opacity-100 " : "opacity-75 "
              }`}
            >
              <div className="p-4 text-[#FAF7F5]  font-thin leading-3 flex-start small-regular rounded-xl">
                {ctx_win.fileName.slice(0, 40)}
                {ctx_win.fileName.length > 40 && "....."}
              </div>
            </Link>
            <ContextDeleteButton IsSelected={IsSelected} Id={String(ctx_win.Id)} />
          </div>
        );
      })}
      {sortedContextWindowsData.length === 0 && (
        <div className="text-[80px] p-4  font-sans font-thin flex flex-col">
          <span>ADD</span>
          <span>A</span>
          <span>FILE</span>
          <span>TO</span>
          <span>BEGIN</span>
        </div>
      )}
    </div>
  );
};

export default ChatSelector;
