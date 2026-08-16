"use client";

import React, { memo, useEffect, useState } from "react";
import { ValidationError } from "./Props";
import { MimeTypes, UploadProgress } from "../../../libs/infrastructure/types";
import Utils from "../../../libs/infrastructure/shared/Utils";
import Buttons from "./Buttons";
import FileProgress from "./FileProgress";
import { FileIcon, WarningDiamondIcon } from "./FileIcon";
import { formatFileSize } from "./helpers";
import Button from "../button";
import { Icon } from "../../icons";

interface IProps {
  selectedFiles: File[]; // Tekli de olabilir çoklu da
  validationErrors?: ValidationError[];
  progress?: UploadProgress;
  locale?: Intl.LocalesArgument;
  handleFileToBase64: (file: File) => Promise<string>;
  handleFileRemove: (fileToRemove: File) => void;
}

const Dropzone = ({ selectedFiles, validationErrors = [], progress, locale, handleFileToBase64, handleFileRemove }: IProps) => {
  // states
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [selectedFileBase64, setSelectedFileBase64] = useState<string | undefined>(undefined);
  const [fileBase64Map, setFileBase64Map] = useState<Record<string, string>>({});

  // methods
  const handleSelectFile = (file: File) => {
    setSelectedFile(file);
    setSelectedFileBase64(fileBase64Map[file.name]);
  };

  const renderFileCard = (file: File) => {
    const fileInfo = Utils.GetFileTypeInformation(file.type as MimeTypes);
    const message = validationErrors.find((v) => v.fileName === file.name)?.message;
    const base64 = fileBase64Map[file.name];
    const fileProgress = progress?.[file.name];
    const fileSize = formatFileSize(file.size);
    const isSelected = selectedFile?.name === file.name;
    const isImage = file.type.includes("image");

    return (
      <div
        key={file.name}
        role="option"
        tabIndex={0}
        aria-selected={isSelected}
        className={[
          "item",
          isSelected ? "is-selected" : undefined,
          fileProgress?.status === "uploading" ? "is-uploading" : undefined,
          fileProgress?.status === "success" ? "is-success" : undefined,
          fileProgress?.status === "error" || message ? "is-error" : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={(event) => {
          event.stopPropagation();
          handleSelectFile(file);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          event.stopPropagation();
          handleSelectFile(file);
        }}
      >
        <div className="thumb" style={!isImage ? { backgroundColor: fileInfo.color } : undefined}>
          {isImage ? (
            <img src={base64} alt="" />
          ) : (
            <FileIcon mimeType={file.type as MimeTypes} fill="var(--white-alpha-100)" size={18} />
          )}

          {message && (
            <div className="error" title={message}>
              <WarningDiamondIcon fill="var(--white-alpha-100)" size={12} />
            </div>
          )}
        </div>

        <div className="item-copy">
          <span className="item-name" title={file.name}>
            {file.name}
          </span>
          <span className="item-meta">
            {fileSize.value} {fileSize.unit}
          </span>
        </div>

        <Button
          variant="borderless"
          color="red"
          aria-label={`Remove ${file.name}`}
          size="xs"
          shape="square"
          icon={{
            element: <Icon icon="Trash-Fill" size={16} />,
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleFileRemove(file);
          }}
        />
      </div>
    );
  };

  // useEffects
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const base64s = await Promise.all(selectedFiles.map((f) => handleFileToBase64(f)));

      if (cancelled) return;

      const newMap: Record<string, string> = selectedFiles.reduce(
        (acc, file, index) => {
          acc[file.name] = base64s[index];
          return acc;
        },
        {} as Record<string, string>,
      );

      setFileBase64Map(newMap);
      setSelectedFile((current) => selectedFiles.find((file) => file.name === current?.name) ?? selectedFiles[0]);
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFileBase64(undefined);
      return;
    }

    setSelectedFileBase64(fileBase64Map[selectedFile.name]);
  }, [selectedFile, fileBase64Map]);

  const previewSize = selectedFile ? formatFileSize(selectedFile.size) : null;
  const previewInfo = selectedFile ? Utils.GetFileTypeInformation(selectedFile.type as MimeTypes) : null;
  const selectedIndex = selectedFile ? selectedFiles.findIndex((file) => file.name === selectedFile.name) : -1;

  return selectedFile ? (
    <>
      <div
        className={`preview${progress?.[selectedFile.name]?.status === "uploading" ? " is-uploading" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        {selectedFile.type.includes("image") ? (
          <img src={selectedFileBase64} className="selected-image" alt={selectedFile.name} />
        ) : (
          <div className="preview-fallback">
            <span className="preview-fallback-icon" style={{ backgroundColor: previewInfo?.color }}>
              <FileIcon mimeType={selectedFile.type as MimeTypes} fill="var(--white-alpha-100)" size={28} />
            </span>
            <span>No preview</span>
          </div>
        )}

        <Buttons selectedFile={selectedFile} handleFileRemove={handleFileRemove} />

        <div className="informations">
          <div className="file-copy">
            <span className="file-name" title={selectedFile.name}>
              {selectedFile.name}
            </span>

            <div className="file-meta">
              <span className="file-size">
                {previewSize?.value} {previewSize?.unit}
              </span>
              <span className="file-meta-sep" aria-hidden="true">
                ·
              </span>
              <span className="file-type">{previewInfo?.readableType}</span>
              {selectedFiles.length > 1 && selectedIndex >= 0 && (
                <>
                  <span className="file-meta-sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="file-index">
                    {selectedIndex + 1} / {selectedFiles.length}
                  </span>
                </>
              )}
            </div>
          </div>

          <FileProgress progress={progress?.[selectedFile.name]} locale={locale} />
        </div>
      </div>

      {selectedFiles.length > 1 && (
        <div className="items" role="listbox" aria-label="Selected files" onClick={(event) => event.stopPropagation()}>
          <div className="items-header">{selectedFiles.length} files</div>
          {selectedFiles.map((file) => renderFileCard(file))}
        </div>
      )}
    </>
  ) : null;
};

export default memo(Dropzone);
