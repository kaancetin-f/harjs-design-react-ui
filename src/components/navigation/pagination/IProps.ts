interface IProps {
  defaultCurrent?: number;
  currentPage: number;
  totalRecords: number;
  perPage?: number;
  locale?: Intl.LocalesArgument;
  showTotal?: boolean;
  showQuickJumper?: boolean;
  loading?: boolean;
  onChange: (currentPage: number, perPage: number) => void;
}

export default IProps;
