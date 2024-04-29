import { Link, useParams } from "react-router-dom";
import { useFetchDataFixedCache } from "src/redux/api/user";
import { SelectAllContextWindows } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";

const ChatSelector = () => {
  const { id } = useParams();
  const { isLoading, isError } = useFetchDataFixedCache();
  const ContextWindowsData = useTypedSelector(SelectAllContextWindows);
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

  if (isLoading) return <>Loading....</>;
  if (isError) return <>Error Occured</>;
  return (
    <div className="flex flex-col  p-2 gap-4">
      {sortedContextWindowsData.map((ctx_win) => {
        return (
          <Link
            key={ctx_win.fileKey}
            to={`/chat/${ctx_win.fileKey}`}
            className={`hover:opacity-100 border-y-[1px] rounded-lg py-[8px] border-black  ${
              id === ctx_win.fileKey ? " bg-primary opacity-100 " : "opacity-75 "
            }`}
          >
            <div className="p-4 text-[#FAF7F5]  font-thin leading-3 flex-start small-regular rounded-xl">
              {ctx_win.fileName.slice(0, 40)}
              {ctx_win.fileName.length > 40 && "....."}
            </div>
          </Link>
        );
      })}
      {sortedContextWindowsData.length === 0 && (
        <div className="text-[80px] p-4  font-bold font-sans flex flex-col">
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
