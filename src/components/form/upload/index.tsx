"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Props from "./Props";
import "../../../assets/css/components/form/upload/styles.css";
import { MimeTypes } from "../../../libs/infrastructure/types";
import { ARIcon } from "../../icons";
import Dropzone from "./Dropzone";
import Button from "../button";
import List from "./List";
import Utils from "../../../libs/infrastructure/shared/Utils";

export type ValidationError = { fileName: string; message: string };

const Upload: React.FC<Props> = ({
  text,
  files,
  onChange,
  allowedTypes,
  maxSize,
  type = "list",
  direction = "column",
  size,
  fullWidth,
  multiple,
}) => {
  // refs
  const _input = useRef<HTMLInputElement>(null);
  const _arUplaod = useRef<HTMLDivElement>(null);
  // refs -> File Data
  const _validationErrors = useRef<string[]>([]);

  // variables
  const [className, setClassName] = useState<string[]>(["button"]);

  // states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // methods
  const handleFileChange = useCallback(
    (files: FileList | null) => {
      const _files = Array.from(files ?? []);

      setSelectedFiles((prev) => {
        if (!multiple) return _files;

        const previousFileNames = prev.map((f) => f.name);
        const newFiles = _files.filter((f) => !previousFileNames.includes(f.name)) ?? [];

        return [...prev, ...newFiles];
      });
    },
    [multiple],
  );

  const handleFileRemove = useCallback((fileToRemove: File) => {
    setSelectedFiles((prev) => {
      const newList = prev.filter((x) => x.name !== fileToRemove.name);

      if (newList.length === 0) setClassName((prev) => prev.filter((c) => c !== "has-file"));

      return newList;
    });
  }, []);

  const validateFile = useCallback(
    (file: File) => {
      const newErrors: ValidationError[] = [];

      if (allowedTypes) {
        if (!allowedTypes.includes(file.type as MimeTypes)) {
          newErrors.push({ fileName: file.name, message: "Geçersiz dosya türü." });
          _validationErrors.current.push(file.name);
        }
      }

      if (maxSize) {
        const _maxSize = maxSize * 1024 * 1024; // MB

        if (file.size > _maxSize) {
          newErrors.push({ fileName: file.name, message: "Dosya boyutu çok büyük." });
          _validationErrors.current.push(file.name);
        }
      }

      setValidationErrors((prev) => [...prev, ...newErrors]);
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setClassName((prev) => {
        const index = prev.findIndex((c) => c === "dragging");

        if (index === -1) return [...prev, "dragging"];

        return prev;
      });
    } else {
      setClassName((prev) => prev.filter((c) => c !== "dragging"));
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files && files.length > 0) handleFileChange(files);

      setClassName((prev) => prev.filter((c) => c !== "dragging"));
    },
    [handleFileChange],
  );

  const renderUploadFile = (params: { children: React.ReactNode }) => {
    return (
      <div ref={_arUplaod} className="ar-upload">
        <input
          ref={_input}
          type="file"
          onChange={(event) => handleFileChange(event.target.files)}
          multiple={multiple}
        />

        {params.children}
      </div>
    );
  };

  // useEffects
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const dataTransfer = new DataTransfer();
      const fileFormData = new FormData();

      setValidationErrors([]);
      _validationErrors.current = [];

      if (_input.current) {
        if (selectedFiles.length === 0) {
          if (_input.current) _input.current.files = dataTransfer.files;
          onChange(fileFormData, [], [], false);

          return;
        }

        // Seçilmiş olan dosyalar validasyona gönderiliyor.
        selectedFiles.forEach((f) => validateFile(f));
        const inValidFiles = Array.from(new Set(_validationErrors.current));
        // Input içerisine dosyalar aktarılıyor.
        selectedFiles.forEach((f) => dataTransfer.items.add(f));
        _input.current.files = dataTransfer.files;

        // Geçerli olan dosyalar alındı...
        const validFiles = [...selectedFiles.filter((x) => !inValidFiles.includes(x.name))];
        validFiles.forEach((f) => fileFormData.append("file", f));

        // Geçerli olan dosyalar base64'e dönüştürülüyor...
        const base64Array = await Promise.all(validFiles.map((validFile) => handleFileToBase64(validFile)));

        if (isMounted) {
          onChange(fileFormData, validFiles, base64Array, _validationErrors.current.length === 0);
        }

        // Eğer dosya varsa.
        setClassName((prev) => {
          const index = prev.findIndex((c) => c === "has-file");

          if (index === -1) return [...prev, "has-file"];

          return prev;
        });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (Utils.DeepEqual(files, selectedFiles)) return;

    setSelectedFiles(files);
  }, [files]);

  useEffect(() => {
    if (type === "dropzone") setClassName((prev) => [...prev, "dropzone"]);
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
              color="gray"
              icon={{ element: <ARIcon icon="CloudUpload-Fill" /> }}
              onClick={() => {
                if (_input.current) _input.current.click();
              }}
              fullWidth={fullWidth}
              size={size}
            >
              {text && <span>{text}</span>}
            </Button>

            <List
              type={type}
              direction={direction}
              selectedFiles={selectedFiles ?? []}
              validationErrors={validationErrors}
              handleFileToBase64={handleFileToBase64}
              handleFileRemove={handleFileRemove}
            />
          </>
        ),
      });
    case "dropzone":
      return renderUploadFile({
        children: (
          <div className="ar-upload-button">
            <div
              className={className.map((c) => c).join(" ")}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => {
                if (_input.current) _input.current.click();
              }}
            >
              <Dropzone
                selectedFiles={selectedFiles ?? []}
                validationErrors={validationErrors}
                handleFileToBase64={handleFileToBase64}
                handleFileRemove={handleFileRemove}
              />

              {selectedFiles && selectedFiles.length === 0 && (
                <>
                  <div className="upload">
                    <ARIcon icon="CloudUpload-Fill" size={32} />

                    <div className="properies">
                      {allowedTypes && (
                        <div className="allow-types">
                          {allowedTypes?.map((allowedType) => allowedType.split("/")[1].toLocaleUpperCase()).join(", ")}
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

export default Upload;
