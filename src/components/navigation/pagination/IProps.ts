interface IProps {
  defaultCurrent?: number;
  currentPage: number;
  totalRecords: number;
  perPage?: number;
  onChange: (currentPage: number, perPage: number) => void;
}

export default IProps;
