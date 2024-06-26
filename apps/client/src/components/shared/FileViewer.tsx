import { useParams } from "react-router-dom";
import { useFetchMetaDataQuery } from "src/redux/api/user";
import { SelectMetaContextWindowById } from "src/redux/selector";
import { useTypedSelector } from "src/redux/store";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { RotateLoader } from "react-spinners";
import { useEffect } from "react";

const FileViewer = () => {
  const { id } = useParams();
  const { isLoading, isError } = useFetchMetaDataQuery();
  const ContextWindow = useTypedSelector((state) => SelectMetaContextWindowById(state, id!));
  const fileUrl = ContextWindow?.fileURL!;
  const docs = [{ uri: fileUrl }];

  useEffect(() => {
    console.log("rerend");
  }, [docs]);

  if (isLoading)
    return (
      <div className="h-full w-full col-center">
        <RotateLoader color="black" />
      </div>
    );
  if (isError) return <>Error</>;

  const FileViewerConfig = {
    header: {
      disableHeader: false,
      disableFileName: true,
      retainURLParams: false,
    },
    csvDelimiter: ",", // "," as default,
    pdfZoom: {
      defaultZoom: 1.1, // 1 as default,
      zoomJump: 0.1, // 0.1 as default,
    },
    pdfVerticalScrollByDefault: true, // false as default
  };

  return (
    <div className=" h-screen relative ">
      <DocViewer
        documents={docs}
        config={FileViewerConfig}
        pluginRenderers={DocViewerRenderers}
        style={{ minHeight: "100vh", minWidth: "40vw", padding: "20px" }}
      />
      <div className="absolute top-0 w-full h-16 bg-white border-2 border-gray-300 shadow-lg flex-center z-50">
        <span className="text-xl font-bold"> {ContextWindow?.fileName}</span>
      </div>
    </div>
  );
};

export default FileViewer;
