import { Dispatch, memo, SetStateAction, useState } from "react";
import { Actions } from "../IProps";
import React from "react";
import Grid from "../../grid-system";
import Popover from "../../../feedback/popover";
import Upload from "../../../form/upload";
import Tooltip from "../../../feedback/tooltip";
import Button from "../../../form/button";
import { ARIcon } from "../../../icons";

interface IProps {
  states: {
    createTrigger: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
  };
  actions: Actions;
}

const { Row, Column } = Grid;

const ActionButtons = ({ states, actions }: IProps) => {
  // states
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);
  const [base64, setBase64] = useState<string[]>([]);

  return (
    <div className="actions">
      {actions.import && (
        <Popover
          title={actions.import.title ?? "İçeri Aktar"}
          message={
            actions.import.message ??
            "Seçtiğiniz dosyaları uygulamaya yükleyebilirsiniz. Bu işlem, dosyalardaki verileri sistemimize aktarır ve verilerle işlem yapmanıza olanak tanır."
          }
          content={
            <>
              {actions.import.prefixItem && (
                <Row>
                  <Column size={12}>{actions.import.prefixItem}</Column>
                </Row>
              )}

              <Row>
                <Column size={12}>
                  <Upload
                    text={actions.import.buttonText ?? "Belge Yükleyin"}
                    allowedTypes={actions.import.allowedTypes}
                    files={files}
                    onChange={(formData, files, base64) => {
                      setFormData(formData);
                      setFiles(files);
                      setBase64(base64);
                    }}
                    size="small"
                    fullWidth
                  />
                </Column>
              </Row>

              {actions.import.suffixItem}
            </>
          }
          onConfirm={(confirm) => {
            if (!confirm) {
              setFiles([]);

              return;
            }

            if (actions.import && actions.import.onClick) actions.import.onClick(formData, files, base64);
          }}
          config={{ buttons: { okay: "Yükle", cancel: "İptal" } }}
          windowBlur
        >
          <Tooltip text={actions.import.tooltip}>
            <Button
              variant="outlined"
              color="purple"
              icon={{ element: <ARIcon icon="Upload" fill="currentcolor" /> }}
            />
          </Tooltip>
        </Popover>
      )}

      {actions.export && (
        <Popover
          title={actions.export.title ?? "Dışarı Aktar"}
          message={
            actions.export.message ??
            "Seçtiğiniz verileri bilgisayarınıza indirebilirsiniz. Bu işlem, sistemimizdeki verileri dosya olarak dışa aktarır ve verileri harici olarak kullanmanıza olanak tanır."
          }
          content={actions.export.content}
          onConfirm={(confirm) => {
            if (!confirm) {
              setFiles([]);

              return;
            }

            if (actions.export && actions.export.onClick) actions.export.onClick();
          }}
          config={{ buttons: { okay: "Dışarı Aktar", cancel: "İptal" } }}
          windowBlur
        >
          <Tooltip text={actions.export.tooltip}>
            <Button
              variant="outlined"
              color="blue"
              icon={{ element: <ARIcon icon="Download" fill="currentcolor" /> }}
            />
          </Tooltip>
        </Popover>
      )}

      {actions.create && (
        <Tooltip text={actions.create.tooltip}>
          <Button
            variant="outlined"
            color="green"
            icon={{ element: <ARIcon icon="Add" size={24} /> }}
            onClick={(event) => {
              if (!actions.create) return;

              actions.create.onClick(event);
              states.createTrigger.set((prev) => !prev);
            }}
          />
        </Tooltip>
      )}

      {actions.delete && (
        <Popover
          title={actions.delete.title ?? "Siliniyor"}
          message={
            actions.delete.message ??
            "Seçtiğiniz verileri uygulamadan silebilirsiniz. Bu işlem, verilerin sistemimizden tamamen kaldırılmasını sağlar ve bu verilerle artık işlem yapılamaz."
          }
          onConfirm={(confirm) => {
            if (!confirm) return;

            if (actions.delete && actions.delete.onClick) actions.delete.onClick();
          }}
        >
          <Tooltip text={actions.delete.tooltip}>
            <Button
              variant="outlined"
              color="red"
              icon={{ element: <ARIcon icon="Trash-Fill" fill="currentcolor" /> }}
            />
          </Tooltip>
        </Popover>
      )}
    </div>
  );
};

export default memo(ActionButtons);
