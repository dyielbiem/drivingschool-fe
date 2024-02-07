"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CiCircleList } from "react-icons/ci";
import {
  MdFormatBold,
  MdOutlineFormatItalic,
  MdFormatListBulleted,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdFormatListNumbered
} from "react-icons/md";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import TextAlign from "@tiptap/extension-text-align";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const RichTextEditor = ({ editorAction, editorContent }) => {
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      })
    ],
    content: editorContent
  });

  if (!editor) {
    return <></>;
  }

  const handleSaveClick = async () => {
    setIsSaveLoading(true);
    const result = await editorAction(editor.getHTML());

    if (!result) setIsSaveLoading(false);
  };

  const handleCancelClick = () => {
    router.push(pathname);
  };

  const handleSubListClick = () => {
    if (!editor.can().sinkListItem("listItem")) {
      return editor.chain().focus().liftListItem("listItem").run();
    }

    editor.chain().focus().sinkListItem("listItem").run();
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-styling-btn-container">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "bg-white" : ""}
        >
          <LuHeading1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editor.isActive("heading", { level: 3 }) ? "bg-white" : ""}
        >
          <LuHeading2 />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-white" : ""}
        >
          <MdFormatBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-white" : ""}
        >
          <MdOutlineFormatItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-white" : ""}
        >
          <MdFormatListBulleted />
        </button>
        <button
          onClick={handleSubListClick}
          className={!editor.can().sinkListItem("listItem") ? "bg-white" : ""}
        >
          <CiCircleList />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-white" : ""}
        >
          <MdFormatListNumbered />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-white" : ""}
        >
          <MdFormatAlignLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "bg-white" : ""}
        >
          <MdFormatAlignCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-white" : ""}
        >
          <MdFormatAlignRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "bg-white" : ""
          }
        >
          <MdFormatAlignJustify />
        </button>
      </div>
      <EditorContent editor={editor} />
      <div className="editor-primary-btn-container">
        <button
          className="save-btn"
          onClick={handleSaveClick}
          disabled={isSaveLoading}
        >
          Save
        </button>
        <button className="cancel-btn" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
