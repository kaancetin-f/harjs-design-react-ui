import React, { memo } from "react";
import { ValidationError } from ".";
import { ARIcon } from "../../icons";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { MimeTypes } from "../../../libs/infrastructure/types";
import Buttons from "./Buttons";

interface IProps {
  type: "list" | "grid";
  direction?: "row" | "column";
  selectedFiles: File[]; // Tekli de olabilir çoklu da
  validationErrors?: ValidationError[];
  handleFileToBase64: (file: File) => Promise<string>;
  handleFileRemove: (fileToRemove: File) => void;
}

const List = ({
  type,
  direction = "row",
  selectedFiles,
  validationErrors = [],
  handleFileToBase64,
  handleFileRemove,
}: IProps) => {
  return (
    <ul className={`${type} ${direction}`}>
      {selectedFiles.map((selectedFile) => {
        const message = validationErrors.find((v) => v.fileName === selectedFile.name)?.message;

        return (
          <li key={selectedFile.name}>
            {message && (
              <div className="error">
                <ARIcon icon={"ExclamationDiamond-Fill"} fill="var(--white)" />
                <span>{message}</span>
              </div>
            )}

            <Buttons
              selectedFile={selectedFile}
              handleFileToBase64={handleFileToBase64}
              handleFileRemove={handleFileRemove}
            />

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
          </li>
        );
      })}
    </ul>
  );
};

export default memo(List);
