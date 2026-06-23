"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import IProps from "./IProps";
import Typography from "../../data-display/typography";
import "../../../assets/css/components/feedback/drawer/styles.css";
import { useValidation } from "../../../libs/core/application/hooks";
import { ValidationProps } from "../../../libs/infrastructure/types";

const { Title } = Typography;

const Drawer = function <T extends object>({ title, tabs = [], activeTab, open, validation, onChange }: IProps<T>) {
  // refs
  const _arDrawer = useRef<HTMLDivElement>(null);
  const _drawerWrapperClassName: string[] = ["ar-drawer-wrapper"];
  const _drawerClassName: string[] = ["ar-drawer"];

  if (Object.keys(open).length > 0 && open.get) _drawerWrapperClassName.push("opened");
  else _drawerWrapperClassName.push("closed");

  // states
  const [currentTab, setCurrentTab] = useState<number>(0);

  // hooks
  const { errors, onSubmit, setSubmit } = useValidation(
    validation?.data as T,
    validation?.rules as ValidationProps<T>[],
    currentTab + 1,
  );

  // methods
  const handleValidationControlForClose = useCallback(() => {
    if (validation) {
      onSubmit((result) => {
        if (!result) return;

        open.set(false);
        setSubmit(false);
      });
    } else {
      open.set(false);
    }
  }, [errors, onSubmit, setSubmit]);

  // useEffects
  useEffect(() => {
    if (!open.get) return;

    document.body.style.overflow = "hidden";

    const handleKeys = (event: KeyboardEvent) => {
      const key = event.key;
      const isArModal = document.getElementsByClassName("ar-modal-wrapper opened").length === 0;
      const isArSelectOptions = document.getElementsByClassName("ar-select-options").length === 0;
      const isArCalendar = document.getElementsByClassName("ar-date-calendar").length === 0;
      const isArPopover = document.getElementsByClassName("ar-popover").length === 0;

      if (key === "Escape" && isArModal && isArCalendar && isArSelectOptions && isArPopover) {
        event.stopPropagation();
        handleValidationControlForClose();
      }
    };

    document.addEventListener("keydown", handleKeys);

    return () => {
      document.body.style.removeProperty("overflow");
      document.removeEventListener("keydown", handleKeys);
    };
  }, [open, handleValidationControlForClose]);

  useEffect(() => setCurrentTab(activeTab ?? 0), [activeTab]);

  return (
    <div className={_drawerWrapperClassName.map((c) => c).join(" ")}>
      <div
        className="ar-drawer-bg"
        onClick={(event) => {
          event.stopPropagation();

          const target = event.target as HTMLElement;
          if (_arDrawer.current && !_arDrawer.current.contains(target)) handleValidationControlForClose();
        }}
      ></div>

      <div ref={_arDrawer} className={_drawerClassName.map((c) => c).join(" ")} role="dialog">
        {title && (
          <div className="header">
            <Title Level="h3">{title}</Title>

            <div className="close" onClick={() => handleValidationControlForClose()}></div>
          </div>
        )}

        <div className="tabs">
          {tabs.length > 1 &&
            tabs.map((tab, index) => {
              let className: string[] = ["item"];

              if (currentTab === index) className.push("selection");

              return (
                <div
                  key={tab.title ?? index}
                  className={className.map((c) => c).join(" ")}
                  onClick={() => {
                    setCurrentTab(index);
                    onChange && onChange(index);

                    const key = `${window.location.pathname}::${name}`;
                    sessionStorage.setItem(key, String(index));
                  }}
                >
                  <span>{tab.title}</span>
                </div>
              );
            })}
        </div>

        {Object.keys(open).length > 0 && open.get && (
          <div className="content">
            {tabs.map((tab, index) => {
              return (
                <div key={index}>
                  {React.Children.map(tab.content, (child) => {
                    if (React.isValidElement(child) && index === currentTab) {
                      return validation
                        ? React.cloneElement(
                            child as React.ReactElement<{ errors: Partial<{ [key in keyof T]: string }> }>,
                            {
                              errors: errors,
                            },
                          )
                        : child;
                    }

                    return null;
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
