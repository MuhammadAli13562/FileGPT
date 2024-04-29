import ChatSelector from "./ChatSelector";
import FileUploader from "./FileUploader";
import SignOutButton from "./SignOutButton";

const LeftBar = () => {
  return (
    <div className="flex flex-col bg-[#524e4c] text-black h-screen">
      <FileUploader />
      <ChatSelector />
      <div className="absolute bottom-0 flex-between w-full px-4 mb-2">
        <SignOutButton />
      </div>
    </div>
  );
};

export default LeftBar;
