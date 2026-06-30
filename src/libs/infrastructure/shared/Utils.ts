import { Border, Color, FileCategory, Icon, Icons, MimeTypes, Sizes, Status, Variants } from "../types";

class Utils {
  public GetClassName = (
    variant?: Variants,
    status?: Status,
    color?: Color,
    border?: Border,
    size?: Sizes,
    icon?: Icon,
    className?: string,
  ) => {
    const classNames: string[] = [];

    if (variant) classNames.push(variant);
    if (status) classNames.push(status);
    if (color) classNames.push(color);
    if (border) classNames.push(`radius-${border.radius}`);
    if (size) classNames.push(size);
    if (icon && icon.element) {
      classNames.push("icon");
      classNames.push(`icon-${icon.position || "start"}`);
    }

    if (className) classNames.push(className);

    return classNames;
  };

  public GetCookie = (name: string) => {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop()?.split(";").shift();

    return null;
  };

  public GetOS = () => {
    const userAgent = navigator.userAgent;

    // İşletim sistemi bilgilerini tespit etmek için regex kullanıyoruz
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("X11") !== -1) return "UNIX";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (userAgent.indexOf("Android") !== -1) return "Android";
    if (userAgent.indexOf("like Mac") !== -1) return "iOS";

    return "Bilinmeyen OS";
  };

  public GetOSShortCutIcons = () => {
    switch (this.GetOS()) {
      case "MacOS":
        return "⌘";
      case "Windows":
        return "ctrl";
      default:
        return "";
    }
  };

  public GetFileTypeInformation = (mimeType: MimeTypes) => {
    const typeMap: Record<
      MimeTypes,
      {
        category: FileCategory;
        readableType: string;
        commonExtensions: string[];
        icon?: Icons;
        color?: string;
      }
    > = {
      // Images
      "image/jpeg": {
        category: "image",
        readableType: "JPEG Image",
        commonExtensions: [".jpg", ".jpeg"],
        color: "#4CAF50",
      },
      "image/png": {
        category: "image",
        readableType: "PNG Image",
        commonExtensions: [".png"],
        color: "#4CAF50",
      },
      "image/gif": {
        category: "image",
        readableType: "GIF Image",
        commonExtensions: [".gif"],
        color: "#4CAF50",
      },
      "image/webp": {
        category: "image",
        readableType: "WebP Image",
        commonExtensions: [".webp"],
        color: "#4CAF50",
      },
      "image/svg+xml": {
        category: "image",
        readableType: "SVG Vector Image",
        commonExtensions: [".svg"],
        color: "#4CAF50",
      },
      "image/bmp": {
        category: "image",
        readableType: "Bitmap Image",
        commonExtensions: [".bmp"],
        color: "#4CAF50",
      },
      "image/tiff": {
        category: "image",
        readableType: "TIFF Image",
        commonExtensions: [".tiff", ".tif"],
        color: "#4CAF50",
      },

      // Documents
      "application/pdf": {
        category: "document",
        readableType: "PDF Document",
        commonExtensions: [".pdf"],
        icon: "FileTypePdf",
        color: "#F44336",
      },
      "application/msword": {
        category: "document",
        readableType: "Word Document (Legacy)",
        commonExtensions: [".doc"],
        icon: "FileTypeDoc",
        color: "#2196F3",
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        category: "document",
        readableType: "Word Document",
        commonExtensions: [".docx"],
        icon: "FileTypeDocx",
        color: "#2196F3",
      },

      // Spreadsheets
      "application/vnd.ms-excel": {
        category: "spreadsheet",
        readableType: "Excel Spreadsheet (Legacy)",
        commonExtensions: [".xls"],
        icon: "FileTypeXls",
        color: "#4CAF50",
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        category: "spreadsheet",
        readableType: "Excel Spreadsheet",
        commonExtensions: [".xlsx"],
        icon: "FileTypeXlsx",
        color: "#4CAF50",
      },
      "text/csv": {
        category: "spreadsheet",
        readableType: "CSV File",
        commonExtensions: [".csv"],
        icon: "FileTypeCsv",
        color: "#FF9800",
      },

      // Presentations
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        category: "presentation",
        readableType: "PowerPoint Presentation",
        commonExtensions: [".pptx"],
        icon: "FileTypePptx",
        color: "#FF5722",
      },

      // Archives
      "application/zip": {
        category: "archive",
        readableType: "ZIP Archive",
        commonExtensions: [".zip"],
        icon: "FileTypeZip",
        color: "#795548",
      },
      "application/x-rar-compressed": {
        category: "archive",
        readableType: "RAR Archive",
        commonExtensions: [".rar"],
        icon: "FileTypeZip",
        color: "#795548",
      },
      "application/x-7z-compressed": {
        category: "archive",
        readableType: "7-Zip Archive",
        commonExtensions: [".7z"],
        icon: "FileTypeZip",
        color: "#795548",
      },
      "application/gzip": {
        category: "archive",
        readableType: "GZIP Archive",
        commonExtensions: [".gz"],
        icon: "FileTypeZip",
        color: "#795548",
      },

      // Text & Code
      "text/plain": {
        category: "text",
        readableType: "Text File",
        commonExtensions: [".txt"],
        icon: "FileTypeTxt",
        color: "#9E9E9E",
      },
      "text/html": {
        category: "text",
        readableType: "HTML Document",
        commonExtensions: [".html", ".htm"],
        icon: "FileTypeHtml",
        color: "#E91E63",
      },
      "application/json": {
        category: "json",
        readableType: "JSON File",
        commonExtensions: [".json"],
        icon: "FileTypeJson",
        color: "#FFC107",
      },
      "application/xml": {
        category: "xml",
        readableType: "XML File",
        commonExtensions: [".xml"],
        icon: "FileTypeXml",
        color: "#FFC107",
      },

      // Video
      "video/mp4": {
        category: "video",
        readableType: "MP4 Video",
        commonExtensions: [".mp4"],
        icon: "CameraReels",
        color: "#673AB7",
      },
      "video/quicktime": {
        category: "video",
        readableType: "QuickTime Video",
        commonExtensions: [".mov"],
        icon: "CameraReels",
        color: "#673AB7",
      },
      "video/x-msvideo": {
        category: "video",
        readableType: "AVI Video",
        commonExtensions: [".avi"],
        icon: "CameraReels",
        color: "#673AB7",
      },
      "video/x-matroska": {
        category: "video",
        readableType: "MKV Video",
        commonExtensions: [".mkv"],
        icon: "CameraReels",
        color: "#673AB7",
      },
      "video/webm": {
        category: "video",
        readableType: "WebM Video",
        commonExtensions: [".webm"],
        icon: "CameraReels",
        color: "#673AB7",
      },
      "video/x-flv": {
        category: "video",
        readableType: "FLV Video",
        commonExtensions: [".flv"],
        icon: "CameraReels",
        color: "#673AB7",
      },

      // Audio
      "audio/mpeg": {
        category: "audio",
        readableType: "MP3 Audio",
        commonExtensions: [".mp3"],
        icon: "CameraReels",
        color: "#3F51B5",
      },
      "audio/wav": {
        category: "audio",
        readableType: "WAV Audio",
        commonExtensions: [".wav"],
        icon: "CameraReels",
        color: "#3F51B5",
      },
      "audio/ogg": {
        category: "audio",
        readableType: "OGG Audio",
        commonExtensions: [".ogg"],
        icon: "CameraReels",
        color: "#3F51B5",
      },
      "audio/aac": {
        category: "audio",
        readableType: "AAC Audio",
        commonExtensions: [".aac"],
        icon: "CameraReels",
        color: "#3F51B5",
      },
      "audio/flac": {
        category: "audio",
        readableType: "FLAC Audio",
        commonExtensions: [".flac"],
        icon: "CameraReels",
        color: "#3F51B5",
      },

      // Binary/Other
      "application/octet-stream": {
        category: "binary",
        readableType: "Binary File",
        commonExtensions: [],
        icon: "FileEarmark-Fill",
        color: "#607D8B",
      },
    };

    return (
      typeMap[mimeType] || {
        category: "other",
        readableType: "Unknown File Type",
        commonExtensions: [],
        icon: "FileEarmark-Fill",
        color: "#9E9E9E",
      }
    );
  };

  public StringFormat = (value: string, ...args: any[]): string => {
    if (!args || args.length === 0) return value;

    return value.replace(/{(\d+)}/g, (match: string, number: string) => {
      const index = parseInt(number, 10);
      return typeof args[index] !== "undefined" ? args[index] : match;
    });
  };

  public IsNullOrEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (typeof value === "object" && value !== null && Object.keys(value).length === 0) return true;
    if (Array.isArray(value) && value.length === 0) return true;

    return false;
  };

  public DeepEqual = (obj1: any, obj2: any): boolean => {
    if (Object.is(obj1, obj2)) return true; // Aynı referanssa true döndür

    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
      return false; // Eğer biri obje değilse ve eşit değilse false
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false; // Farklı uzunlukta anahtar varsa false

    return keys1.every((key) => this.DeepEqual(obj1[key], obj2[key])); // Rekürsif karşılaştırma
  };

  public RandomCharacterGenerator = (length: number) => {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let sonuc = "";

    for (let i = 0; i < length; i++) {
      sonuc += characters[Math.floor(Math.random() * characters.length)];
    }

    return sonuc;
  };
}

export default new Utils();
