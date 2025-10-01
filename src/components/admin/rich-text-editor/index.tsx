import { EditorContent } from "./editor-content";
import { useEditorRef, useFormatCommands, useSelection } from "./rich-text-editor.hooks";
import type { RichTextEditorProps } from "./rich-text-editor.types";
import { ToolbarFormatButtons } from "./toolbar/toolbar-format-buttons";
import { ToolbarMediaDialogs } from "./toolbar/toolbar-media-dialogs";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Įveskite turinį...",
}: RichTextEditorProps) => {
  const { editorRef, handleEditorChange } = useEditorRef(value, onChange);
  const { savedRange, setSavedRange, saveSelection, restoreSelection } = useSelection();
  const {
    execCommand,
    isFormatActive,
    isBlockFormatActive,
    toggleFormat,
    insertHeading,
    toggleBlockFormat,
    toggleList,
  } = useFormatCommands(editorRef, savedRange, setSavedRange, restoreSelection, handleEditorChange);

  return (
    <div className="border rounded-md overflow-hidden flex flex-col">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1 sticky top-0 z-10">
        <ToolbarFormatButtons
          isFormatActive={isFormatActive}
          isBlockFormatActive={isBlockFormatActive}
          toggleFormat={toggleFormat}
          insertHeading={insertHeading}
          toggleBlockFormat={toggleBlockFormat}
          toggleList={toggleList}
        />
        <ToolbarMediaDialogs execCommand={execCommand} saveSelection={saveSelection} />
      </div>

      <EditorContent
        editorRef={editorRef}
        placeholder={placeholder}
        handleEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default RichTextEditor;
