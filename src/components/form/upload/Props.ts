import { MimeTypes } from "../../../libs/infrastructure/types";
import { IDisabledProps, ISizeProps, IValidationProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IMultiple {
  files: File[];
  onChange: (formData: FormData, files: File[], base64: string[], isInvalidFileExist: boolean) => void;
  // multiple: true;
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
} & IMultiple &
  ISizeProps &
  IValidationProps &
  IDisabledProps;

export default Props;
