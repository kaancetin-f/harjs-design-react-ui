import React, { memo } from "react";
import Button from "../button";
import Flex from "../../layout/grid-system/flex/Flex";
import { openFilePreview } from "./helpers";
import { Icon } from "../../icons";

interface IProps {
  selectedFile: File;
  handleFileRemove: (fileToRemove: File) => void;
}

const Buttons = ({ selectedFile, handleFileRemove }: IProps) => {
  return (
    <div className="buttons">
      <Flex flexDirection="row" justifyContent="center" alignItems="center" gap="var(--space-4)">
        <Button
          variant="borderless"
          color="purple"
          type="button"
          shape="square"
          icon={{
            element: <Icon icon="Download" size={24} />,
          }}
          onClick={(e) => {
            e.stopPropagation();

            // Seçili dosyayı tarayıcı üzerinden indir.
            const url = window.URL.createObjectURL(selectedFile);
            const a = document.createElement("a");

            a.href = url;
            a.download = selectedFile.name;
            a.click();

            window.URL.revokeObjectURL(url);
          }}
        />

        <Button
          variant="borderless"
          color="blue"
          type="button"
          shape="square"
          aria-label={`Preview ${selectedFile.name}`}
          icon={{
            element: <Icon icon="Eye-Fill" size={24} />,
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Dosyayı yeni pencerede önizle.
            openFilePreview(selectedFile);
          }}
        />

        <Button
          variant="borderless"
          color="red"
          type="button"
          shape="square"
          icon={{
            element: <Icon icon="Trash-Fill" size={24} />,
          }}
          onClick={(e) => {
            e.stopPropagation();

            // Dosyayı listeden kaldır.
            handleFileRemove(selectedFile);
          }}
        />
      </Flex>
    </div>
  );
};

Buttons.displayName = "Buttons";

export default memo(Buttons);
