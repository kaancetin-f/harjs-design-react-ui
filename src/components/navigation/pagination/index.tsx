"use client";

import React, { useContext, useEffect, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/navigation/pagination/styles.css";
import { ConfigContext } from "../../../libs/core/application/contexts/Config";
import Select from "../../form/select";
import Button from "../../form/button";
import Input from "../../form/input";
import { Icon } from "../../icons";
import { Icons, Option } from "../../../libs/infrastructure/types";
import { useTranslation } from "@harjs/translation";
import IPaginationLocale from "../../../libs/core/application/locales/pagination/IPaginationLocale";
import PaginationTR from "../../../libs/core/application/locales/pagination/tr";
import PaginationEN from "../../../libs/core/application/locales/pagination/en";
import {
  getPaginationRange,
  getRecordRange,
  optionFor,
  parsePageJump,
  PER_PAGE_OPTIONS,
} from "./helpers";

const PagerButton = ({
  kind,
  label,
  disabled,
  loading,
  icon,
  onClick,
}: {
  kind: string;
  label: string;
  disabled: boolean;
  loading: boolean;
  icon: Icons;
  onClick: () => void;
}) => (
  <li className={[kind, disabled ? "passive" : undefined].filter(Boolean).join(" ")}>
    <Button
      variant="borderless"
      color="gray"
      size="sm"
      shape="square"
      disabled={disabled || loading}
      aria-label={label}
      aria-disabled={disabled || loading}
      onClick={onClick}
      icon={{
        element: <Icon icon={icon} size={14} fill="currentColor" />,
      }}
    />
  </li>
);

const Pagination: React.FC<IProps> = ({
  currentPage,
  totalRecords,
  perPage,
  locale,
  showTotal = true,
  showQuickJumper = false,
  loading = false,
  onChange,
}) => {
  // refs
  const _navClassName: string[] = ["ar-pagination", loading ? "is-loading" : undefined].filter(
    Boolean,
  ) as string[];

  // hooks
  const { config } = useContext(ConfigContext);
  const { t } = useTranslation<IPaginationLocale>(String(locale ?? "tr"), {
    tr: { ...PaginationTR },
    en: { ...PaginationEN },
  });

  // variables
  const resolvedPerPage = perPage ?? config.perPage;
  const allLabel = t("Pagination.PerPage.All");

  // states
  const [selectedPerPage, setSelectedPerPage] = useState<Option>(() =>
    optionFor(resolvedPerPage, allLabel, totalRecords),
  );

  // useEffects
  useEffect(() => {
    const next = perPage ?? config.perPage;
    setSelectedPerPage((prev) =>
      // Aynı değerse identity koru, gereksiz render etme...
      prev?.value === next ? prev : optionFor(next, allLabel, totalRecords),
    );
  }, [allLabel, config.perPage, perPage, totalRecords]);

  // variables
  const pageSize = Number(selectedPerPage?.value) || resolvedPerPage;
  const totalPageCount =
    totalRecords === 0 ? 0 : Math.ceil(totalRecords / pageSize);
  const activePage =
    totalPageCount === 0
      ? 1
      : Math.min(Math.max(currentPage || 1, 1), totalPageCount);
  const isFirst = totalPageCount <= 1 || activePage <= 1;
  const isLast = totalPageCount <= 1 || activePage >= totalPageCount;
  const showPager = totalPageCount > 1;
  const range = getPaginationRange(activePage, totalPageCount);
  const records = getRecordRange(activePage, pageSize, totalRecords);

  // states
  const [jumpValue, setJumpValue] = useState(String(activePage));

  // useEffects
  useEffect(() => {
    setJumpValue(String(activePage));
  }, [activePage]);

  // methods
  const goTo = (page: number) => {
    // Loading veya geçersiz sayfada işlem yapmasına izin verme...
    if (loading) return;
    if (totalPageCount === 0) return;
    if (page < 1 || page > totalPageCount) return;
    onChange(page, pageSize);
  };

  const submitJump = () => {
    const next = parsePageJump(jumpValue, totalPageCount);
    if (next == null) {
      setJumpValue(String(activePage));
      return;
    }
    goTo(next);
  };

  const onPagerKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (!(event.target instanceof HTMLButtonElement)) return;
    event.preventDefault();
    goTo(event.key === "ArrowLeft" ? activePage - 1 : activePage + 1);
  };

  return (
    <nav className={_navClassName.map((c) => c).join(" ")} aria-label={t("Pagination.Label")} aria-busy={loading}>
      <div className="meta">
        <label className="page-size">
          <span className="page-size-label">{t("Pagination.PerPage")}</span>
          <Select
            variant="borderless"
            value={selectedPerPage}
            options={[
              ...PER_PAGE_OPTIONS,
              { value: totalRecords, text: allLabel },
            ]}
            onChange={(option) => {
              if (!option || loading) return;
              setSelectedPerPage(option);
              onChange(1, option.value as number);
            }}
            config={{ clear: false }}
            readOnly={true}
            disabled={loading}
          />
        </label>

        {showTotal && (
          <span className="total">
            {totalRecords === 0
              ? t("Pagination.NoResults")
              : t(
                  "Pagination.Total",
                  records.start,
                  records.end,
                  totalRecords,
                )}
          </span>
        )}
      </div>

      {showPager && (
        <ul onKeyDown={onPagerKeyDown}>
          <PagerButton
            kind="first"
            label={t("Pagination.First")}
            disabled={isFirst}
            loading={loading}
            icon="CaretDoubleLeft"
            onClick={() => goTo(1)}
          />
          <PagerButton
            kind="previous"
            label={t("Pagination.Previous")}
            disabled={isFirst}
            loading={loading}
            icon="CaretLeft"
            onClick={() => goTo(activePage - 1)}
          />

          {range.map((token, index) => {
            if (token === "ellipsis") {
              const kind =
                range[index - 1] === 1 ? "start-ellipsis" : "end-ellipsis";
              return (
                <li key={`${kind}-${index}`} className={kind} aria-hidden="true">
                  <span>…</span>
                </li>
              );
            }

            const current = token === activePage;
            return (
              <li
                key={token}
                className={["page-number", current ? "selection-page" : undefined]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Button
                  variant={current ? "filled" : "borderless"}
                  color={current ? "blue" : "gray"}
                  size="sm"
                  disabled={loading}
                  aria-label={
                    current
                      ? t("Pagination.Page.Current", token)
                      : t("Pagination.Page", token)
                  }
                  aria-current={current ? "page" : undefined}
                  onClick={() => goTo(token)}
                >
                  {String(token)}
                </Button>
              </li>
            );
          })}

          <li className="page-status" aria-hidden="true">
            <span>
              {activePage} / {totalPageCount}
            </span>
          </li>

          <PagerButton
            kind="next"
            label={t("Pagination.Next")}
            disabled={isLast}
            loading={loading}
            icon="CaretRight"
            onClick={() => goTo(activePage + 1)}
          />
          <PagerButton
            kind="last"
            label={t("Pagination.Last")}
            disabled={isLast}
            loading={loading}
            icon="CaretDoubleRight"
            onClick={() => goTo(totalPageCount)}
          />
        </ul>
      )}

      {showQuickJumper && showPager && (
        <div className="quick-jumper">
          <span className="quick-jumper-label">{t("Pagination.GoTo")}</span>
          <Input
            variant="outlined"
            color="gray"
            size="sm"
            inputMode="numeric"
            autoComplete="off"
            disabled={loading}
            aria-label={t("Pagination.GoTo")}
            value={jumpValue}
            onChange={(event) => setJumpValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitJump();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                setJumpValue(String(activePage));
              }
            }}
            onBlur={() => setJumpValue(String(activePage))}
          />
          <span className="quick-jumper-of">
            {t("Pagination.GoTo.Of", totalPageCount)}
          </span>
        </div>
      )}
    </nav>
  );
};

Pagination.displayName = "Pagination";
export default Pagination;
