import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fixedCacheKey } from "src/constants";
import { useUploadDocumentMutation } from "src/redux/api/user";
import { toast } from "react-toastify";
import { ContextDataType } from "@backend/prisma/selections";
import { useNavigate } from "react-router-dom";

const FileUploader = () => {
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadDocumentMutation(fixedCacheKey);
  const navigate = useNavigate();
  const onDrop = useCallback(async (acceptedFiles: any) => {
    try {
      console.log("accepted files : ", acceptedFiles);

      const form = new FormData();
      const file = acceptedFiles[0];
      console.log("accepted files 2: ", file);

      form.append("file", file);
      const res: ContextDataType = await uploadFile(form).unwrap();
      navigate(`/chat/${res.fileKey}`);
      console.log("check resp : ", res);
    } catch (error: any) {
      console.log("error here : ", error);

      toast.error(`Error : ${error.message || "Upload Failed"}!`, {
        position: "top-center",
      });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className=" h-[5rem] border-dotted p-4 border-2 border-gray-500 cursor-pointer mb-4 mx-4 mt-2 rounded-lg bg-[#363535] text-white">
      {!isUploadingFile ? (
        <div {...getRootProps()} className="flex-center">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <p>+ Add Chat</p>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p className="text-gray-200">Drop pdf , image or excel here</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-center">Processing.....</div>
      )}
    </div>
  );
};

export default FileUploader;
