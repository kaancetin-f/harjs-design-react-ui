import { useCallback, useLayoutEffect, type RefObject } from "react";

function useStickyColumns(contentRef: RefObject<HTMLDivElement | null>, remeasureKey: unknown) {
  const handleScroll = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const scrollLeft = content.scrollLeft;
    const maxScrollLeft = Math.max(0, content.scrollWidth - content.clientWidth);
    const isScrolledFromLeft = scrollLeft > 1;
    const isScrolledFromRight = scrollLeft < maxScrollLeft - 1;

    const updateStickyPositions = (elements: NodeListOf<HTMLTableRowElement>) => {
      let measuredLeftInset = 0;

      elements.forEach((element) => {
        const children = Array.from(element.childNodes).filter(
          (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE,
        );

        const leftChildren = children.filter((child) => child.dataset.stickyPosition === "left");
        const rightChildren = children.filter((child) => child.dataset.stickyPosition === "right").reverse();

        let leftOffset = 0;
        leftChildren.forEach((child, index) => {
          const baseZ = child.nodeName === "TH" ? 30 : 5;
          child.style.zIndex = String(baseZ + index);
          child.style.left = `${leftOffset}px`;
          child.classList.toggle("active-sticky", isScrolledFromLeft && index === leftChildren.length - 1);
          leftOffset += child.offsetWidth;
        });

        if (element.parentElement?.tagName === "THEAD" && leftOffset > measuredLeftInset) {
          measuredLeftInset = leftOffset;
        }

        let rightOffset = 0;
        rightChildren.forEach((child, index) => {
          const baseZ = child.nodeName === "TH" ? 30 : 5;
          child.style.zIndex = String(baseZ + index);
          child.style.right = `${rightOffset}px`;
          child.classList.toggle("active-sticky", isScrolledFromRight && index === rightChildren.length - 1);
          rightOffset += child.offsetWidth;
        });
      });

      return measuredLeftInset;
    };

    requestAnimationFrame(() => {
      const leftInset = updateStickyPositions(content.querySelectorAll<HTMLTableRowElement>("table > thead > tr"));
      updateStickyPositions(content.querySelectorAll<HTMLTableRowElement>("table > tbody > tr"));
      content.style.setProperty("--har-table-sticky-inset-left", `${leftInset}px`);
    });
  }, [contentRef]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    handleScroll();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => handleScroll());
    observer.observe(content);

    const table = content.querySelector("table");
    if (table) observer.observe(table);

    return () => observer.disconnect();
  }, [contentRef, handleScroll, remeasureKey]);

  return handleScroll;
}

export default useStickyColumns;
