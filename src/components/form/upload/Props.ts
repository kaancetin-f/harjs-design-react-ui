import { MimeTypes, UploadProgress, UploadRequestOption } from "../../../libs/infrastructure/types";
import { IColorProps, IDisabledProps, ISizeProps, IValidationProps } from "../../../libs/infrastructure/types/IGlobalProps";

export type ValidationError = { fileName: string; message: string };

interface IMultiple {
  files: File[];
  /**
   * `files` is the full selected list, including items that failed `allowedTypes` / `maxSize`.
   * `formData` and `base64` contain only valid files. `isInvalidFileExist` is true when at least one file failed validation.
   */
  onChange: (formData: FormData, files: File[], base64: string[], isInvalidFileExist: boolean) => void;
}

// interface ISingle {
//   file: File | undefined;
//   onChange: (formData: FormData | undefined, files: File | null, base64: string) => void;
//   multiple?: false;
// }

type Props = {
  text: string;
  allowedTypes?: MimeTypes[];
  maxSize?: number;
  type?: "list" | "grid" | "dropzone";
  direction?: "row" | "column";
  fullWidth?: boolean;
  multiple?: boolean;
  /**
   * Controlled per-file upload progress keyed by `File.name`.
   * Prefer this when the parent owns the HTTP request (XHR `upload.onprogress`).
   */
  progress?: UploadProgress;
  /**
   * Optional upload executor. When provided, Upload runs it for each valid file
   * and tracks progress internally. Controlled `progress` entries still take precedence.
   */
  onRequest?: (options: UploadRequestOption) => void | Promise<void>;
  config?: {
    locale?: Intl.LocalesArgument;
  };
} & IMultiple &
  ISizeProps &
  IColorProps &
  IValidationProps &
  IDisabledProps;

export default Props;
