export interface Task {
  id: string | number;
  name: string;
  start: string;
  end: string;
}

export type Config = {
  locale?: Intl.LocalesArgument;
  isServerSide?: boolean;
  isSearchable?: boolean;
};

interface IProps {
  title?: string;
  description?: string;
  data: Task[];
  pagination?: {
    totalRecords: number;
    perPage: number;
    currentPage?: number;
    onChange?: (currentPage: number, perPage: number) => void;
  };
  config?: Config;
}

export default IProps;
