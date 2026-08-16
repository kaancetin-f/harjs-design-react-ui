"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Props, { ValidationError } from "./Props";
import "../../../assets/css/components/form/upload/styles.css";
import { MimeTypes, UploadProgress } from "../../../libs/infrastructure/types";
import Dropzone from "./Dropzone";
import Button from "../button";
import List from "./List";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { areSameFiles } from "./helpers";
import UploadIcon from "./UploadIcon";

const Upload: React.FC<Props> = ({
  text,
  files,
  onChange,
  allowedTypes,
  maxSize,
  type = "list",
  direction,
  size,
  color = "blue",
  fullWidth,
  multiple,
  progress: controlledProgress,
  onRequest,
  disabled,
  validation,
  config,
}) => {
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const requestedFiles = useRef<Set<string>>(new Set());

  // states
  const [className, setClassName] = useState<string[]>(["button"]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>(files);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [internalProgress, setInternalProgress] = useState<UploadProgress>({});

  // variables
  const progress: UploadProgress = { ...internalProgress, ...controlledProgress };
  const triggerColor = !Utils.IsNullOrEmpty(validation?.text) ? "red" : color;
  const resolvedDirection = direction ?? (type === "grid" ? "row" : "column");

  // methods
  const openFilePicker = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleFileChange = useCallback(
    (nextFiles: FileList | null) => {
      const incoming = Array.from(nextFiles ?? []);

      setSelectedFiles((prev) => {
        if (!multiple) return incoming;

        const previousFileNames = prev.map((file) => file.name);
        const uniqueIncoming = incoming.filter((file) => !previousFileNames.includes(file.name));

        return [...prev, ...uniqueIncoming];
      });

      if (inputRef.current) inputRef.current.value = "";
    },
    [multiple],
  );

  const handleFileRemove = useCallback((fileToRemove: File) => {
    requestedFiles.current.delete(fileToRemove.name);

    setInternalProgress((prev) => {
      const next = { ...prev };
      delete next[fileToRemove.name];
      return next;
    });

    setSelectedFiles((prev) => {
      const next = prev.filter((file) => file.name !== fileToRemove.name);

      if (next.length === 0) setClassName((classes) => classes.filter((item) => item !== "has-file"));

      return next;
    });
  }, []);

  const collectValidationErrors = useCallback(
    (nextFiles: File[]) => {
      const errors: ValidationError[] = [];
      const invalidNames: string[] = [];

      nextFiles.forEach((file) => {
        if (allowedTypes && !allowedTypes.includes(file.type as MimeTypes)) {
          errors.push({ fileName: file.name, message: "Invalid file type." });
          invalidNames.push(file.name);
        }

        if (maxSize && file.size > maxSize * 1024 * 1024) {
          errors.push({ fileName: file.name, message: "File is too large." });
          invalidNames.push(file.name);
        }
      });

      return { errors, invalidNames: Array.from(new Set(invalidNames)) };
    },
    [allowedTypes, maxSize],
  );

  const handleFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read the file"));
        }
      };
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }, []);

  const runCustomRequest = useCallback(
    (file: File) => {
      if (!onRequest || requestedFiles.current.has(file.name)) return;

      requestedFiles.current.add(file.name);

      setInternalProgress((prev) => ({
        ...prev,
        [file.name]: { percent: 0, status: "uploading" },
      }));

      const settle = (updater: (prev: UploadProgress) => UploadProgress) => {
        setInternalProgress(updater);
      };

      void Promise.resolve(
        onRequest({
          file,
          onProgress: (percent) => {
            settle((prev) => ({
              ...prev,
              [file.name]: {
                percent: Math.min(100, Math.max(0, percent)),
                status: "uploading",
              },
            }));
          },
          onSuccess: () => {
            settle((prev) => ({
              ...prev,
              [file.name]: { percent: 100, status: "success" },
            }));
          },
          onError: () => {
            settle((prev) => ({
              ...prev,
              [file.name]: {
                percent: prev[file.name]?.percent ?? 0,
                status: "error",
              },
            }));
          },
        }),
      ).catch(() => {
        settle((prev) => ({
          ...prev,
          [file.name]: {
            percent: prev[file.name]?.percent ?? 0,
            status: "error",
          },
        }));
      });
    },
    [onRequest],
  );

  const handleDrag = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;

      if (event.type === "dragenter" || event.type === "dragover") {
        setClassName((prev) => (prev.includes("dragging") ? prev : [...prev, "dragging"]));
      } else {
        setClassName((prev) => prev.filter((item) => item !== "dragging"));
      }
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;

      const dropped = event.dataTransfer.files;
      if (dropped && dropped.length > 0) handleFileChange(dropped);

      setClassName((prev) => prev.filter((item) => item !== "dragging"));
    },
    [disabled, handleFileChange],
  );

  const renderUploadFile = (params: { children: React.ReactNode }) => {
    const classes = ["har-upload", triggerColor];

    if (disabled) classes.push("disabled");
    if (!Utils.IsNullOrEmpty(validation?.text)) classes.push("invalid");

    return (
      <div ref={uploadRef} className={classes.filter(Boolean).join(" ")}>
        <input
          ref={inputRef}
          type="file"
          accept={allowedTypes?.join(",")}
          onChange={(event) => handleFileChange(event.target.files)}
          multiple={multiple}
          disabled={disabled}
        />

        {params.children}

        {validation?.text && <span className="har-validation-text">{validation.text}</span>}
      </div>
    );
  };

  // useEffects
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const dataTransfer = new DataTransfer();
      const fileFormData = new FormData();
      const { errors, invalidNames } = collectValidationErrors(selectedFiles);

      setValidationErrors(errors);

      if (!inputRef.current) return;

      if (selectedFiles.length === 0) {
        inputRef.current.files = dataTransfer.files;
        onChange(fileFormData, [], [], false);
        setInternalProgress({});
        requestedFiles.current.clear();
        return;
      }

      selectedFiles.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;

      const validFiles = selectedFiles.filter((file) => !invalidNames.includes(file.name));
      validFiles.forEach((file) => fileFormData.append("file", file));

      const base64Array = await Promise.all(validFiles.map((file) => handleFileToBase64(file)));

      if (!isMounted) return;

      onChange(fileFormData, selectedFiles, base64Array, invalidNames.length > 0);

      if (onRequest) validFiles.forEach((file) => runCustomRequest(file));

      setClassName((prev) => (prev.includes("has-file") ? prev : [...prev, "has-file"]));
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (areSameFiles(files, selectedFiles)) return;
    setSelectedFiles(files);
  }, [files]);

  useEffect(() => {
    if (type === "dropzone") {
      setClassName((prev) => (prev.includes("dropzone") ? prev : [...prev, "dropzone"]));
    }
  }, [type]);

  switch (type) {
    case "list":
    case "grid":
      return renderUploadFile({
        children: (
          <>
            <Button
              type="button"
              variant="outlined"
              color={triggerColor}
              icon={{ element: <UploadIcon fill="currentColor" /> }}
              onClick={openFilePicker}
              fullWidth={fullWidth}
              size={size}
              disabled={disabled}
            >
              {text && <span>{text}</span>}
            </Button>

            {selectedFiles.length > 0 && (
              <List
                type={type}
                direction={resolvedDirection}
                selectedFiles={selectedFiles}
                validationErrors={validationErrors}
                progress={progress}
                locale={config?.locale}
                handleFileRemove={handleFileRemove}
              />
            )}
          </>
        ),
      });
    case "dropzone":
      return renderUploadFile({
        children: (
          <div className="har-upload-button">
            <div
              className={className.join(" ")}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFilePicker}
            >
              <Dropzone
                selectedFiles={selectedFiles}
                validationErrors={validationErrors}
                progress={progress}
                locale={config?.locale}
                handleFileToBase64={handleFileToBase64}
                handleFileRemove={handleFileRemove}
              />

              {selectedFiles.length === 0 && (
                <>
                  <div className="upload">
                    <UploadIcon size={32} />

                    <div className="properies">
                      {allowedTypes && (
                        <div className="allow-types">
                          {allowedTypes.map((allowedType) => allowedType.split("/")[1].toLocaleUpperCase()).join(", ")}
                        </div>
                      )}

                      {maxSize && <div className="max-size">up to {maxSize}MB</div>}
                    </div>
                  </div>

                  {text && <span>{text}</span>}
                </>
              )}
            </div>
          </div>
        ),
      });
    default:
      return null;
  }
};

Upload.displayName = "Upload";

export type { ValidationError } from "./Props";
export default Upload;
