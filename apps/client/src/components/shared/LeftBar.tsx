import ChatSelector from "./ChatSelector";
import FileUploader from "./FileUploader";
import SignOutButton from "./SignOutButton";
import SwitchButton from "./SwitchButton";

const LeftBar = () => {
  return (
    <div className="flex flex-col bg-[#524e4c] text-black h-screen p-2">
      <FileUploader />
      <ChatSelector />
      <div className="absolute bottom-0 flex-between w-full px-4 mb-2 bg-[#524e4c] ">
        <SignOutButton />
        <SwitchButton />
      </div>
    </div>
  );
};

export default LeftBar;
