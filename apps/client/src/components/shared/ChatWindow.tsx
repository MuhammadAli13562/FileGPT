import { useParams } from "react-router-dom";
import { useFetchDataFixedCache } from "src/redux/api/user";
import { SelectContextWindowById } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";
import { useEffect, useRef } from "react";
import MessageEditor from "./MessageEditor";
import ChatTopBar from "./ChatTopBar";
import Markdown from "./Markdown";
import transformText from "src/lib/transformText";

const ChatWindow = () => {
  const { id } = useParams();
  const { isLoading, isError } = useFetchDataFixedCache();
  const ContextWindow = useTypedSelector((state) => SelectContextWindowById(state, id || ""));
  const messagesRef = useRef<HTMLDivElement>(null);

  const message_array = ContextWindow?.ChatWindowMessages;
  let msg_arr = message_array
    ? [...message_array].sort((a, b) => {
        const createdAtComparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (createdAtComparison === 0) {
          // If 'created at' is equal, compare by 'Id'
          return a.Id - b.Id;
        }
        return createdAtComparison;
      })
    : [];

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [ContextWindow]);

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <div className="relative h-screen ">
      <ChatTopBar />
      <div
        ref={messagesRef}
        className="px-10 w-full flex flex-col gap-4 h-[90vh] overflow-y-auto  pt-24"
      >
        {msg_arr &&
          msg_arr.map((msg, index) => {
            return (
              <div
                key={msg.Id}
                id={String(index)}
                className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[35vw]  leading-[24px] message-card rounded-xl px-2 border-2  ${
                    msg.role === "user" ? "bg-primary " : "bg-reg "
                  }`}
                >
                  <div className="prose text-[14px] -my-3">
                    <Markdown content={transformText(msg.content)} role={msg.role} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <MessageEditor />
    </div>
  );
};

export default ChatWindow;
