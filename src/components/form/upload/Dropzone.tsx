"use client";

import React, { memo, useEffect, useState } from "react";
import { ARIcon } from "../../icons";
import { ValidationError } from ".";
import { MimeTypes } from "../../../libs/infrastructure/types";
import Utils from "../../../libs/infrastructure/shared/Utils";
import Buttons from "./Buttons";

interface IProps {
  selectedFiles: File[]; // Tekli de olabilir çoklu da
  validationErrors?: ValidationError[];
  handleFileToBase64: (file: File) => Promise<string>;
  handleFileRemove: (fileToRemove: File) => void;
}

const Dropzone = ({ selectedFiles, validationErrors = [], handleFileToBase64, handleFileRemove }: IProps) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [selectedFileBase64, setSelectedFileBase64] = useState<string | undefined>(undefined);
  const [fileBase64Map, setFileBase64Map] = useState<Record<string, string>>({});

  // methods
  const handleSelectFile = async (file: File) => {
    setSelectedFile(file);
    setSelectedFileBase64(fileBase64Map[file.name]);
  };

  const renderFileCard = (file: File) => {
    const fileInfo = Utils.GetFileTypeInformation(file.type as MimeTypes);
    const message = validationErrors.find((v) => v.fileName === file.name)?.message;
    const base64 = fileBase64Map[file.name];

    return (
      <div
        key={file.name}
        className="item"
        style={{ backgroundColor: fileInfo.color }}
        onMouseEnter={(e) => {
          e.stopPropagation();

          handleSelectFile(file);
        }}
      >
        {message && (
          <div className="error">
            <ARIcon icon={"ExclamationDiamond-Fill"} fill="var(--white)" />
            <span>{message}</span>
          </div>
        )}

        <Buttons selectedFile={file} handleFileToBase64={handleFileToBase64} handleFileRemove={handleFileRemove} />

        {file.type.includes("image") ? (
          <img src={base64} />
        ) : (
          <ARIcon icon={fileInfo.icon ?? "Document"} fill="var(--white)" size={32} />
        )}
      </div>
    );
  };

  // useEffects
  useEffect(() => {
    (async () => {
      const base64s = await Promise.all(selectedFiles.map((f) => handleFileToBase64(f)));
      const newMap: Record<string, string> = selectedFiles.reduce(
        (acc, file, index) => {
          acc[file.name] = base64s[index];
          return acc;
        },
        {} as Record<string, string>,
      );

      setFileBase64Map(newMap);
      setSelectedFile(selectedFiles[0]);
      setSelectedFileBase64(newMap[selectedFiles[0]?.name]);
    })();
  }, [selectedFiles]);

  return selectedFile ? (
    <>
      <div className="preview">
        {selectedFile.type.includes("image") ? (
          <img src={selectedFileBase64} className="selected-image" />
        ) : (
          "Önizleme Yok."
        )}

        <Buttons
          selectedFile={selectedFile}
          handleFileToBase64={handleFileToBase64}
          handleFileRemove={handleFileRemove}
        />

        <div className="informations">
          <span className="file-name">{selectedFile.name}</span>

          <div>
            <span className="file-size">
              {(selectedFile.size / 1024).toFixed(3)}
              <span className="size-type">KB</span>
            </span>

            <span className="file-type">
              {Utils.GetFileTypeInformation(selectedFile.type as MimeTypes).readableType}
            </span>
          </div>
        </div>
      </div>

      {selectedFiles.length > 1 && <div className="items">{selectedFiles.map((file) => renderFileCard(file))}</div>}
    </>
  ) : null;
};

export default memo(Dropzone);
