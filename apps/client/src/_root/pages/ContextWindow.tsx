import ChatWindow from "src/components/shared/ChatWindow";
import FileViewer from "src/components/shared/FileViewer";
import LeftBar from "src/components/shared/LeftBar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "src/components/ui/resizable";
import { ScrollArea } from "src/components/ui/scroll-area";

const ContextWindow = () => {
  return (
    <ResizablePanelGroup direction="horizontal" className=" ">
      <ResizablePanel defaultSize={18} className=" h-screen">
        <ScrollArea>
          <LeftBar />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <FileViewer />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={42} className=" border-l-4">
        <ChatWindow />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ContextWindow;
