import ChatSelector from "./ChatSelector";
import FileUploader from "./FileUploader";

const LeftBar = () => {
  return (
    <div className="flex flex-col bg-[#001529] h-screen">
      <FileUploader />
      <ChatSelector />
    </div>
  );
};

export default LeftBar;
