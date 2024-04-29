import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { StreamQuery } from "src/query";
import { sendMessage } from "src/redux/recipies/resetStore";
import { SelectContextWindowById } from "src/redux/selector";
import { useAppDispatch, useTypedSelector } from "src/redux/store";

function MessageEditor() {
  const { id } = useParams();
  const [value, setValue] = useState("");
  const ContextWindow = useTypedSelector((state) => SelectContextWindowById(state, id || ""));
  const dispatch = useAppDispatch();
  const handleChange = (event: any) => {
    setValue(event.target.value);
    adjustTextareaHeight(event.target);
  };

  const adjustTextareaHeight = (element: any) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleSendMessage = async () => {
    const newmsg = value;
    setValue("");
    if (!ContextWindow?.Id) return;
    try {
      dispatch(sendMessage({ id: ContextWindow.Id, message: newmsg }));
      await StreamQuery({ id: ContextWindow.Id, message: newmsg }, dispatch);
    } catch (error: any) {
      toast.error(`Error : ${error.message} `, {
        position: "top-center",
      });
    }
  };

  return (
    <div className=" flex justify-center items-end pb-8 absolute bottom-0 w-full bg-white pt-2">
      <textarea
        placeholder="Ask any question"
        value={value}
        onChange={handleChange}
        className=" outline-blue-400  pr-12 w-[90%] border border-gray-300 rounded p-2 resize-none overflow-hidden"
        style={{ height: "42px" }}
        rows={1}
      />
      <button
        onClick={handleSendMessage}
        className=" -ml-10 flex items-center justify-center bg-primary text-white rounded p-2 focus:outline-none focus:ring-2 "
        style={{ width: "40px", height: "40px" }}
      >
        <svg
          className="w-6 h-6 transform -rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default MessageEditor;
