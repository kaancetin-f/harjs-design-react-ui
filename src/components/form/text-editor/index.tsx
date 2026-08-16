"use client";

import "../../../assets/css/components/form/text-editor/styles.css";
import { Icon } from "../../icons";
import { Icons } from "../../../libs/infrastructure/types";
import Button from "../button";
import IProps from "./IProps";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Utils from "../../../libs/infrastructure/shared/Utils";
import ReactDOM from "react-dom";
import Tooltip from "../../feedback/tooltip";

const TextEditor = <T extends object>({
  variant = "outlined",
  color = "gray",
  border = { radius: "4" },
  name,
  value,
  onChange,
  dynamicList,
  placeholder,
  height,
  // multilang,
  validation,
  disabled,
}: IProps<T>) => {
  // refs
  const _container = useRef<HTMLDivElement>(null);
  const _label = useRef<HTMLLabelElement>(null);
  const _harIframe = useRef<HTMLIFrameElement>(null);
  const _onChange = useRef(onChange);
  const _onChangeTimeOut = useRef<NodeJS.Timeout | null>(null);
  const _disabled = useRef(disabled);
  // refs -> Alias Panel
  const _target = useRef<Node | null>(null);
  const _harAliasPanel = useRef<HTMLDivElement>(null);

  // states
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [iframeDocument, setIframeDocument] = useState<Document | undefined>(undefined);
  const [labelMaxWidth, setLabelMaxWidth] = useState<number | undefined>(undefined);
  const [labelClipWidth, setLabelClipWidth] = useState<number>(0);
  // states -> Data
  const [tagged, setTagged] = useState<T[]>([]);
  // states -> Alias Panel
  const [atRect, setAtRect] = useState<DOMRect | null>(null);
  const [filtered, setFiltered] = useState<string | null>(null);

  // variables
  const toolbarButtons: { command: string; icon: Icons; tooltip: string }[] = [
    { command: "bold", icon: "Bold", tooltip: `Bold (${Utils.GetOSShortCutIcons()} + B)` },
    { command: "italic", icon: "Italic", tooltip: `Italic (${Utils.GetOSShortCutIcons()} + I)` },
    { command: "underline", icon: "Underline", tooltip: `Underline (${Utils.GetOSShortCutIcons()} + U)` },
    { command: "insertUnorderedList", icon: "BulletList", tooltip: "Bulleted List" },
    { command: "insertOrderedList", icon: "NumberList", tooltip: "Numbered List" },
    { command: "justifyLeft", icon: "TextAlingLeft", tooltip: "Align Left" },
    { command: "justifyCenter", icon: "TextAlingCenter", tooltip: "Align Center" },
    { command: "justifyRight", icon: "TextAlingRight", tooltip: "Align Right" },
  ];
  const _wrapperClassName: string[] = ["har-text-editor-wrapper"];
  _wrapperClassName.push(
    ...Utils.GetClassName(
      variant,
      undefined,
      !Utils.IsNullOrEmpty(validation?.text) ? "red" : color,
      border,
      undefined,
      undefined,
      undefined,
    ),
  );
  if (disabled) _wrapperClassName.push("disabled");

  // methods
  const execCommand = (command: string) => {
    if (disabled || !_harIframe.current) return;

    const iframeDoc = _harIframe.current.contentDocument || _harIframe.current.contentWindow?.document;
    if (iframeDoc) iframeDoc.execCommand(command, true, undefined);
  };

  const handleFocus = () => _harIframe.current?.classList.add("focused");

  const handleBlur = () => {
    _harIframe.current?.classList.remove("focused");
    // setAtRect(null);
  };

  const handleMouseDown = () => {
    if (disabled) return;

    // Resizebar a tıklandığında iframe içerisinde bulunan window'un event listenerı olmadığı için orada resize çalışmayacaktır.
    // Bu yüzden önüne bir duvar örüyoruz ve mevcut sayfanın window'unda işlem yapmaya devam ediyor.
    const resizeItem = document.createElement("div");
    resizeItem.classList.add("har-text-editor--block-item");
    _container.current?.appendChild(resizeItem);

    window.addEventListener("mousemove", handleResize);

    window.addEventListener("mouseup", () => {
      resizeItem.remove();
      window.removeEventListener("mousemove", handleResize);
    });
  };

  const handleResize = (event: MouseEvent) => {
    if (_harIframe.current) {
      const rect = _harIframe.current.getBoundingClientRect();
      const height = (rect.height += event.movementY);

      _harIframe.current.style.height = `${height}px`;
    }
  };

  // methods -> Alias Panel
  const handleBackSpaceKeydown = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === "Backspace" || key === "Delete") {
      const selection = _harIframe.current?.contentDocument?.getSelection();

      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // 1. Çoklu seçim varsa: clone edip span'ları bul.
      const contents = range.cloneContents();
      const multiSpans = contents.querySelectorAll("span[data-tag]");

      if (multiSpans.length > 0) {
        event.preventDefault();

        const tagsToRemove: string[] = [];
        multiSpans.forEach((span) => {
          const tag = span.getAttribute("data-tag");
          if (tag) tagsToRemove.push(tag);
        });

        // DOM'dan temizle
        range.deleteContents();

        // State'ten temizle
        setTagged((prev) => prev.filter((x) => tagsToRemove.every((tag) => !JSON.stringify(x).includes(tag))));
        return;
      }

      // 2. Tekli seçim: caret bir span içindeyse sil
      const node = selection.anchorNode;
      const container = (node as HTMLElement)?.parentElement;

      if (container?.tagName === "SPAN" && container.dataset.tag) {
        event.preventDefault();

        const tag = container.dataset.tag;

        // DOM'dan sil
        container.remove();

        // State'ten kaldır
        setTagged((prev) => prev.filter((x) => !JSON.stringify(x).includes(tag ?? "")));
      }
    }
  };

  // useEffects
  useEffect(() => {
    // Iframe Document yüklendikten sonra çalışacaktır.
    if (!iframeDocument) return;

    const selection = iframeDocument.getSelection();
    let range: Range | null = null;

    // Eğer bir seçim (caret) varsa, konumunu kaydet
    if (selection && selection.rangeCount > 0) range = selection.getRangeAt(0);

    // Eğer içeriği kendimiz değiştirmedikse ve gelen value farklıysa, içeriği güncelle
    if (iframeDocument.body.innerHTML !== value) {
      // iframeDocument.body.innerHTML = value || `<p>${placeholder ?? ""}</p>`;
      iframeDocument.body.innerHTML = value ?? "";
    }

    // Cursor (caret) konumunu geri yükle
    if (range) {
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [value, iframeDocument]);

  useEffect(() => {
    // onChange değiştiğinde ref'i güncelle
    _onChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    _disabled.current = disabled;
  }, [disabled]);

  useEffect(() => {
    // Iframe yüklendikten sonra çalışacaktır.
    if (!iframe) return;

    const _iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!_iframeDocument) return;

    setIframeDocument(_iframeDocument);
    _iframeDocument.designMode = _disabled.current ? "off" : "on";

    // Herhangi bir değişikliği izlemek için MutationObserver kullan
    const observer = new MutationObserver((mutationsList) => {
      if (_disabled.current) return;
      if (_onChangeTimeOut.current) clearTimeout(_onChangeTimeOut.current);

      _onChangeTimeOut.current = setTimeout(() => {
        mutationsList.forEach((record) => {
          const target = record.target;
          _target.current = record.target;

          if (dynamicList) {
            if (target.nodeType === Node.TEXT_NODE) {
              const text = target.textContent ?? "";
              const atIndex = text.lastIndexOf(dynamicList?.triggerKey ?? "@");

              if (atIndex !== -1) {
                const afterAt = text.slice(atIndex + 1); // @ sonrası metin.
                const hasWhitespace = /\s/.test(afterAt);

                if (!hasWhitespace) {
                  const selection = _iframeDocument?.getSelection();

                  if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0).cloneRange();
                    const rect = range.getBoundingClientRect();
                    range.collapse(true);

                    setAtRect(rect);
                    setFiltered(afterAt);
                    return;
                  }
                }
              }

              // Eğer @ yoksa ya da boşluk varsa paneli kapat.
              setAtRect(null);
            }
          }

          _iframeDocument?.body.innerHTML === "<br>"
            ? _onChange.current(undefined)
            : _onChange.current(_iframeDocument.body.innerHTML);
        });
      }, 500);
    });

    // Observer'ı body üzerinde başlat
    observer.observe(_iframeDocument.body, { childList: true, subtree: true, characterData: true, attributes: true });

    _iframeDocument.body.addEventListener("focus", handleFocus);
    _iframeDocument.body.addEventListener("blur", handleBlur);

    if (dynamicList) {
      _iframeDocument.body.addEventListener("keydown", handleBackSpaceKeydown);
    }

    return () => {
      observer.disconnect();

      _iframeDocument.body.removeEventListener("focus", handleFocus);
      _iframeDocument.body.removeEventListener("blur", handleBlur);

      if (dynamicList) {
        _iframeDocument.body.removeEventListener("keydown", handleBackSpaceKeydown);
      }
    };
  }, [iframe]);

  useEffect(() => {
    if (!iframeDocument) return;
    iframeDocument.designMode = disabled ? "off" : "on";
  }, [disabled, iframeDocument]);

  useEffect(() => {
    dynamicList?.onTagged && dynamicList?.onTagged(tagged);
  }, [tagged]);

  useEffect(() => {
    if (!_harIframe.current) return;

    setIframe(_harIframe.current);

    return () => {
      if (iframeDocument) {
        iframeDocument.body.removeEventListener("focus", handleFocus);
        iframeDocument.body.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const label = _label.current;
    const iframe = _harIframe.current;

    if (!label || !iframe) return;

    const measure = () => {
      if (!value || !placeholder) {
        setLabelMaxWidth(undefined);
        setLabelClipWidth(0);
        return;
      }

      const previousMaxWidth = label.style.maxWidth;
      label.style.maxWidth = "none";
      const naturalWidth = label.getBoundingClientRect().width;
      label.style.maxWidth = previousMaxWidth;

      const leftOffset = label.offsetLeft;
      const availableWidth = Math.max(0, iframe.offsetWidth - leftOffset - 8);

      setLabelMaxWidth(availableWidth);
      setLabelClipWidth(Math.min(naturalWidth, availableWidth));
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(iframe);

    return () => resizeObserver.disconnect();
  }, [value, placeholder]);

  return (
    <div
      ref={_container}
      className={_wrapperClassName.map((c) => c).join(" ")}
      {...(validation?.text ? { style: { marginBottom: "var(--space-20)" } } : {})}
    >
      <div className="har-text-editor">
        {placeholder && (
          <label
            ref={_label}
            className={value ? "visible" : "hidden"}
            {...(value && labelMaxWidth !== undefined ? { style: { maxWidth: labelMaxWidth } } : {})}
          >
            {validation && "* "}
            {placeholder}
          </label>
        )}

        <iframe
          ref={_harIframe}
          name={name}
          height={height}
          {...(value && labelClipWidth > 0 && placeholder
            ? {
                style: {
                  clipPath: `polygon(
                              -15px 0,
                              10px -5px,
                              10px 5px,
                              calc(${labelClipWidth}px + 7px) 5px,
                              calc(${labelClipWidth}px + 7px) -5px,
                              100% -70px,
                              calc(100% + 5px) calc(100% + 5px),
                              -5px calc(100% + 5px)
                            )`,
                },
              }
            : {})}
        />

        <div className="toolbar">
          {toolbarButtons.map(({ command, icon, tooltip }, index) => (
            <Tooltip key={`${command}-${index}`} text={tooltip}>
              <Button
                key={command}
                type="button"
                variant="borderless"
                color="gray"
                border={{ radius: "0" }}
                shape="square"
                icon={{ element: <Icon icon={icon} fill="currentColor" /> }}
                onClick={() => execCommand(command)}
              />
            </Tooltip>
          ))}
        </div>

        <div className="resize" onMouseDown={handleMouseDown}></div>

        {validation?.text && <span className="har-validation-text">{validation.text}</span>}
      </div>

      {/* Dynamic List */}
      {dynamicList &&
        atRect &&
        ReactDOM.createPortal(
          <div
            ref={_harAliasPanel}
            className="har-alias-panel"
            style={{
              top: (_harIframe.current?.getBoundingClientRect().top ?? 0) + atRect.top + 20,
              left: (_harIframe.current?.getBoundingClientRect().left ?? 0) + atRect.left,
            }}
            onClick={() => {
              setAtRect(null);
            }}
          >
            <ul>
              {dynamicList &&
                dynamicList.render.items
                  // .filter((fItem) => !tagged.some((t: T) => JSON.stringify(fItem) === JSON.stringify(t)))
                  .filter((item) => {
                    const displayText = (item[dynamicList.render.display as keyof typeof item] as string) ?? "";

                    return displayText.toLowerCase().includes((filtered as string).toLowerCase());
                  })
                  .map((item, index) => (
                    <li
                      key={index}
                      onClick={(event) => {
                        event.stopPropagation();

                        const selection = iframeDocument?.getSelection();
                        const target = _target.current;

                        if (selection && selection.rangeCount > 0 && target && target.nodeType === Node.TEXT_NODE) {
                          const text = target.textContent ?? "";
                          const atIndex = text.lastIndexOf(dynamicList?.triggerKey ?? "@");

                          if (atIndex !== -1) {
                            const range = selection.getRangeAt(0).cloneRange();
                            range.setStart(target, atIndex);
                            range.setEnd(target, text.length);
                            range.deleteContents();

                            const itemText = (item[dynamicList.render.display as keyof typeof item] as string) ?? "";
                            const span = iframeDocument?.createElement("span");
                            const spaceNode = iframeDocument?.createTextNode(" \u200B");

                            if (span && spaceNode && iframeDocument) {
                              span.setAttribute("data-tag", `${itemText}`);

                              span.style.backgroundColor = "rgba(114, 15, 103, .1)";
                              span.style.padding = "0 5px";
                              span.style.borderRadius = "2px";
                              span.style.color = "#720f67";
                              span.style.fontWeight = "bold";
                              span.textContent = `@${itemText}`;

                              // Yeni bir wrapper fragment oluştur
                              const fragment = iframeDocument.createDocumentFragment();
                              fragment.appendChild(span);
                              fragment.appendChild(spaceNode); // görünmez boş node, ama yazılabilir

                              range.insertNode(fragment);

                              // Cursor'u spaceNode’un sonuna yerleştir
                              const newRange = iframeDocument.createRange();
                              newRange.setStart(spaceNode, spaceNode.length);
                              newRange.collapse(true);
                              selection.removeAllRanges();
                              selection.addRange(newRange);

                              // Focus zaten varsa sorun olmayacak
                              const activeEl = iframeDocument?.activeElement as HTMLElement;
                              activeEl?.focus();
                            }

                            setAtRect(null);
                            setTagged((prev) => {
                              const exists = prev.some((i) => JSON.stringify(i) === JSON.stringify(item));

                              return exists ? prev : [...prev, item];
                            });
                          }
                        }
                      }}
                    >
                      {(item[dynamicList.render.display as keyof typeof item] as string) ?? ""}
                    </li>
                  ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default TextEditor;
