import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { SANITIZE_CONFIG } from "./rich-text-editor.types";

export const useEditorRef = (value: string, onChange: (value: string) => void) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const sanitizedValue = DOMPurify.sanitize(value, SANITIZE_CONFIG);
      if (sanitizedValue !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = sanitizedValue;
      }
    }
  }, [value]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML, SANITIZE_CONFIG);
      onChange(sanitizedContent);
    }
  };

  return { editorRef, handleEditorChange };
};

export const useSelection = () => {
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range) {
        setSavedRange(range.cloneRange());
      }
    }
  };

  const restoreSelection = (editorRef: React.RefObject<HTMLDivElement>) => {
    if (savedRange && window.getSelection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange);
      editorRef.current?.focus();
    }
  };

  return { savedRange, setSavedRange, saveSelection, restoreSelection };
};

export const useFormatCommands = (
  editorRef: React.RefObject<HTMLDivElement>,
  savedRange: Range | null,
  setSavedRange: (range: Range | null) => void,
  restoreSelection: (ref: React.RefObject<HTMLDivElement>) => void,
  handleEditorChange: () => void
) => {
  const execCommand = (command: string, value: string | null = null) => {
    if (savedRange) {
      restoreSelection(editorRef);
    } else {
      editorRef.current?.focus();
    }

    document.execCommand(command, false, value || undefined);
    handleEditorChange();
    setSavedRange(null);
  };

  const isFormatActive = (format: string) => {
    return document.queryCommandState(format);
  };

  const isBlockFormatActive = (blockType: string) => {
    const currentBlock = document.queryCommandValue("formatBlock").toLowerCase();
    const cleanBlockType = blockType.replace(/[<>]/g, "").toLowerCase();
    return currentBlock === cleanBlockType;
  };

  const toggleFormat = (format: string) => {
    editorRef.current?.focus();
    execCommand(format);
  };

  const insertHeading = (level: number) => {
    editorRef.current?.focus();
    const currentBlock = document.queryCommandValue("formatBlock");
    if (currentBlock.toLowerCase() === `h${level}`) {
      execCommand("formatBlock", "<p>");
    } else {
      execCommand("formatBlock", `<h${level}>`);
    }
  };

  const toggleBlockFormat = (blockTag: string) => {
    editorRef.current?.focus();
    const cleanTag = blockTag.replace(/[<>]/g, "").toLowerCase();
    const currentBlock = document.queryCommandValue("formatBlock").toLowerCase();

    if (cleanTag === "p") {
      if (currentBlock === "p" || currentBlock === "") {
        execCommand("formatBlock", "<div>");
      } else {
        execCommand("formatBlock", "<p>");
      }
    } else {
      if (currentBlock === cleanTag) {
        execCommand("formatBlock", "<p>");
      } else {
        execCommand("formatBlock", blockTag);
      }
    }
  };

  const toggleList = (listType: "insertUnorderedList" | "insertOrderedList") => {
    editorRef.current?.focus();
    execCommand(listType);
  };

  return {
    execCommand,
    isFormatActive,
    isBlockFormatActive,
    toggleFormat,
    insertHeading,
    toggleBlockFormat,
    toggleList,
  };
};
