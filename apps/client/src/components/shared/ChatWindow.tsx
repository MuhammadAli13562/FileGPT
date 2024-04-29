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
        {message_array &&
          message_array.map((msg, index) => {
            return (
              <div
                key={msg.Id}
                id={String(index)}
                className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[35vw]  leading-[24px] message-card rounded-xl px-2 border-2  ${
                    msg.role === "user" ? "bg-blue-500 " : "bg-reg "
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
