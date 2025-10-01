import { Button } from "@/components/ui/button";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Underline,
} from "lucide-react";

interface ToolbarFormatButtonsProps {
  isFormatActive: (format: string) => boolean;
  isBlockFormatActive: (blockType: string) => boolean;
  toggleFormat: (format: string) => void;
  insertHeading: (level: number) => void;
  toggleBlockFormat: (blockTag: string) => void;
  toggleList: (listType: "insertUnorderedList" | "insertOrderedList") => void;
}

export const ToolbarFormatButtons = ({
  isFormatActive,
  isBlockFormatActive,
  toggleFormat,
  insertHeading,
  toggleBlockFormat,
  toggleList,
}: ToolbarFormatButtonsProps) => {
  return (
    <>
      <Button
        type="button"
        variant={isFormatActive("bold") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleFormat("bold");
        }}
        title="Paryškintas"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isFormatActive("italic") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleFormat("italic");
        }}
        title="Kursyvas"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isFormatActive("underline") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleFormat("underline");
        }}
        title="Pabrauktas"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <span className="w-px h-6 bg-border mx-1"></span>
      <Button
        type="button"
        variant={isBlockFormatActive("h1") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          insertHeading(1);
        }}
        title="Antraštė 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isBlockFormatActive("h2") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          insertHeading(2);
        }}
        title="Antraštė 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isBlockFormatActive("p") || isBlockFormatActive("div") ? "default" : "secondary"}
        size="sm"
        title="Pastraipa (normalus tekstas)"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockFormat("<p>");
        }}
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <span className="w-px h-6 bg-border mx-1"></span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleList("insertUnorderedList");
        }}
        title="Sąrašas"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleList("insertOrderedList");
        }}
        title="Numeruotas sąrašas"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isBlockFormatActive("blockquote") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockFormat("<blockquote>");
        }}
        title="Citata"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isBlockFormatActive("pre") ? "default" : "secondary"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockFormat("<pre>");
        }}
        title="Kodas"
      >
        <Code className="h-4 w-4" />
      </Button>
      <span className="w-px h-6 bg-border mx-1"></span>
    </>
  );
};
