import React, { useState } from "react";

interface FileInfo {
  name?: string;
  mime_type: string;
  reject_reason?: string;
  path?: string;
}

const serverAddress = "http://wanlok.ddns.net:3000";

export const Image = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [response, setResponse] = useState<FileInfo[]>([]);

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

      const data = (await res.json()) as FileInfo[];
      setResponse(data);
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
      <div>
        {response.length > 0 && (
          <a href={`${serverAddress}${response[0].path}`}>
            <img src={`${serverAddress}${response[0].path}`} />
          </a>
        )}
      </div>
    </div>
  );
};
