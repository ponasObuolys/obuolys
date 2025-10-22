import type { BaseEditor, Descendant } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

export type HeadingOneElement = {
  type: "heading-one";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: "heading-two";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

export type NumberedListElement = {
  type: "numbered-list";
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

export type ListItemElement = {
  type: "list-item";
  children: Descendant[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement;

export type CustomElementType = CustomElement["type"];

export type CustomElementWithAlign =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement;

export type FormattedText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
  code?: true;
};

export type CustomTextKey = "bold" | "italic" | "underline" | "code";

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: FormattedText;
  }
}
