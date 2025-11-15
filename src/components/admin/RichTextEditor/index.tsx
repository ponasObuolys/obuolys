import isHotkey from "is-hotkey";
import React, { type KeyboardEvent, type PointerEvent, useCallback, useMemo } from "react";
import { type Descendant, Editor, Element as SlateElement, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  type RenderElementProps,
  type RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import { EditorButton, EditorIcon, EditorToolbar } from "./EditorComponents";
import type {
  CustomEditor,
  CustomElement,
  CustomElementType,
  CustomElementWithAlign,
  CustomTextKey,
} from "./custom-types.d";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const HOTKEYS: Record<string, CustomTextKey> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const TOOLTIP_LABELS: Record<string, string> = {
  bold: "Paryškinti (Ctrl+B)",
  italic: "Kursyvas (Ctrl+I)",
  underline: "Pabraukti (Ctrl+U)",
  code: "Kodas (Ctrl+`)",
  "heading-one": "Antraštė 1",
  "heading-two": "Antraštė 2",
  "block-quote": "Citata",
  "numbered-list": "Numeruotas sąrašas",
  "bulleted-list": "Sąrašas su ženkleliais",
  left: "Lygiuoti kairėje",
  center: "Lygiuoti centre",
  right: "Lygiuoti dešinėje",
  justify: "Lygiuoti abiejose pusėse",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Įveskite tekstą...",
  className,
}) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Parse initial value
  const initialValue = useMemo(() => {
    try {
      if (!value || value.trim() === "") {
        return getEmptyValue();
      }
      const parsed = JSON.parse(value) as Descendant[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : getEmptyValue();
    } catch {
      // If value is HTML string, convert to initial paragraph
      return [
        {
          type: "paragraph" as const,
          children: [{ text: value }],
        },
      ];
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const isAstChange = editor.operations.some(op => op.type !== "set_selection");
      if (isAstChange) {
        onChange(JSON.stringify(newValue));
      }
    },
    [editor, onChange]
  );

  return (
    <TooltipProvider>
      <div className={cn("border rounded-md bg-background", className)}>
        <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
          <EditorToolbar>
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />
            <div className="w-px h-6 bg-border mx-1" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" />
            <div className="w-px h-6 bg-border mx-1" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            <div className="w-px h-6 bg-border mx-1" />
            <BlockButton format="left" icon="format_align_left" />
            <BlockButton format="center" icon="format_align_center" />
            <BlockButton format="right" icon="format_align_right" />
            <BlockButton format="justify" icon="format_align_justify" />
          </EditorToolbar>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus
            className="min-h-[200px] p-4 focus:outline-none text-left"
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (isHotkey("shift+enter", event)) {
                event.preventDefault();
                Editor.insertText(editor, "\n");
                return;
              }

              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                  return; // Prevent event propagation after handling
                }
              }
            }}
          />
        </Slate>
      </div>
    </TooltipProvider>
  );
};

const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
  const isActive = isBlockActive(editor, format, isAlignType(format) ? "align" : "type");
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === "align" && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element) && element.align) {
    style.textAlign = element.align as AlignType;
  }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={style}
          {...attributes}
          className="border-l-4 border-primary pl-4 italic my-4"
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes} className="list-disc list-inside my-2">
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes} className="text-3xl font-bold my-4">
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes} className="text-2xl font-semibold my-3">
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes} className="my-1">
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes} className="list-decimal list-inside my-2">
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes} className="my-2">
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

interface BlockButtonProps {
  format: CustomElementFormat;
  icon: string;
}

const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  const tooltipLabel = TOOLTIP_LABELS[format] || format;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <EditorButton
          active={isBlockActive(editor, format, isAlignType(format) ? "align" : "type")}
          onPointerDown={(event: PointerEvent<HTMLButtonElement>) => event.preventDefault()}
          onClick={() => toggleBlock(editor, format)}
          data-test-id={`block-button-${format}`}
        >
          <EditorIcon>{icon}</EditorIcon>
        </EditorButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipLabel}</p>
      </TooltipContent>
    </Tooltip>
  );
};

interface MarkButtonProps {
  format: CustomTextKey;
  icon: string;
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate();
  const tooltipLabel = TOOLTIP_LABELS[format] || format;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <EditorButton
          active={isMarkActive(editor, format)}
          onPointerDown={(event: PointerEvent<HTMLButtonElement>) => event.preventDefault()}
          onClick={() => toggleMark(editor, format)}
        >
          <EditorIcon>{icon}</EditorIcon>
        </EditorButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipLabel}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const isAlignType = (format: CustomElementFormat): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (element: CustomElement): element is CustomElementWithAlign => {
  return "align" in element;
};

const getEmptyValue = (): Descendant[] => [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default RichTextEditor;
