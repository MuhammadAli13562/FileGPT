import { Link, useParams } from "react-router-dom";
import { useFetchDataFixedCache } from "src/redux/api/user";
import { SelectContextWindowMeta } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";

const ChatSelector = () => {
  const { id } = useParams();
  const { isLoading, isError } = useFetchDataFixedCache();
  const ContextWindowsData = useTypedSelector(SelectContextWindowMeta);

  if (isLoading) return <>Loading....</>;
  if (isError) return <>Error Occured</>;
  return (
    <div className="flex flex-col gap-4 p-2">
      {ContextWindowsData.map((ctx_win, index) => {
        return (
          <Link
            key={ctx_win.fileKey}
            to={`/chat/${ctx_win.fileKey}`}
            className={`hover:opacity-100   rounded-lg  ${
              id === ctx_win.fileKey ? " bg-primary opacity-100" : "opacity-75"
            }`}
          >
            <div className=" text-secondary p-4  font-thin leading-3 flex-start small-regular rounded-xl">
              {ctx_win.fileName}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ChatSelector;
