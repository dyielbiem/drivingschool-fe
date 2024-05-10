import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Bold from "@tiptap/extension-bold";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";

const EmailBodyEditor = ({ editorContent, onChange, isEditable }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      History,
      Bold,
      Paragraph.configure({
        HTMLAttributes: {
          style:
            "margin: 0; min-height: 1.25em; font-size: 0.875rem; min-height: 1em;"
        }
      })
    ],
    content: editorContent
  });

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({ editable: isEditable });

    if (!isEditable) editor.commands.setContent(editorContent);
  }, [editor, editorContent, isEditable]);

  useEffect(() => {
    if (!editor) return;
    const onUpdate = ({ editor }) => {
      if (editor.getHTML() === "<p></p>") return onChange("");
      onChange(editor.getHTML());
    };
    editor.on("update", onUpdate);

    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor, onChange]);

  return (
    <div className="email-body-editor" disabled={!isEditable}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default EmailBodyEditor;
