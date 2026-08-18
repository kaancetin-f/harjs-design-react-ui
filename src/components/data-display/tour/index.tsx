"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@harjs/translation";
import IProps from "./IProps";
import "../../../assets/css/components/data-display/tour/styles.css";
import Button from "../../form/button";
import Typography from "../typography";
import ITourLocale from "../../../libs/core/application/locales/tour/ITourLocale";
import TourTR from "../../../libs/core/application/locales/tour/tr";
import TourEN from "../../../libs/core/application/locales/tour/en";
import {
  clampTourStep,
  collectScrollParents,
  getTourNavState,
  getTourStorageKey,
  readTourSeen,
  resolveTourTarget,
  scrollTourTargetIntoView,
  shouldAutoOpenTour,
  writeTourSeen,
} from "./helpers";
import {
  TOUR_SPOTLIGHT_PADDING,
  TOUR_VIEWPORT_PADDING,
  calculateTourPosition,
  getSpotlightRect,
  getTourPanelFallbackPosition,
  intersectBoxes,
  rectToBox,
  type TourPlacement,
} from "./position";

const { Title, Paragraph } = Typography;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const EXIT_MS = 180;

const visibleFocusable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((node) => node.getClientRects().length > 0);

const Tour: React.FC<IProps> = ({
  steps = [],
  open,
  currentStep,
  onChange,
  onSkip,
  onFinish,
  name,
  disableCloseOnEsc,
  labels,
  config,
}) => {
  // refs
  const _panel = useRef<HTMLDivElement>(null);
  const _spotlight = useRef<HTMLDivElement>(null);
  const _previousFocus = useRef<HTMLElement | null>(null);
  const _positionFrame = useRef(0);
  const _step = useRef(steps[0]);
  const _onChange = useRef(onChange);
  const _onSkip = useRef(onSkip);
  const _onFinish = useRef(onFinish);
  const _close = useRef<(reason: "skip" | "finish") => void>(() => {});

  _onChange.current = onChange;
  _onSkip.current = onSkip;
  _onFinish.current = onFinish;

  // hooks
  const uid = useId();
  const { t } = useTranslation<ITourLocale>(String(config?.locale ?? "tr"), {
    tr: { ...TourTR },
    en: { ...TourEN },
  });

  const nextLabel = labels?.next ?? t("Tour.Button.Next");
  const previousLabel = labels?.previous ?? t("Tour.Button.Previous");
  const skipLabel = labels?.skip ?? t("Tour.Button.Skip");
  const finishLabel = labels?.finish ?? t("Tour.Button.Finish");
  const stepLabel = labels?.step ?? t("Tour.Step");

  // variables
  const stepCount = steps.length;
  const isOpenControlled = Boolean(open);
  const isStepControlled = typeof currentStep === "number";
  const once = config?.once ?? true;
  const padding = config?.padding ?? TOUR_SPOTLIGHT_PADDING;
  const storageKey = name ? getTourStorageKey(name) : "";
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;

  // states
  const [internalOpen, setInternalOpen] = useState(() => Boolean(open?.get));
  const [internalStep, setInternalStep] = useState(() => clampTourStep(currentStep ?? 0, stepCount));
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [exited, setExited] = useState(true);
  const [placement, setPlacement] = useState<TourPlacement>("bottom");
  const [hasTarget, setHasTarget] = useState(false);

  // variables
  const isOpen = isOpenControlled ? Boolean(open?.get) : internalOpen;
  const activeStep = clampTourStep(isStepControlled ? (currentStep ?? 0) : internalStep, stepCount);
  const current = steps[activeStep];
  const nav = getTourNavState(activeStep, stepCount);
  const visible = isOpen || !exited;
  _step.current = current;

  // methods
  const setOpenState = useCallback(
    (next: boolean) => {
      if (open) {
        open.set(next);
        return;
      }
      setInternalOpen(next);
    },
    [open],
  );

  const persistSeen = useCallback(() => {
    if (!name || !storageKey) return;
    writeTourSeen(storageKey);
  }, [name, storageKey]);

  const commitStep = useCallback(
    (step: number) => {
      const next = clampTourStep(step, stepCount);
      if (next === activeStep) return;
      if (!isStepControlled) setInternalStep(next);
      _onChange.current?.(next);
    },
    [activeStep, isStepControlled, stepCount],
  );

  const dismiss = useCallback(
    (reason: "skip" | "finish") => {
      persistSeen();
      setOpenState(false);
      if (reason === "finish") _onFinish.current?.();
      else _onSkip.current?.();
    },
    [persistSeen, setOpenState],
  );
  _close.current = dismiss;

  const updateLayout = useCallback(() => {
    const panel = _panel.current;
    if (!panel || typeof window === "undefined") return;

    const step = _step.current;
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const panelRect = panel.getBoundingClientRect();
    const panelSize = { width: panelRect.width, height: panelRect.height };
    const target = resolveTourTarget(step?.target);
    const spotlightNode = _spotlight.current;

    if (!target) {
      const fallback = getTourPanelFallbackPosition(panelSize, viewport);
      panel.style.top = `${fallback.top}px`;
      panel.style.left = `${fallback.left}px`;
      if (spotlightNode) {
        spotlightNode.style.top = "0px";
        spotlightNode.style.left = "0px";
        spotlightNode.style.width = "0px";
        spotlightNode.style.height = "0px";
      }
      setHasTarget(false);
      return;
    }

    const targetRect = rectToBox(target.getBoundingClientRect());
    let visible = getSpotlightRect(targetRect, padding);

    for (const parent of collectScrollParents(target)) {
      const clipped = intersectBoxes(visible, rectToBox(parent.getBoundingClientRect()));
      if (!clipped) {
        visible = getSpotlightRect(targetRect, padding);
        break;
      }
      visible = clipped;
    }

    const viewportClip = intersectBoxes(visible, {
      top: 0,
      left: 0,
      width: viewport.width,
      height: viewport.height,
      right: viewport.width,
      bottom: viewport.height,
    });
    if (viewportClip) visible = viewportClip;

    const next = calculateTourPosition({
      triggerRect: visible,
      panelRect: panelSize,
      placement: step?.placement ?? "bottom",
      viewport,
    });

    if (spotlightNode) {
      spotlightNode.style.top = `${visible.top}px`;
      spotlightNode.style.left = `${visible.left}px`;
      spotlightNode.style.width = `${visible.width}px`;
      spotlightNode.style.height = `${visible.height}px`;
    }

    panel.style.top = `${next.top}px`;
    panel.style.left = `${next.left}px`;
    setHasTarget(true);
    setPlacement((prev) => (prev === next.placement ? prev : next.placement));
  }, [padding]);

  const scheduleLayout = useCallback(() => {
    if (typeof window === "undefined") return;
    if (_positionFrame.current) return;

    _positionFrame.current = window.requestAnimationFrame(() => {
      _positionFrame.current = 0;
      updateLayout();
    });
  }, [updateLayout]);

  // useEffects
  useEffect(() => {
    setMounted(true);

    // Hedef DOM ve localStorage ancak istemcide hazır; hydration kaymasını önlemek için turu mount sonrası aç.
    if (isOpenControlled) return;
    if (!name) {
      setInternalOpen(true);
      return;
    }
    setInternalOpen(shouldAutoOpenTour({ once, seen: readTourSeen(storageKey) }));
    // İlk açılış kararı yalnızca mount'ta alınır.
  }, []);

  useEffect(() => {
    if (isOpen) {
      setExited(false);
      return;
    }

    setEntered(false);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setExited(true);
      return;
    }

    const timeout = window.setTimeout(() => setExited(true), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    _previousFocus.current = document.activeElement as HTMLElement | null;

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const root = _panel.current;
        if (!root) return;
        const nodes = visibleFocusable(root);
        if (nodes.length === 0) {
          event.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (disableCloseOnEsc) return;
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      _close.current("skip");
    };

    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
      _previousFocus.current?.focus({ preventScroll: true });
    };
  }, [isOpen, disableCloseOnEsc]);

  useEffect(() => {
    if (!isOpen || !entered) return;
    const focusable = _panel.current ? visibleFocusable(_panel.current)[0] : undefined;
    (focusable ?? _panel.current)?.focus({ preventScroll: true });
  }, [isOpen, entered, activeStep]);

  useLayoutEffect(() => {
    if (!isOpen || !mounted || typeof window === "undefined") return;

    const target = resolveTourTarget(current?.target);
    if (target) scrollTourTargetIntoView(target, TOUR_VIEWPORT_PADDING);

    updateLayout();

    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setEntered(true));
    });

    const panel = _panel.current;
    const observer = panel && typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => scheduleLayout()) : null;
    if (panel && observer) observer.observe(panel);
    if (target && observer) observer.observe(target);

    window.addEventListener("resize", scheduleLayout);
    window.addEventListener("scroll", scheduleLayout, { capture: true, passive: true });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
      if (_positionFrame.current) {
        window.cancelAnimationFrame(_positionFrame.current);
        _positionFrame.current = 0;
      }
      observer?.disconnect();
      window.removeEventListener("resize", scheduleLayout);
      window.removeEventListener("scroll", scheduleLayout, true);
    };
  }, [isOpen, mounted, activeStep, current?.target, current?.placement, updateLayout, scheduleLayout]);

  if (stepCount === 0) return null;
  if (!mounted || !visible) return null;

  const layerClass = ["har-tour", entered ? "is-entered" : undefined].filter(Boolean).join(" ");
  const panelClass = ["har-tour-panel", hasTarget ? placement : "is-fallback", entered ? "is-entered" : undefined]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div className={layerClass} aria-hidden={!isOpen}>
      <div className={["har-tour-blocker", hasTarget ? undefined : "is-fallback"].filter(Boolean).join(" ")} />

      <div
        ref={_spotlight}
        className={["har-tour-spotlight", hasTarget ? undefined : "is-hidden"].filter(Boolean).join(" ")}
        aria-hidden
      />

      <div
        ref={_panel}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={current?.title ? titleId : undefined}
        aria-describedby={current?.description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="sr-only" aria-live="polite">
          {stepLabel} {activeStep + 1} {t("Tour.Of")} {stepCount}
          {current?.title ? `, ${current.title}` : ""}
        </div>

        <div className="header">
          <span className="progress">
            {activeStep + 1} {t("Tour.Of")} {stepCount}
          </span>
          {current?.title ? (
            <Title id={titleId} size="md">
              {current.title}
            </Title>
          ) : null}
        </div>

        {current?.description ? (
          <Paragraph id={descriptionId} className="description" size="sm">
            {current.description}
          </Paragraph>
        ) : null}

        <div className="footer">
          {nav.showSkip ? (
            <Button variant="borderless" color="gray" size="sm" onClick={() => dismiss("skip")}>
              {skipLabel}
            </Button>
          ) : null}

          <div className="actions">
            {nav.showPrevious ? (
              <Button variant="outlined" color="gray" size="sm" onClick={() => commitStep(activeStep - 1)}>
                {previousLabel}
              </Button>
            ) : null}

            {nav.showNext ? (
              <Button color="blue" size="sm" onClick={() => commitStep(activeStep + 1)}>
                {nextLabel}
              </Button>
            ) : null}

            {nav.showFinish ? (
              <Button color="blue" size="sm" onClick={() => dismiss("finish")}>
                {finishLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

Tour.displayName = "Tour";

export default Tour;
