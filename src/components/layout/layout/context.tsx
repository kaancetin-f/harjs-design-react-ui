"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LAYOUT_MOBILE_QUERY, persistSiderPinned } from "./helpers";

export type LayoutSiderContextValue = {
  name?: string;
  siderId: string;
  isMobile: boolean;
  pinned: boolean;
  peeking: boolean;
  overlayOpen: boolean;
  expanded: boolean;
  setPinned: (next: boolean) => void;
  setPeeking: (next: boolean) => void;
  setOverlayOpen: (next: boolean) => void;
  toggleOverlay: () => void;
  closeOverlay: () => void;
  hydratePinned: (next: boolean) => void;
};

const LayoutSiderContext = createContext<LayoutSiderContextValue | null>(null);

export const useLayoutSider = () => useContext(LayoutSiderContext);

const useIsMobile = () => {
  // states
  const [isMobile, setIsMobile] = useState(false);

  // useEffects
  useEffect(() => {
    const media = window.matchMedia(LAYOUT_MOBILE_QUERY);
    const apply = () => setIsMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return isMobile;
};

export const LayoutSiderProvider = ({
  name,
  children,
}: {
  name?: string;
  children: React.ReactNode;
}) => {
  // refs
  const _hydrated = React.useRef(false);

  // states
  const [pinned, setPinnedState] = useState(true);
  const [peeking, setPeeking] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  // hooks
  const siderId = React.useId();
  const isMobile = useIsMobile();

  // methods
  const setPinned = useCallback(
    (next: boolean) => {
      setPinnedState(next);
      persistSiderPinned(next, name);
    },
    [name],
  );

  const hydratePinned = useCallback((next: boolean) => {
    // İlk hydrate'den sonra tekrar yazılmasına izin verme...
    if (_hydrated.current) return;
    _hydrated.current = true;
    setPinnedState(next);
  }, []);

  const closeOverlay = useCallback(() => setOverlayOpen(false), []);
  const toggleOverlay = useCallback(() => setOverlayOpen((open) => !open), []);

  // useEffects
  useEffect(() => {
    if (!isMobile) {
      setOverlayOpen(false);
      return;
    }
    // Mobilde hover peek kapat...
    setPeeking(false);
  }, [isMobile]);

  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeOverlay, overlayOpen]);

  useEffect(() => {
    if (!overlayOpen) return;
    const previous = document.body.style.overflow;
    // Overlay açıkken arka planın kaymasını engelle...
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  // variables
  const expanded = overlayOpen || (!isMobile && (pinned || peeking));

  const value = useMemo<LayoutSiderContextValue>(
    () => ({
      name,
      siderId,
      isMobile,
      pinned,
      peeking,
      overlayOpen,
      expanded,
      setPinned,
      setPeeking,
      setOverlayOpen,
      toggleOverlay,
      closeOverlay,
      hydratePinned,
    }),
    [
      closeOverlay,
      expanded,
      hydratePinned,
      isMobile,
      name,
      overlayOpen,
      peeking,
      pinned,
      setPinned,
      siderId,
      toggleOverlay,
    ],
  );

  return (
    <LayoutSiderContext.Provider value={value}>
      {children}
      {overlayOpen ? (
        <button
          type="button"
          className="har-sider-backdrop"
          aria-label="Close navigation"
          onClick={closeOverlay}
        />
      ) : null}
    </LayoutSiderContext.Provider>
  );
};
