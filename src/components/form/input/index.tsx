"use client";

import React, {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "../../../assets/css/components/form/input/styles.css";
// import Button from "../button";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { ARIcon } from "../../icons";
import Otp from "./otp/Otp";
import FormattedDecimal from "./formatted-decimal/FormattedDecimal";
import Phone from "./phone/Phone";
import Decimal from "./decimal/Decimal";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

const BaseInput = forwardRef<HTMLInputElement, IProps>(
  (
    {
      children,
      variant = "outlined",
      color = "light",
      border = { radius: "sm" },
      // button,
      size,
      upperCase,
      validation,
      ...attributes
    },
    ref,
  ) => {
    // refs
    const _innerRef = useRef<HTMLInputElement>(null);
    const _label = useRef<HTMLLabelElement>(null);

    // states
    const [value, setValue] = useState<string | number | readonly string[] | undefined>("");
    const [labelWidth, setLabelWidth] = useState<number>(0);
    // hooks
    // Dışarıdan gelen ref'i _innerRef'e bağla.
    useImperativeHandle(ref, () => _innerRef.current as HTMLInputElement);

    // variables
    const _wrapperClassName: string[] = ["har-input-wrapper"];
    // const _addonBeforeClassName: string[] = ["addon-before"];
    // const _addonAfterClassName: string[] = ["addon-after"];

    _wrapperClassName.push(
      ...Utils.GetClassName(
        variant,
        undefined,
        !Utils.IsNullOrEmpty(validation?.text) ? "red" : color,
        border,
        size,
        undefined,
        attributes.className,
      ),
    );

    if (attributes.disabled) _wrapperClassName.push("disabled");
    // if (addon) {
    //   _wrapperClassName.push("addon");

    //   _addonBeforeClassName.push(`${addon.variant || "filled"}`);
    //   _addonBeforeClassName.push(`${status}`);

    //   _addonAfterClassName.push(`${addon.variant || "filled"}`);
    //   _addonAfterClassName.push(`${status}`);

    //   _addonBeforeClassName.push(`border-radius-${border.radius}`);
    //   _addonAfterClassName.push(`border-radius-${border.radius}`);
    // }

    // methods
    const handleNumberChange = (delta: number) => {
      const current = Number(value) || 0;
      const newValue = current + delta;
      const dataset = (_innerRef.current as HTMLInputElement | null)?.dataset ?? {};

      setValue(newValue);

      attributes.onChange?.({
        target: {
          id: attributes.id ?? "",
          name: attributes.name ?? "",
          value: String(newValue),
          type: attributes.type ?? "number",
          dataset: dataset,
        },
      } as unknown as ChangeEvent<HTMLInputElement>);
    };

    const renderChildrenIcon = () => {
      const iconElements = React.Children.toArray(children).filter((child) => {
        return React.isValidElement(child) && child.type === Input.Icon;
      });

      if (iconElements.length === 0) return null;

      return iconElements.map((child) => {
        if (React.isValidElement(child)) return React.cloneElement(child);

        return child;
      });
    };

    const renderChildrenAddon = (position: "before" | "after") => {
      const iconElements = React.Children.toArray(children).filter((child) => {
        return (
          React.isValidElement(child) && child.type === (position === "before" ? Input.AddonBefore : Input.AddonAfter)
        );
      });

      if (iconElements.length === 0) return null;

      return iconElements.map((child) => {
        if (React.isValidElement(child)) return React.cloneElement(child);

        return child;
      });
    };

    // Özel büyük harfe dönüştürme işlevi.
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

    // useEffects
    useEffect(() => {
      if (attributes.value !== undefined) setValue(attributes.value ?? "");
    }, [attributes.value]);

    useLayoutEffect(() => {
      if (_label.current) {
        const width = _label.current.getBoundingClientRect().width;
        setLabelWidth(width);
      }
    }, [value, attributes.placeholder]);

    return (
      <div className={_wrapperClassName.map((c) => c).join(" ")}>
        {renderChildrenAddon("before")}

        <div className="har-input">
          {renderChildrenIcon() && <div className="icon-element">{renderChildrenIcon()}</div>}

          {attributes.placeholder && (
            <label
              ref={_label}
              className={value ? "visible" : "hidden"}
              {...(value ? { style: { maxWidth: labelWidth } } : {})}
            >
              {validation && "* "}
              {attributes.placeholder}
            </label>
          )}

          <div className="input" style={{ width: attributes.width }}>
            <input
              ref={_innerRef}
              {...attributes}
              type={attributes.type === "number" ? "text" : attributes.type}
              placeholder={`${validation ? "* " : ""}${attributes.placeholder ?? ""}`}
              value={value ?? attributes.value} // `value` varsa onu kullan, yoksa `internalValue`'yu kullan
              // size={attributes.size || 20}
              // className={_inputClassName.map((c) => c).join(" ")}
              {...(attributes.type === "number"
                ? {
                    onKeyDown: (event) => {
                      const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
                      const isNumberKey = /^[0-9]$/.test(event.key);

                      if (!isNumberKey && !allowedKeys.includes(event.key)) event.preventDefault();
                    },
                  }
                : {})}
              {...(value && labelWidth > 0
                ? {
                    style: {
                      ...attributes.style,
                      clipPath: `polygon(
                                        -15px 0,
                                        10px -5px,
                                        10px 5px,
                                        calc(${labelWidth}px + 7px) 5px,
                                        calc(${labelWidth}px + 7px) -5px,
                                        100% -70px,
                                        calc(100% + 5px) calc(100% + 5px),
                                        -5px calc(100% + 5px)
                                      )`,
                    },
                  }
                : { style: { ...attributes.style } })}
              onChange={(event) => {
                if (attributes.disabled) return;

                (() => {
                  if (upperCase) event.target.value = convertToUpperCase(event.target.value);
                  setValue(event.target.value);
                })();

                (() => {
                  if (attributes.onChange) {
                    // Mevcut değeri alın
                    const { value } = event.target;
                    const currentValue = upperCase ? convertToUpperCase(value) : value;

                    // Yeni değeri oluşturun ve onChange fonksiyonunu çağırın
                    // const newValue = `${addon?.before ?? ""}${currentValue}${addon?.after ?? ""}`;

                    attributes.onChange({
                      ...event,
                      target: {
                        ...event.target,
                        id: event.target.id,
                        name: event.target.name,
                        value: currentValue,
                        type: event.target.type,
                        dataset: event.target.dataset,
                      },
                    });
                  }
                })();
              }}
            />

            {!attributes.disabled && attributes.type === "number" && (
              <div className="handle-number-button">
                <span onClick={() => handleNumberChange(1)}>
                  <ARIcon icon="ChevronUp" size={12} fill="var(--gray-500)" />
                </span>

                <span onClick={() => handleNumberChange(-1)}>
                  <ARIcon icon="ChevronDown" size={12} fill="var(--gray-500)" />
                </span>
              </div>
            )}
          </div>

          {validation?.text && <span className="har-validation-text">{validation.text}</span>}
        </div>

        {renderChildrenAddon("after")}

        {/* {button && <Button {...button} border={{ radius: border.radius }} disabled={attributes.disabled} />} */}
      </div>
    );
  },
);

interface InputCompound extends React.ForwardRefExoticComponent<IProps & React.RefAttributes<HTMLInputElement>> {
  AddonBefore: ({ children }: IChildrenProps) => React.JSX.Element;
  AddonAfter: ({ children }: IChildrenProps) => React.JSX.Element;
  Icon: ({ children, position }: ComponentProps<typeof Input> & { position: "start" | "end" }) => React.JSX.Element;

  Decimal: typeof Decimal;
  FormattedDecimal: typeof FormattedDecimal;
  Otp: typeof Otp;
  Phone: typeof Phone;
}

const Input = BaseInput as InputCompound;
Input.AddonBefore = ({ children }) => <div className={"addon-before"}>{children}</div>;
Input.AddonAfter = ({ children }) => <div className={"addon-after"}>{children}</div>;
Input.Icon = ({ children, position, ...attributes }) => {
  return (
    <span
      {...attributes}
      className={`icon ${position} ${attributes.className} ${attributes.onClick ? "cursor-pointer" : "cursor-text"}`}
    >
      {children}
    </span>
  );
};

Input.Decimal = Decimal;
Input.FormattedDecimal = FormattedDecimal;
Input.Phone = Phone;
Input.Otp = Otp;

BaseInput.displayName = "Input";
export default Input;
