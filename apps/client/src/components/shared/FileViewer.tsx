import { useParams } from "react-router-dom";
import { useFetchDataFixedCache } from "src/redux/api/user";
import { SelectContextWindowById } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { ScrollArea } from "../ui/scroll-area";

const FileViewer = () => {
  const { id } = useParams();
  const { isLoading, isError } = useFetchDataFixedCache();
  const ContextWindow = useTypedSelector((state) => SelectContextWindowById(state, id || ""));

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  const docs = [
    { uri: "" }, // Remote file
  ];
  return (
    <ScrollArea className=" h-screen">
      {
        <DocViewer
          documents={docs}
          config={FileViewerConfig}
          pluginRenderers={DocViewerRenderers}
          style={{ minHeight: "100vh", minWidth: "40vw", padding: "20px" }}
        />
      }
    </ScrollArea>
  );
};

export default FileViewer;

const FileViewerConfig = {
  header: {
    disableHeader: false,
    disableFileName: false,
    retainURLParams: false,
  },
  csvDelimiter: ",", // "," as default,
  pdfZoom: {
    defaultZoom: 1, // 1 as default,
    zoomJump: 0.1, // 0.1 as default,
  },
  pdfVerticalScrollByDefault: true, // false as default
};
