import { Dispatch, memo, SetStateAction, useState } from "react";
import { Actions } from "../IProps";
import React from "react";
import GridSystem from "../../../layout/grid-system";
import Popover from "../../../feedback/popover";
import Upload from "../../../form/upload";
import Tooltip from "../../../feedback/tooltip";
import Button from "../../../form/button";
import { Icon } from "../../../icons";
import Flex from "../../../layout/grid-system/flex/Flex";
import { useTranslation } from "@harjs/translation";
import ITableLocale from "../../../../libs/core/application/locales/table/ITableLocale";
import TableTR from "../../../../libs/core/application/locales/table/tr";
import TableEN from "../../../../libs/core/application/locales/table/en";

interface IProps {
  states: {
    createTrigger: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
  };
  actions: Actions;
  locale?: Intl.LocalesArgument;
}

const icons = {
  import: <Icon icon="Import" size={24} />,
  export: <Icon icon="Export" size={24} />,
  create: <Icon icon="Add" size={16} />,
};

const { Row, Column } = GridSystem;

const ActionButtons = ({ states, actions, locale }: IProps) => {
  // states
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);
  const [base64, setBase64] = useState<string[]>([]);

  // hooks
  const { t } = useTranslation<ITableLocale>(String(locale ?? "tr"), {
    tr: { ...TableTR },
    en: { ...TableEN },
  });

  return (
    <Flex flexDirection="row" justifyContent="flex-end" alignItems="center" gap="var(--space-8)">
      {actions.import && (
        <Popover
          title={actions.import.title ?? t("Table.Actions.Import.Title")}
          message={actions.import.message ?? t("Table.Actions.Import.Message")}
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
                    text={actions.import.buttonText ?? t("Table.Actions.Import.Upload")}
                    allowedTypes={actions.import.allowedTypes}
                    files={files}
                    onChange={(formData, files, base64) => {
                      setFormData(formData);
                      setFiles(files);
                      setBase64(base64);
                    }}

                    fullWidth
                  />
                </Column>
              </Row>

              {actions.import.suffixItem}
            </>
          }
          onConfirm={(confirm) => {
            // İptalde seçilen dosyaları sıfırla.
            if (!confirm) {
              setFiles([]);

              return;
            }

            if (actions.import && actions.import.onClick) actions.import.onClick(formData, files, base64);
          }}
          config={{ buttons: { okay: t("Table.Actions.Import.Confirm"), cancel: t("Table.Actions.Cancel") } }}
          windowBlur
        >
          <Tooltip text={actions.import.tooltip}>
            <Button variant="outlined" color="purple" shape="square" icon={{ element: icons.import }} />
          </Tooltip>
        </Popover>
      )}

      {actions.export && (
        <Popover
          title={actions.export.title ?? t("Table.Actions.Export.Title")}
          message={actions.export.message ?? t("Table.Actions.Export.Message")}
          content={actions.export.content}
          onConfirm={(confirm) => {
            if (!confirm) {
              setFiles([]);

              return;
            }

            if (actions.export && actions.export.onClick) actions.export.onClick();
          }}
          config={{ buttons: { okay: t("Table.Actions.Export.Confirm"), cancel: t("Table.Actions.Cancel") } }}
          windowBlur
        >
          <Tooltip text={actions.export.tooltip}>
            <Button variant="outlined" color="blue" shape="square" icon={{ element: icons.export }} />
          </Tooltip>
        </Popover>
      )}

      {actions.create && (
        <Tooltip text={actions.create.tooltip}>
          <Button
            variant="outlined"
            color="green"
            shape="square"
            icon={{ element: icons.create }}
            onClick={(event) => {
              if (!actions.create) return;

              actions.create.onClick(event);
              // Tablo yeni satır açsın diye create tetikleyicisini çevir.
              states.createTrigger.set((prev) => !prev);
            }}
          />
        </Tooltip>
      )}

      {actions.delete && (
        <Popover
          title={actions.delete.title ?? t("Table.Actions.Delete.Title")}
          message={actions.delete.message ?? t("Table.Actions.Delete.Message")}
          onConfirm={(confirm) => {
            if (!confirm) return;

            if (actions.delete && actions.delete.onClick) actions.delete.onClick();
          }}
          config={{ buttons: { okay: t("Table.Actions.Delete.Confirm"), cancel: t("Table.Actions.Cancel") } }}
        >
          <Tooltip text={actions.delete.tooltip}>
            <Button
              variant="outlined"
              color="red"
              shape="square"
              icon={{ element: <Icon icon="Trash-Fill" fill="currentColor" /> }}
            />
          </Tooltip>
        </Popover>
      )}
    </Flex>
  );
};

export default memo(ActionButtons);
