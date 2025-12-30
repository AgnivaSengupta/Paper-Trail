import axios from "axios";
import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";
export const uploadImageToR2 = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  signal?: AbortSignal
): Promise<string> => {
  try {
    const { data } = await axiosInstance.get(API_PATHS.UPLOAD.GET_URL, {
      params: {
        fileName: file.name,
        fileType: file.type,
      },
      signal,
    });

    const { uploadUrl, key, publicUrl } = data;

    console.log("Public URL: ", publicUrl);
    
    // uploadingt to R2
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      signal,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress({ progress: percent });
        }
      },
    });
    
    //const publicUrl = `${process.env.R2_DEVURL}/${key}`
    
    return publicUrl;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error("Upload cancelled");
    }
    console.error("Upload failed:", error);
    throw error;
  }
};
