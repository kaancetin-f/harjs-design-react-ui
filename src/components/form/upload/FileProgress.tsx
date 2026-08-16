"use client";

import React, { memo } from "react";
import useTranslation from "@harjs/translation/dist/libs/core/application/hooks/useTranslation";
import { Color, UploadFileStatus, UploadProgressItem } from "../../../libs/infrastructure/types";
import IUploadLocale from "../../../libs/core/application/locales/upload/IUploadLocale";
import UploadTR from "../../../libs/core/application/locales/upload/tr";
import UploadEN from "../../../libs/core/application/locales/upload/en";
import Progress from "../../feedback/progress";

interface IProps {
  progress?: UploadProgressItem;
  locale?: Intl.LocalesArgument;
}

const STATUS_KEY: Partial<Record<UploadFileStatus, keyof IUploadLocale>> = {
  uploading: "Upload.Progress.Uploading",
  success: "Upload.Progress.Success",
  error: "Upload.Progress.Error",
};

const PROGRESS_COLOR: Partial<Record<UploadFileStatus, Color>> = {
  uploading: "blue",
  success: "green",
  error: "red",
};

const FileProgress = ({ progress, locale }: IProps) => {
  // hooks
  const { t } = useTranslation<IUploadLocale>(String(locale ?? "tr"), {
    tr: { ...UploadTR },
    en: { ...UploadEN },
  });

  if (!progress) return null;

  // variables
  const status = progress.status ?? "uploading";
  const percent = Math.min(100, Math.max(0, Math.round(progress.percent)));
  const labelKey = STATUS_KEY[status];
  const progressColor = PROGRESS_COLOR[status];

  if (status === "ready" || !labelKey || !progressColor) return null;

  const label = t(labelKey, percent);

  return (
    <div className={`file-progress ${status}`}>
      <div className="file-progress-meta">
        <span className="label">{label}</span>
      </div>
      <Progress value={percent} color={progressColor} size="xs" />
    </div>
  );
};

export default memo(FileProgress);
