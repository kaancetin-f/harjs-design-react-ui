"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Props } from "./Props";
import Input from "../input";
import "../../../assets/css/components/form/select/styles.css";
import Chip from "../../data-display/chip";
import Checkbox from "../checkbox";
import { Option } from "../../../libs/infrastructure/types/index";
import Utils from "../../../libs/infrastructure/shared/Utils";
import ReactDOM from "react-dom";

const Select: React.FC<Props> = ({
  variant = "outlined",
  status,
  color,
  border = { radius: "sm" },
  style,
  options,
  value,
  onChange,
  onSearch,
  onClick,
  onCreate,
  multiple,
  placeholder,
  validation,
  upperCase,
  disabled,
  readOnly,
  config = { clear: true, validation: { text: "visible" } },
}) => {
  const _selectionClassName: string[] = ["selections"];

  // refs
  const _arSelect = useRef<HTMLDivElement>(null);
  const _singleInput = useRef<HTMLInputElement>(null);
  const _multipleInput = useRef<HTMLDivElement>(null);
  const _placeholder = useRef<HTMLSpanElement>(null);
  const _options = useRef<HTMLDivElement>(null);
  const _optionItems = useRef<(HTMLLIElement | null)[]>([]);
  const _searchField = useRef<HTMLInputElement>(null);
  let _otoFocus = useRef<NodeJS.Timeout | null>(null).current;
  let _navigationIndex = useRef<number>(0);

  // states
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(() => options ?? []);
  const [isSearchTextEqual, setIsSearchTextEqual] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [singleInputText, setSingleInputText] = useState<string>("");
  const [navigationIndex, setNavigationIndex] = useState<number>(0);

  // options referans kararlılığı için JSON key
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

  _selectionClassName.push(
    ...Utils.GetClassName(
      variant,
      undefined,
      validation?.text ? "red" : "light",
      border,
      undefined,
      undefined,
      undefined,
    ),
  );

  // methods
  const handleClickOutSide = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (_arSelect.current && !_arSelect.current.contains(target)) setOptionsOpen(false);
  };

  const handleKeys = (event: KeyboardEvent) => {
    const key = event.key;
    const optionItems = _optionItems.current.filter((optionItem) => optionItem !== null);

    if (key === "ArrowUp" || key === "ArrowLeft") {
      setNavigationIndex((prev) => {
        const result = prev > 0 ? prev - 1 : optionItems.length - 1;
        _navigationIndex.current = result;
        return result;
      });
    } else if (key === "ArrowDown" || key === "ArrowRight") {
      setNavigationIndex((prev) => {
        const result = prev === optionItems.length - 1 ? 0 : prev + 1;
        _navigationIndex.current = result;
        return result;
      });
    } else if (key === "Enter") {
      if (_navigationIndex.current === -1) return;
      optionItems[_navigationIndex.current]?.click();
    } else if (key === "Escape") {
      setOptionsOpen(false);
    }
  };

  const handlePosition = () => {
    if (_options.current) {
      const optionRect = _options.current.getBoundingClientRect();
      const InpuRect = _singleInput.current
        ? _singleInput.current.getBoundingClientRect()
        : _multipleInput.current?.getBoundingClientRect();

      if (InpuRect) {
        const screenCenter = window.innerHeight / 2;
        const sx = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
        const sy = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

        _options.current.style.visibility = "visible";
        _options.current.style.opacity = "1";
        _options.current.style.top = `${
          (InpuRect.top > screenCenter
            ? InpuRect.top - optionRect.height - (multiple ? 0 : 5)
            : InpuRect.top + InpuRect.height) + sy
        }px`;
        _options.current.style.left = `${InpuRect.left + sx}px`;
        _options.current.style.minWidth = "200px";
        _options.current.style.width = `${InpuRect.width}px`;
      }
    }
  };

  const handleItemSelected = (option: Option) => {
    if (multiple) {
      const hasItem = value.some((item) => item.value === option.value && item.text === option.text);
      if (hasItem) onChange(value.filter((v) => !(v.value === option.value && v.text === option.text)));
      else onChange([...value, option]);
    } else {
      onChange(option);
      setOptionsOpen(false);
    }
  };

  const handleCleanSelection = () => {
    if (multiple) {
      if (_searchField.current) setSearchText("");
      onChange([]);
    } else {
      if (_singleInput.current) {
        setSingleInputText("");
        _singleInput.current.placeholder = `${validation ? "* " : ""}${placeholder ?? ""}`;
      }
      onChange(undefined);
    }
    setOptionsOpen(false);
  };

  const createField = () => {
    if (!onCreate) return;

    return (
      <div
        className="no-options-field"
        onClick={(event) => {
          event.stopPropagation();
          onCreate({ value: "", text: singleInputText });
          setOptionsOpen(false);
        }}
      >
        {options.length === 0 && (singleInputText.length === 0 || searchText.length === 0) ? (
          <span className="text">Herhangi bir kayıt bulunumadı.</span>
        ) : (
          <span className="add-item">
            <span className="plus">+</span>
            {singleInputText.length !== 0 ? singleInputText : searchText}
          </span>
        )}
      </div>
    );
  };

  const convertToUpperCase = (str: string) => {
    return str
      .replace(/ş/g, "S")
      .replace(/Ş/g, "S")
      .replace(/ı/g, "I")
      .replace(/I/g, "I")
      .replace(/ç/g, "C")
      .replace(/Ç/g, "C")
      .replace(/ğ/g, "G")
      .replace(/Ğ/g, "G")
      .replace(/ö/g, "O")
      .replace(/Ö/g, "O")
      .replace(/ü/g, "U")
      .replace(/Ü/g, "U")
      .replace(/[a-z]/g, (match) => match.toUpperCase());
  };

  // value değiştiğinde input metnini güncelle
  useEffect(() => {
    if (multiple) setSearchText("");
    else setSingleInputText(value?.text ?? "");
  }, [value, multiple]);

  // options dışarıdan değiştiğinde filtreyi güncelle (searchText ile uyumlu)
  useEffect(() => {
    setFilteredOptions(
      (options ?? []).filter((option) => option.text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())),
    );
    setIsSearchTextEqual(
      (options ?? []).some((option) => option.text.toLocaleLowerCase() === searchText.toLocaleLowerCase()),
    );
    // optionsKey kullanarak referans karşılaştırması yerine içerik karşılaştırması yapıyoruz
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  // options paneli açılıp kapandığında
  useEffect(() => {
    if (optionsOpen) {
      setTimeout(() => handlePosition(), 0);

      if (!multiple && _singleInput.current) {
        setSingleInputText("");
        _singleInput.current.placeholder = value?.text || `${validation ? "* " : ""}${placeholder ?? ""}` || "";
      }

      _otoFocus = setTimeout(() => {
        if (_searchField.current) _searchField.current.focus();
      }, 250);

      window.addEventListener("blur", handleBlur);
      document.addEventListener("click", handleClickOutSide);
      document.addEventListener("keydown", handleKeys);
    } else {
      setTimeout(() => setSearchText(""), 300);

      if (multiple) {
        if (_searchField.current) _searchField.current.value = "";
      } else {
        if (_singleInput.current) {
          setSingleInputText(value?.text ?? "");
          _singleInput.current.placeholder = `${validation ? "* " : ""}${placeholder ?? ""}`;
        }
      }
    }

    return () => {
      _otoFocus && clearTimeout(_otoFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("click", handleClickOutSide);
      document.removeEventListener("keydown", handleKeys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsOpen]);

  // arama metni değiştiğinde filtrele
  useEffect(() => {
    if (searchText.length > 0 && onSearch) {
      onSearch(searchText);
    } else {
      setFilteredOptions(
        (options ?? []).filter((option) => {
          if (!optionsOpen) return true;
          return option.text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
        }),
      );
      setIsSearchTextEqual(
        (options ?? []).some((option) => {
          if (!optionsOpen) return false;
          return option.text.toLocaleLowerCase() === searchText.toLocaleLowerCase();
        }),
      );
    }

    setNavigationIndex(0);
    _navigationIndex.current = 0;

    const optionItems = _optionItems.current.filter((item) => item !== null);
    optionItems[_navigationIndex.current]?.classList.add("navigate-with-arrow-keys");

    setTimeout(() => handlePosition(), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // klavye navigasyonu highlight
  useEffect(() => {
    _optionItems.current
      .filter((item) => item !== null)
      .forEach((item, index) => {
        if (index === navigationIndex) {
          item?.classList.add("navigate-with-arrow-keys");
          item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          item?.classList.remove("navigate-with-arrow-keys");
        }
      });
  }, [navigationIndex]);

  const handleBlur = () => setOptionsOpen(false);

  return (
    <div ref={_arSelect} className="ar-select-wrapper">
      {/* :Begin: Select and Multiple Select Field */}
      <div ref={_multipleInput} className="ar-select">
        {multiple ? (
          <div className="wrapper">
            <div
              {...(value.length > 0
                ? {
                    style: {
                      clipPath: `polygon(
                            -15px 0,
                            10px -5px,
                            10px 5px,
                            calc(${_placeholder.current?.getBoundingClientRect().width}px + 7px) 5px,
                            calc(${_placeholder.current?.getBoundingClientRect().width}px + 7px) -5px,
                            100% -70px,
                            calc(100% + 5px) calc(100% + 5px),
                            -5px calc(100% + 5px)
                          )`,
                    },
                  }
                : {})}
              className={_selectionClassName.join(" ")}
              onClick={() => {
                onClick && onClick();
                setOptionsOpen((prev) => !prev);
              }}
            >
              <div className="items">
                {value.map((_value, index) => (
                  <Chip
                    key={index}
                    variant={status?.selected?.variant || "filled"}
                    color={status?.selected?.color || status?.color}
                    text={_value.text}
                  />
                ))}
              </div>
            </div>

            <span
              ref={_placeholder}
              className={`placeholder ${value.length > 0 ? "visible" : "hidden"}`}
              onClick={() => {
                onClick && onClick();
                setOptionsOpen((prev) => !prev);
              }}
            >
              {validation ? "* " : ""}
              {placeholder}
            </span>
          </div>
        ) : (
          <Input
            ref={_singleInput}
            style={{ ...style, paddingRight: config.clear === false ? "1.5rem" : "3.5rem" }}
            variant={variant}
            color={!Utils.IsNullOrEmpty(validation?.text) ? "red" : color}
            border={{ radius: border.radius }}
            value={singleInputText}
            onClick={() => {
              onClick && onClick();
              setOptionsOpen((prev) => !prev);
            }}
            onChange={(event) => {
              !optionsOpen && setOptionsOpen(true);
              if (upperCase) event.target.value = convertToUpperCase(event.target.value);
              setSingleInputText(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") return;
              setSearchText(event.currentTarget.value);
            }}
            placeholder={placeholder}
            validation={{
              ...validation,
              text: config.validation?.text === "visible" ? validation?.text : "",
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}

        <div className="buttons">
          {config?.clear === true && (
            <span
              className={`button-clear ${!disabled && (multiple ? value.length > 0 : value) ? "opened" : "closed"}`}
              onClick={(event) => {
                if (disabled) return;
                event.stopPropagation();
                handleCleanSelection();
              }}
            />
          )}

          <span
            className={`angel-down ${!disabled && optionsOpen ? "opened" : "closed"}`}
            onClick={(event) => {
              if (disabled) return;
              onClick && onClick();
              event.stopPropagation();
              setOptionsOpen((prev) => !prev);
            }}
          />
        </div>

        {multiple && validation && config.validation?.text === "visible" && (
          <span className="har-validation-text">{validation.text}</span>
        )}
      </div>
      {/* :End: Select and Multiple Select Field */}

      {/* :Begin: Options Field */}
      {!disabled &&
        optionsOpen &&
        ReactDOM.createPortal(
          <div ref={_options} className="ar-select-options">
            {multiple && (
              <div className="search-field">
                <Input
                  ref={_searchField}
                  variant="outlined"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              <ul>
                {onCreate && !isSearchTextEqual && searchText.length > 0 && <li>{createField()}</li>}

                {filteredOptions.map((option, index) => {
                  const isItem = multiple && value.some((_value) => _value.value === option.value);

                  return (
                    <li
                      key={index}
                      ref={(element) => {
                        if (!element) return;
                        _optionItems.current[index] = element;
                      }}
                      className={option === value ? "selectedItem" : ""}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleItemSelected(option);
                      }}
                    >
                      {multiple && <Checkbox checked={isItem} color={isItem ? "blue" : "light"} disabled />}
                      <span>{option.text}</span>
                    </li>
                  );
                })}
              </ul>
            ) : !onCreate ? (
              <div className="no-options-field">
                <span className="text">Herhangi bir kayıt bulunumadı.</span>
              </div>
            ) : (
              createField()
            )}
          </div>,
          document.body,
        )}
      {/* :End: Options Field */}
    </div>
  );
};

Select.displayName = "Select";

export default Select;
