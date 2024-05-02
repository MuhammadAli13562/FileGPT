import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fixedCacheKey } from "src/constants";
import { UserApi, useUploadDocumentMutation } from "src/redux/api/user";
import { toast } from "react-toastify";
import { ContextDataType } from "@backend/prisma/selections";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/redux/store";
import { BarLoader } from "react-spinners";

const FileUploader = () => {
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadDocumentMutation(fixedCacheKey);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onDrop = useCallback(async (acceptedFiles: any) => {
    try {
      const form = new FormData();
      const file = acceptedFiles[0];

      form.append("file", file);
      const res: ContextDataType = await uploadFile(form).unwrap();
      dispatch(UserApi.util.invalidateTags(["META"]));
      navigate(`/chat/${res.fileKey}`);
    } catch (error: any) {
      toast.error(`Error : ${error.message || "Upload Failed"}!`, {
        position: "top-center",
      });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className=" relative min-h-[5rem]  p-4 border-2 border-black  mb-4 mx-4 mt-2 rounded-lg bg-[#363535] text-white">
      {!isUploadingFile ? (
        <div {...getRootProps()} className="flex-center cursor-pointer text-[17px]">
          <input className=" " {...getInputProps()} />
          <div className="flex flex-col items-center ">
            <p className="font-bold">+ Add Chat</p>
            {isDragActive ? (
              <p className=" ">Drop the files here ...</p>
            ) : (
              <p className="text-gray-400 leading-[25px]">Drop pdf , image or excel here</p>
            )}
          </div>
        </div>
      ) : (
        <div className="col-center gap-2 font-bold text-gray-300 h-full text-lg">
          Processing
          <span>
            <BarLoader color="black" />
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
