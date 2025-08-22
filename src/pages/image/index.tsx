import React, { useState } from "react";
import { FileInfo, useImage } from "./useImage";
import { Box, Link, Stack } from "@mui/material";

const serverAddress = "https://wanlok.ddns.net:3000";

export const Image = () => {
  const [files, setFiles] = useState<File[]>([]);

  const { imageDocument, addFileInfoList } = useImage();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      const res = await fetch(`${serverAddress}/upload`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const fileInfoList = (await res.json()) as FileInfo[];

      addFileInfoList(fileInfoList);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <div>
        <input type="file" multiple name="files" accept="image/*" onChange={onChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap" }}>
        {imageDocument?.fileInfoList.map((fileInfo) => (
          <Link sx={{ flex: "0 0 20%", aspectRatio: "1/1" }} href={`${serverAddress}${fileInfo.path}`} target="_blank">
            <Box
              component="img"
              src={`${serverAddress}${fileInfo.path}`}
              alt=""
              sx={{
                display: "block",
                objectFit: "cover",
                width: "100%",
                height: "100%"
              }}
            />
          </Link>
        ))}
      </Stack>
    </div>
  );
};
