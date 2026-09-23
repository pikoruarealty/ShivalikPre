"use client";

import { useEffect, useState } from "react";

const protectedSelectionSelector = [
  ".hero",
  ".image-frame",
  ".display-heading",
  ".section-heading",
  ".section-label",
  ".numbers-list",
  ".feature-list",
  ".gallery-grid",
  ".lead-modal-visual",
].join(",");

function blocksInspectionShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  if (key === "f12") return true;
  if (event.ctrlKey && !event.altKey && (key === "u" || key === "s")) return true;
  if (event.ctrlKey && event.shiftKey && ["i", "j", "c", "k", "s"].includes(key)) return true;
  if (event.metaKey && !event.ctrlKey && (key === "u" || key === "s")) return true;
  return event.metaKey && event.altKey && ["i", "j", "c", "k"].includes(key);
}

export function FrontendDeterrent() {
  const [developerToolsLikelyOpen, setDeveloperToolsLikelyOpen] = useState(false);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => event.preventDefault();
    const preventInspectionShortcut = (event: KeyboardEvent) => {
      if (!blocksInspectionShortcut(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const preventImageDrag = (event: DragEvent) => {
      if (event.target instanceof Element && event.target.closest("img, picture")) event.preventDefault();
    };
    const preventProtectedCopy = (event: ClipboardEvent) => {
      const selection = window.getSelection();
      const node = selection?.anchorNode;
      const element = node instanceof Element ? node : node?.parentElement;
      if (element?.closest(protectedSelectionSelector)) event.preventDefault();
    };
    const detectDeveloperTools = () => {
      const desktopPointer = window.matchMedia("(pointer: fine)").matches;
      const widthDifference = Math.max(0, window.outerWidth - window.innerWidth);
      const heightDifference = Math.max(0, window.outerHeight - window.innerHeight);
      setDeveloperToolsLikelyOpen(desktopPointer && window.innerWidth >= 768 && (widthDifference > 240 || heightDifference > 240));
    };

    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("keydown", preventInspectionShortcut, true);
    document.addEventListener("dragstart", preventImageDrag, true);
    document.addEventListener("copy", preventProtectedCopy, true);
    window.addEventListener("resize", detectDeveloperTools, { passive: true });
    const detector = window.setInterval(detectDeveloperTools, 2_000);
    detectDeveloperTools();

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("keydown", preventInspectionShortcut, true);
      document.removeEventListener("dragstart", preventImageDrag, true);
      document.removeEventListener("copy", preventProtectedCopy, true);
      window.removeEventListener("resize", detectDeveloperTools);
      window.clearInterval(detector);
    };
  }, []);

  if (!developerToolsLikelyOpen) return null;
  return <div className="developer-tools-notice" role="status">Developer tools are intended for authorized diagnostics.</div>;
}
