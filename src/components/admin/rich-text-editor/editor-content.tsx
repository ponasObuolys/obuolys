interface EditorContentProps {
  editorRef: React.RefObject<HTMLDivElement>;
  placeholder: string;
  handleEditorChange: () => void;
}

export const EditorContent = ({ editorRef, placeholder, handleEditorChange }: EditorContentProps) => {
  return (
    <>
      <div
        ref={editorRef}
        contentEditable={true}
        className="bg-background p-4 min-h-[300px] focus:outline-none prose dark:prose-invert max-w-none rich-text-editor-content flex-grow overflow-y-auto"
        style={{ direction: "ltr", textAlign: "left" }}
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        .rich-text-editor-content[contentEditable=true]:empty::before {
          content: attr(data-placeholder);
          color: #a1a1aa;
          position: absolute;
          pointer-events: none;
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
          overflow: hidden;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};
