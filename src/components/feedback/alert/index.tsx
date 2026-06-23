"use client";

import React from "react";
import "../../../assets/css/components/feedback/alert/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Alert: React.FC<IProps> = ({
  children,
  message,
  variant = "filled",
  status = "primary",
  border = { radius: "sm" },
  emphasize,
}) => {
  const _className: string[] = ["ar-alert"];

  _className.push(...Utils.GetClassName(variant, status, undefined, border, undefined, undefined, undefined));

  // methods
  const formattedTags = (message: string) => {
    // TODO: Şuan için sadece transparent olan alert tiplerinde çalışmakta.
    // TODO: Bu konu hakkında düşünüp karar verilecek.
    if (!emphasize) return message;

    let _lowerCaseMessage = message.toLocaleLowerCase();

    return emphasize.reduce((currentMessage, emphasize) => {
      let _lowerCaseEmphasize = emphasize.toLocaleLowerCase();
      let startIndex = _lowerCaseMessage.indexOf(_lowerCaseEmphasize);

      while (startIndex !== -1) {
        const endIndex = startIndex + emphasize.length;

        const firstValue = currentMessage.substring(0, startIndex);
        const originalTag = currentMessage.substring(startIndex, endIndex);
        const lastValue = currentMessage.substring(endIndex);

        currentMessage = `${firstValue} <span class="ar-alert-tag">${originalTag}</span> ${lastValue}`;
        _lowerCaseMessage = currentMessage.toLocaleLowerCase();
        startIndex = _lowerCaseMessage.indexOf(
          _lowerCaseEmphasize,
          startIndex + `<span class="ar-alert-tag">${originalTag}</span>`.length
        );
      }

      return currentMessage;
    }, message);
  };

  const createList = (message: any, isSubMessage?: boolean) => {
    let className: string = "";

    if (isSubMessage) className += "sub-message";
    else className += "message";

    return (
      <ul>
        {Array.isArray(message)
          ? message.map((messageItem, index) => (
              <li key={index} className={className}>
                {Array.isArray(messageItem) ? (
                  createList(messageItem, true)
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formattedTags(cleanMessage(messageItem)) ?? "",
                    }}
                  ></div>
                )}
              </li>
            ))
          : message}
      </ul>
    );
  };

  /**
   *
   * @param message Yalnızca alfanümerik karakterleri (harfler ve sayılar) ve boşlukları tutar.
   * @returns
   */
  const cleanMessage = (message: string) => message.replace(/<\/?[^>]+>/g, "");

  return (
    <div className={_className.map((c) => c).join(" ")}>
      {message ? (
        Array.isArray(message) ? (
          createList(message)
        ) : (
          <p dangerouslySetInnerHTML={{ __html: formattedTags(cleanMessage(message)) ?? "" }}></p>
        )
      ) : (
        children
      )}
    </div>
  );
};

export default Alert;
