import { useParams } from "react-router-dom";
import ChatWindow from "src/components/shared/ChatWindow";
import FileViewer from "src/components/shared/FileViewer";
import LeftBar from "src/components/shared/LeftBar";
import Overlay from "src/components/shared/Overlay";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "src/components/ui/resizable";
import { ScrollArea } from "src/components/ui/scroll-area";

const ContextWindow = () => {
  const { id } = useParams();

  return (
    <div className="relative">
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel defaultSize={20} className=" h-screen min-w-56 ">
          <ScrollArea>
            <LeftBar />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        {id === "default" ? (
          <ResizablePanel>
            <Overlay />
          </ResizablePanel>
        ) : (
          <>
            <ResizablePanel>
              <FileViewer />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={42} className=" border-l-4">
              <ChatWindow />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      {}
    </div>
  );
};

export default ContextWindow;
