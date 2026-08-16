import React, { memo } from "react";
import { ValidationError } from "./Props";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { MimeTypes, UploadProgress } from "../../../libs/infrastructure/types";
import Buttons from "./Buttons";
import FileProgress from "./FileProgress";
import { FileIcon, WarningDiamondIcon } from "./FileIcon";
import { formatFileSize } from "./helpers";

interface IProps {
  type: "list" | "grid";
  direction?: "row" | "column";
  selectedFiles: File[];
  validationErrors?: ValidationError[];
  progress?: UploadProgress;
  locale?: Intl.LocalesArgument;
  handleFileRemove: (fileToRemove: File) => void;
}

const List = ({
  type,
  direction = "column",
  selectedFiles,
  validationErrors = [],
  progress,
  locale,
  handleFileRemove,
}: IProps) => {
  return (
    <ul className={`${type} ${direction}`}>
      {selectedFiles.map((selectedFile) => {
        // variables
        const message = validationErrors.find((v) => v.fileName === selectedFile.name)?.message;
        const fileProgress = progress?.[selectedFile.name];
        const fileSize = formatFileSize(selectedFile.size);
        const fileInfo = Utils.GetFileTypeInformation(selectedFile.type as MimeTypes);
        const status = fileProgress?.status;

        return (
          <li
            key={selectedFile.name}
            className={[
              status === "uploading" ? "is-uploading" : undefined,
              status === "success" ? "is-success" : undefined,
              status === "error" || message ? "is-error" : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="file-thumb" style={{ backgroundColor: fileInfo.color }}>
              <FileIcon mimeType={selectedFile.type as MimeTypes} fill="var(--white-alpha-100)" size={18} />
            </div>

            <div className="file-body">
              <span className="file-name" title={selectedFile.name}>
                {selectedFile.name}
              </span>

              <div className="file-meta">
                <span className="file-size">
                  {fileSize.value} {fileSize.unit}
                </span>
                <span className="file-meta-sep" aria-hidden="true">
                  ·
                </span>
                <span className="file-type">{fileInfo.readableType}</span>
              </div>

              {message && (
                <div className="error">
                  <WarningDiamondIcon fill="var(--red-500)" size={14} />
                  <span>{message}</span>
                </div>
              )}

              <FileProgress progress={fileProgress} locale={locale} />
            </div>

            <Buttons selectedFile={selectedFile} handleFileRemove={handleFileRemove} />
          </li>
        );
      })}
    </ul>
  );
};

List.displayName = "List";

export default memo(List);
