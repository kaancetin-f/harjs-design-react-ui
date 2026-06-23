import React, { memo } from "react";
import { ARIcon } from "../../icons";
import Button from "../button";

interface IProps {
  selectedFile: File;
  handleFileToBase64: (file: File) => Promise<string>;
  handleFileRemove: (fileToRemove: File) => void;
}

const Buttons = ({ selectedFile, handleFileToBase64, handleFileRemove }: IProps) => {
  return (
    <div className="buttons">
      <div>
        <Button
          variant="borderless"
          color="purple"
          type="button"
          icon={{ element: <ARIcon icon={"Download"} fill="currentColor" /> }}
          onClick={(e) => {
            e.stopPropagation();

            const url = window.URL.createObjectURL(selectedFile);
            const a = document.createElement("a");

            a.href = url;
            a.download = selectedFile.name;
            a.click();

            window.URL.revokeObjectURL(url);
          }}
        />

        {selectedFile.type.includes("image") && (
          <Button
            variant="borderless"
            color="blue"
            type="button"
            icon={{ element: <ARIcon icon={"Eye-Fill"} fill="currentColor" /> }}
            onClick={async (e) => {
              e.stopPropagation();

              const base64 = await handleFileToBase64(selectedFile);
              const newTab = window.open();

              newTab?.document.write(`<img src="${base64}" title="${selectedFile.name}" alt="${selectedFile.name}" />`);
            }}
          />
        )}

        <Button
          variant="borderless"
          color="red"
          type="button"
          icon={{ element: <ARIcon icon={"Trash-Fill"} fill="currentColor" /> }}
          onClick={(e) => {
            e.stopPropagation();

            handleFileRemove(selectedFile);
          }}
        />
      </div>
    </div>
  );
};

export default memo(Buttons);
