import ChatSelector from "src/components/shared/ChatSelector";
import ChatWindow from "src/components/shared/ChatWindow";
import FileViewer from "src/components/shared/FileViewer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "src/components/ui/resizable";
import { ScrollArea } from "src/components/ui/scroll-area";

const ContextWindow = () => {
  return (
    <ResizablePanelGroup direction="horizontal" className="border ">
      <ResizablePanel defaultSize={20} className=" h-screen">
        <ScrollArea>
          <ChatSelector />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <FileViewer />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ChatWindow />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ContextWindow;
