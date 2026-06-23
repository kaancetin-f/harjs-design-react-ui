"use client";

import React, { useContext, useEffect, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/navigation/pagination/styles.css";
import { ConfigContext } from "../../../libs/core/application/contexts/Config";
import Select from "../../form/select";
import { Option } from "../../../libs/infrastructure/types";

const perPageOptions: Option[] = [
  { value: 5, text: "5" },
  { value: 10, text: "10" },
  { value: 15, text: "15" },
  { value: 50, text: "50" },
  { value: 75, text: "75" },
  { value: 100, text: "100" },
];

const Pagination: React.FC<IProps> = ({ currentPage, totalRecords, perPage, onChange }) => {
  // context
  const { config } = useContext(ConfigContext);

  // states
  const [pages, setPages] = useState<React.JSX.Element[]>([]);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [selectedPerPage, setSelectedPerPage] = useState<Option | undefined>(
    perPageOptions.find((x) => x.value === 10),
  );

  // methods
  const handlePageChange = (page: number, perPage: number) => onChange(page, perPage);

  // useEffects
  useEffect(() => {
    if (totalRecords === 0) return;

    const liItems = [];
    const _totalPageCount = Math.ceil(totalRecords / (perPage ?? config.perPage));
    setTotalPageCount(_totalPageCount);

    // currentPage prop'unu kullanın
    const activePage = currentPage || 1;

    // Başlangıç ve bitiş aralığını hesapla.
    const startPage = Math.max(1, activePage - 1);
    const endPage = Math.min(_totalPageCount, activePage + 1);

    // Sayfalama mantığı...
    for (let i = startPage; i <= endPage; i++) {
      liItems.push(
        <li
          key={i}
          className={i === activePage ? "selection-page" : ""}
          onClick={() => handlePageChange(i, selectedPerPage?.value as number)}
        >
          {i}
        </li>,
      );
    }

    setPages(liItems);
  }, [totalRecords, currentPage, perPage, config.perPage]);

  return (
    <div className="ar-pagination">
      <Select
        variant="borderless"
        value={selectedPerPage}
        options={[...perPageOptions, { value: totalRecords, text: "Tümü" }]}
        onChange={(option) => {
          setSelectedPerPage(option);
          handlePageChange(1, option?.value as number);
        }}
        config={{ clear: false }}
        style={{ width: 65 }}
        readOnly={true}
      />

      <ul>
        <li
          className={currentPage === 1 ? "passive" : ""}
          onClick={() => {
            if (currentPage === 1) return;
            handlePageChange(1, selectedPerPage?.value as number);
          }}
        >
          <span>{"«"}</span>
        </li>
        <li
          className={currentPage === 1 ? "passive" : ""}
          onClick={() => {
            if (currentPage === 1) return;
            handlePageChange(currentPage - 1, selectedPerPage?.value as number);
          }}
        >
          <span>{"‹"}</span>
        </li>

        {pages}

        <li
          className={totalPageCount === currentPage ? "passive" : ""}
          onClick={() => {
            if (totalPageCount === currentPage) return;
            handlePageChange(currentPage + 1, selectedPerPage?.value as number);
          }}
        >
          <span>{"›"}</span>
        </li>
        <li
          className={totalPageCount === currentPage ? "passive" : ""}
          onClick={() => {
            if (totalPageCount === currentPage) return;
            handlePageChange(totalPageCount, selectedPerPage?.value as number);
          }}
        >
          <span>{"»"}</span>
        </li>
      </ul>
    </div>
  );
};

Pagination.displayName = "Pagination";
export default Pagination;
