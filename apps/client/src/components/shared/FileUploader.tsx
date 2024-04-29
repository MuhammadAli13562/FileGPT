import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fixedCacheKey } from "src/constants";
import { useUploadDocumentMutation } from "src/redux/api/user";
import { toast } from "react-toastify";

const FileUploader = () => {
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadDocumentMutation(fixedCacheKey);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    try {
      console.log("accepted files : ", acceptedFiles);

      const form = new FormData();
      const file = acceptedFiles[0];
      console.log("accepted files 2: ", file);

      form.append("file", file);
      await uploadFile(form).unwrap();
    } catch (error: any) {
      console.log("error here : ", error);

      toast.error(`Error : ${error}!`, {
        position: "top-center",
      });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className=" h-[5rem] border-dotted p-4 border-2 cursor-pointer mb-4 mx-4 mt-2 rounded-lg bg-gray-700 text-gray-300">
      {!isUploadingFile ? (
        <div {...getRootProps()} className="flex-center">
          <input {...getInputProps()} />
          <div>
            <p>+ Add Chat</p>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p className="text-gray-400">Drop PDF here</p>
            )}
          </div>
        </div>
      ) : (
        <div>Processing.....</div>
      )}
    </div>
  );
};

export default FileUploader;
