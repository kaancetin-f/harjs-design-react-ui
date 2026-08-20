"use client";

import "../../../assets/css/components/form/text-editor/styles.css";
import { Icon } from "../../icons";
import { Icons } from "../../../libs/infrastructure/types";
import Button from "../button";
import IProps from "./IProps";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Utils from "../../../libs/infrastructure/shared/Utils";
import ReactDOM from "react-dom";
import Tooltip from "../../feedback/tooltip";
import {
  ALIAS_ITEM_HEIGHT,
  ALIAS_PANEL_MIN_WIDTH,
  ALIAS_VISIBLE_COUNT,
  calculateAliasPanelPosition,
  DEFAULT_TRIGGER_KEY,
  estimateAliasPanelHeight,
  filterAliasItems,
  getAliasWindow,
  getAvatarTone,
  getDisplayText,
  getInitials,
  getTriggerQuery,
  resolveAliasTokenColors,
  scrollIndexIntoView,
  splitMatchParts,
  wrapIndex,
} from "./helpers";

const applyIframeTheme = (doc: Document, aliasColor?: string) => {
  if (typeof document === "undefined") return;

  const rootStyles = getComputedStyle(document.documentElement);
  const color = rootStyles.getPropertyValue("--gray-800").trim() || "#1f2937";
  const fontFamily = rootStyles.getPropertyValue("--system").trim() || "sans-serif";
  const colorScheme = rootStyles.colorScheme?.trim() || "light";
  const token = resolveAliasTokenColors(aliasColor, (name) => rootStyles.getPropertyValue(name).trim());
  const head = doc.head ?? doc.documentElement.appendChild(doc.createElement("head"));
  let tag = doc.getElementById("har-text-editor-theme") as HTMLStyleElement | null;

  if (!tag) {
    tag = doc.createElement("style");
    tag.id = "har-text-editor-theme";
    head.appendChild(tag);
  }

  tag.textContent = `html{color-scheme:${colorScheme}}html,body{background-color:transparent;color:${color};caret-color:${color};font-family:${fontFamily}}span[data-tag]{display:inline;padding:0 .4em;border-radius:4px;background-color:color-mix(in srgb,${token.accent} 14%,transparent);color:${token.text};font-weight:600;white-space:nowrap}`;
};

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
  const _dynamicList = useRef(dynamicList);
  // refs -> Alias Panel
  const _target = useRef<Node | null>(null);
  const _harAliasPanel = useRef<HTMLDivElement>(null);
  const _harAliasList = useRef<HTMLDivElement>(null);
  const _aliasOpen = useRef(false);
  const _aliasQuery = useRef("");
  const _aliasFrame = useRef(0);
  const _aliasScrollFrame = useRef(0);
  const _navigationIndex = useRef(0);
  const _filteredItems = useRef<T[]>([]);
  const _insertAliasItem = useRef<(item: T) => void>(() => undefined);
  const _closeAliasPanel = useRef<() => void>(() => undefined);
  const _syncAliasPanel = useRef<() => void>(() => undefined);

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
  const [navigationIndex, setNavigationIndex] = useState(0);
  const [aliasScrollTop, setAliasScrollTop] = useState(0);
  const [aliasPos, setAliasPos] = useState<{ top: number; left: number; placement: "top" | "bottom" } | null>(null);
  const [aliasReady, setAliasReady] = useState(false);

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
  const triggerKey = dynamicList?.triggerKey ?? DEFAULT_TRIGGER_KEY;
  const filteredItems = useMemo(() => {
    if (!dynamicList || filtered == null) return [] as T[];
    return filterAliasItems(dynamicList.render?.items, dynamicList.render?.display, filtered);
  }, [dynamicList, filtered]);
  const aliasWindow = useMemo(
    () => getAliasWindow(filteredItems.length, aliasScrollTop),
    [filteredItems.length, aliasScrollTop],
  );
  const visibleItems = useMemo(() => {
    const list = Array.isArray(filteredItems) ? filteredItems : [];
    return list.slice(aliasWindow.start, aliasWindow.end);
  }, [filteredItems, aliasWindow.start, aliasWindow.end]);
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

  _dynamicList.current = dynamicList;
  _filteredItems.current = filteredItems;
  _navigationIndex.current = navigationIndex;

  // methods
  const execCommand = (command: string) => {
    if (disabled || !_harIframe.current) return;

    const iframeDoc = _harIframe.current.contentDocument || _harIframe.current.contentWindow?.document;
    if (iframeDoc) iframeDoc.execCommand(command, true, undefined);
  };

  const handleFocus = () => _harIframe.current?.classList.add("focused");

  const handleBlur = () => {
    _harIframe.current?.classList.remove("focused");
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

  const closeAliasPanel = useCallback(() => {
    if (!_aliasOpen.current) return;

    _aliasOpen.current = false;
    _aliasQuery.current = "";
    _target.current = null;
    setAtRect(null);
    setFiltered(null);
    setNavigationIndex(0);
    setAliasScrollTop(0);
    setAliasPos(null);
    setAliasReady(false);
  }, []);

  const insertAliasItem = useCallback(
    (item: T) => {
      const list = _dynamicList.current;
      const iframeDoc = _harIframe.current?.contentDocument || iframeDocument;
      if (!list || !iframeDoc) return;

      const selection = iframeDoc.getSelection();
      const node =
        selection?.anchorNode && selection.anchorNode.nodeType === Node.TEXT_NODE
          ? selection.anchorNode
          : _target.current;

      if (!selection || selection.rangeCount === 0 || !node || node.nodeType !== Node.TEXT_NODE) return;

      const text = node.textContent ?? "";
      const trigger = list.triggerKey ?? DEFAULT_TRIGGER_KEY;
      const match = getTriggerQuery(text, trigger);
      if (!match) return;

      const range = selection.getRangeAt(0).cloneRange();
      range.setStart(node, match.atIndex);
      range.setEnd(node, match.atIndex + trigger.length + match.query.length);
      range.deleteContents();

      const itemText = getDisplayText(item, list.render.display);
      const span = iframeDoc.createElement("span");
      const spaceNode = iframeDoc.createTextNode(" \u200B");

      span.setAttribute("data-tag", itemText);
      span.className = "har-alias-token";
      span.textContent = `${trigger}${itemText}`;

      const fragment = iframeDoc.createDocumentFragment();
      fragment.appendChild(span);
      fragment.appendChild(spaceNode);
      range.insertNode(fragment);

      const next = iframeDoc.createRange();
      next.setStart(spaceNode, spaceNode.length);
      next.collapse(true);
      selection.removeAllRanges();
      selection.addRange(next);
      (iframeDoc.activeElement as HTMLElement | null)?.focus();

      closeAliasPanel();
      setTagged((prev) => {
        if (prev.some((entry) => getDisplayText(entry, list.render.display) === itemText)) return prev;
        return [...prev, item];
      });
    },
    [closeAliasPanel, iframeDocument],
  );

  const syncAliasPanel = useCallback(() => {
    const list = _dynamicList.current;
    const iframeDoc = _harIframe.current?.contentDocument;

    if (!list) {
      closeAliasPanel();
      return;
    }

    if (_disabled.current || !iframeDoc) {
      closeAliasPanel();
      return;
    }

    const selection = iframeDoc.getSelection();
    if (!selection || selection.rangeCount === 0) {
      closeAliasPanel();
      return;
    }

    const node = selection.anchorNode;
    const parent = node instanceof HTMLElement ? node : node?.parentElement;

    if (!node || node.nodeType !== Node.TEXT_NODE || parent?.dataset?.tag) {
      closeAliasPanel();
      return;
    }

    const text = node.textContent ?? "";
    const match = getTriggerQuery(text, list.triggerKey ?? DEFAULT_TRIGGER_KEY);

    if (!match) {
      closeAliasPanel();
      return;
    }

    const range = selection.getRangeAt(0).cloneRange();
    try {
      range.setStart(node, match.atIndex);
      range.collapse(true);
    } catch {
      range.collapse(true);
    }

    const rect = range.getBoundingClientRect();
    const queryChanged = _aliasQuery.current !== match.query;

    _target.current = node;
    _aliasOpen.current = true;
    _aliasQuery.current = match.query;
    setAtRect(rect);
    setFiltered(match.query);

    if (queryChanged) {
      _navigationIndex.current = 0;
      setNavigationIndex(0);
      setAliasScrollTop(0);
      if (_harAliasList.current) _harAliasList.current.scrollTop = 0;
    }
  }, [closeAliasPanel]);

  _insertAliasItem.current = insertAliasItem;
  _closeAliasPanel.current = closeAliasPanel;
  _syncAliasPanel.current = syncAliasPanel;

  const scheduleAliasSync = () => {
    if (typeof window === "undefined" || !_dynamicList.current) return;
    if (_aliasFrame.current) return;

    _aliasFrame.current = window.requestAnimationFrame(() => {
      _aliasFrame.current = 0;
      _syncAliasPanel.current();
    });
  };

  // methods -> Alias Panel
  const handleEditorKeydown = (event: KeyboardEvent) => {
    if (event.isComposing) return;

    const list = _dynamicList.current;
    if (_aliasOpen.current) {
      const key = event.key;
      const count = _filteredItems.current.length;

      if (key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        setNavigationIndex((prev) => {
          const next = wrapIndex(key === "ArrowDown" ? prev + 1 : prev - 1, count);
          _navigationIndex.current = next;
          return next;
        });
        return;
      }

      if (key === "Enter" || key === "Tab") {
        const item = _filteredItems.current[_navigationIndex.current];
        if (!item) return;
        event.preventDefault();
        _insertAliasItem.current(item);
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        _closeAliasPanel.current();
        return;
      }
    }

    if (!list) return;

    const key = event.key;
    if (key !== "Backspace" && key !== "Delete") return;

    const selection = _harIframe.current?.contentDocument?.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const contents = range.cloneContents();
    const multiSpans = contents.querySelectorAll("span[data-tag]");
    const display = list.render.display;

    if (multiSpans.length > 0) {
      event.preventDefault();

      const tagsToRemove: string[] = [];
      multiSpans.forEach((span) => {
        const tag = span.getAttribute("data-tag");
        if (tag) tagsToRemove.push(tag);
      });

      range.deleteContents();
      setTagged((prev) => prev.filter((item) => !tagsToRemove.includes(getDisplayText(item, display))));
      return;
    }

    const node = selection.anchorNode;
    const container = (node as HTMLElement | null)?.parentElement;

    if (container?.tagName === "SPAN" && container.dataset.tag) {
      event.preventDefault();
      const tag = container.dataset.tag ?? "";
      container.remove();
      setTagged((prev) => prev.filter((item) => getDisplayText(item, display) !== tag));
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
    applyIframeTheme(_iframeDocument, _dynamicList.current?.color);

    // Herhangi bir değişikliği izlemek için MutationObserver kullan
    const observer = new MutationObserver(() => {
      if (_disabled.current) return;
      if (_onChangeTimeOut.current) clearTimeout(_onChangeTimeOut.current);

      _onChangeTimeOut.current = setTimeout(() => {
        _iframeDocument.body.innerHTML === "<br>"
          ? _onChange.current(undefined)
          : _onChange.current(_iframeDocument.body.innerHTML);
      }, 500);
    });

    // Observer'ı body üzerinde başlat
    observer.observe(_iframeDocument.body, { childList: true, subtree: true, characterData: true });

    _iframeDocument.body.addEventListener("focus", handleFocus);
    _iframeDocument.body.addEventListener("blur", handleBlur);
    _iframeDocument.body.addEventListener("input", scheduleAliasSync);
    _iframeDocument.addEventListener("selectionchange", scheduleAliasSync);
    _iframeDocument.body.addEventListener("keydown", handleEditorKeydown);

    return () => {
      observer.disconnect();

      _iframeDocument.body.removeEventListener("focus", handleFocus);
      _iframeDocument.body.removeEventListener("blur", handleBlur);
      _iframeDocument.body.removeEventListener("input", scheduleAliasSync);
      _iframeDocument.removeEventListener("selectionchange", scheduleAliasSync);
      _iframeDocument.body.removeEventListener("keydown", handleEditorKeydown);

      if (_aliasFrame.current) {
        window.cancelAnimationFrame(_aliasFrame.current);
        _aliasFrame.current = 0;
      }
    };
  }, [iframe]);

  useEffect(() => {
    if (!iframeDocument) return;
    iframeDocument.designMode = disabled ? "off" : "on";
  }, [disabled, iframeDocument]);

  useEffect(() => {
    if (!iframeDocument) return;

    const applyTheme = () => applyIframeTheme(iframeDocument, _dynamicList.current?.color);

    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", applyTheme);
    };
  }, [iframeDocument, dynamicList?.color]);

  useEffect(() => {
    dynamicList?.onTagged && dynamicList?.onTagged(tagged);
  }, [tagged]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      if (navigationIndex !== 0) {
        _navigationIndex.current = 0;
        setNavigationIndex(0);
      }
      return;
    }

    if (navigationIndex < filteredItems.length) return;

    const next = filteredItems.length - 1;
    _navigationIndex.current = next;
    setNavigationIndex(next);
  }, [filteredItems.length, navigationIndex]);

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

  useEffect(() => {
    if (!atRect) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (_harAliasPanel.current?.contains(target)) return;
      if (_harIframe.current?.contains(target)) return;
      _closeAliasPanel.current();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [atRect]);

  useLayoutEffect(() => {
    const list = _harAliasList.current;
    if (!list || !atRect) return;

    const nextTop = scrollIndexIntoView(list.scrollTop, navigationIndex, list.clientHeight);
    if (nextTop !== list.scrollTop) list.scrollTop = nextTop;
  }, [navigationIndex, atRect]);

  useLayoutEffect(() => {
    if (!atRect || !_harAliasPanel.current || !_harIframe.current) {
      setAliasReady(false);
      return;
    }

    const panelRect = _harAliasPanel.current.getBoundingClientRect();
    const iframeRect = _harIframe.current.getBoundingClientRect();
    const next = calculateAliasPanelPosition({
      caret: {
        top: atRect.top,
        left: atRect.left,
        bottom: atRect.bottom,
        height: atRect.height,
      },
      iframe: { top: iframeRect.top, left: iframeRect.left },
      panel: {
        width: Math.max(panelRect.width, ALIAS_PANEL_MIN_WIDTH),
        height: panelRect.height || estimateAliasPanelHeight(filteredItems.length),
      },
      viewport: { width: window.innerWidth, height: window.innerHeight },
    });

    setAliasPos((prev) =>
      prev && prev.top === next.top && prev.left === next.left && prev.placement === next.placement ? prev : next,
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAliasReady(true);
      return;
    }

    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setAliasReady(true));
    });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [atRect, filteredItems.length]);

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

      {dynamicList &&
        atRect &&
        ReactDOM.createPortal(
          <div
            ref={_harAliasPanel}
            className={[
              "har-alias-panel",
              aliasPos?.placement === "top" ? "is-top" : "is-bottom",
              aliasReady ? "is-ready" : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            role="listbox"
            aria-label="Mentions"
            aria-activedescendant={
              filteredItems[navigationIndex] ? `har-alias-option-${navigationIndex}` : undefined
            }
            style={{
              top: aliasPos?.top ?? 0,
              left: aliasPos?.left ?? 0,
              minWidth: ALIAS_PANEL_MIN_WIDTH,
            }}
          >
            <div className="har-alias-panel__header">
              <span className="har-alias-panel__query">
                {triggerKey}
                {filtered}
              </span>
              <span className="har-alias-panel__count">{filteredItems.length}</span>
            </div>

            {filteredItems.length > 0 ? (
              <div
                ref={_harAliasList}
                className="har-alias-panel__list"
                style={{ maxHeight: ALIAS_VISIBLE_COUNT * ALIAS_ITEM_HEIGHT }}
                onScroll={(event) => {
                  const top = event.currentTarget.scrollTop;
                  if (_aliasScrollFrame.current) window.cancelAnimationFrame(_aliasScrollFrame.current);
                  _aliasScrollFrame.current = window.requestAnimationFrame(() => {
                    _aliasScrollFrame.current = 0;
                    setAliasScrollTop(top);
                  });
                }}
              >
                <div className="har-alias-panel__spacer" style={{ height: aliasWindow.height }}>
                  <div className="har-alias-panel__window" style={{ transform: `translateY(${aliasWindow.offsetTop}px)` }}>
                    {visibleItems.map((item, offset) => {
                      const index = aliasWindow.start + offset;
                      const displayText = getDisplayText(item, dynamicList.render.display);
                      const tone = getAvatarTone(displayText);
                      const isActive = index === navigationIndex;

                      return (
                        <div
                          key={`${displayText}-${index}`}
                          id={`har-alias-option-${index}`}
                          role="option"
                          aria-selected={isActive}
                          className={["har-alias-panel__option", isActive ? "is-active" : undefined]
                            .filter(Boolean)
                            .join(" ")}
                          style={{ height: ALIAS_ITEM_HEIGHT }}
                          onMouseEnter={() => {
                            _navigationIndex.current = index;
                            setNavigationIndex(index);
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            insertAliasItem(item);
                          }}
                        >
                          <span className={`har-alias-panel__avatar is-${tone}`} aria-hidden="true">
                            {getInitials(displayText)}
                          </span>
                          <span className="har-alias-panel__label">
                            {splitMatchParts(displayText, filtered ?? "").map((part, partIndex) =>
                              part.match ? (
                                <span key={`${index}-m-${partIndex}`} className="har-alias-panel__match">
                                  {part.text}
                                </span>
                              ) : (
                                <span key={`${index}-t-${partIndex}`}>{part.text}</span>
                              ),
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="har-alias-panel__empty">No matches</div>
            )}

            <div className="har-alias-panel__hint">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>esc Close</span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default TextEditor;
