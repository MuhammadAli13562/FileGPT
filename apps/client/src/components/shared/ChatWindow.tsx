import { useParams } from "react-router-dom";
import { useFetchContextDataQuery } from "src/redux/api/user";
import { SelectContextWindowById } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";
import { useEffect, useRef, useState } from "react";
import MessageEditor from "./MessageEditor";
import ChatTopBar from "./ChatTopBar";
import Markdown from "./Markdown";
import transformText from "src/lib/transformText";
import { BeatLoader, RotateLoader } from "react-spinners";
import { useVerificationOnMount } from "src/hooks/useVerificationOnMount";

const ChatWindow = () => {
  useVerificationOnMount();
  const { id } = useParams();
  const [isQuerying, setIsQuerying] = useState(false);
  const { isLoading, isError } = useFetchContextDataQuery(id || "");
  const ContextWindow = useTypedSelector((state) => SelectContextWindowById(state, id || ""));
  const messagesRef = useRef<HTMLDivElement>(null);

  const message_array = ContextWindow?.ChatWindowMessages;
  let msg_arr = message_array
    ? [...message_array].sort((a, b) => {
        const createdAtComparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (createdAtComparison === 0) {
          // If 'created at' is equal, compare by 'Id'
          return a.Id - b.Id;
        }
        return createdAtComparison;
      })
    : [];

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [ContextWindow, isLoading]);

  if (isLoading)
    return (
      <div className="h-full w-full col-center">
        <RotateLoader color="black" />
      </div>
    );
  if (isError) return <>Error</>;

  return (
    <div className="relative h-screen ">
      <ChatTopBar />
      <div ref={messagesRef} className="px-10 w-full flex flex-col gap-4 h-[90vh] overflow-y-auto  pt-24">
        {msg_arr &&
          msg_arr.map((msg, index) => {
            return (
              <div key={msg.Id} id={String(index)} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[35vw]  leading-[24px] message-card rounded-xl px-2 border-2  ${msg.role === "user" ? "bg-primary " : "bg-reg "}`}
                >
                  <div className="prose text-[14px] -my-3">
                    <Markdown content={transformText(msg.content)} role={msg.role} />
                  </div>
                </div>
              </div>
            );
          })}
        {msg_arr.length === 0 && <div className="flex-center w-full opacity-55 font-sans text-6xl h-full">Ask a question</div>}
        {isQuerying && <BeatLoader color="black" className=" scale-75" />}
      </div>

      <MessageEditor isQuerying={isQuerying} setIsQuerying={setIsQuerying} />
    </div>
  );
};

export default ChatWindow;
