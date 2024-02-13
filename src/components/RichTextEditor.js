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
  MdFormatListNumbered,
  MdFormatIndentIncrease,
  MdFormatIndentDecrease
} from "react-icons/md";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { RiImageAddFill } from "react-icons/ri";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Extension } from "@tiptap/core";
import ImageGalleryModal from "./ImageGalleryModal";

const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      defaultIndent: "0rem"
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndent,
            parseHTML: (element) =>
              element.style.marginLeft || this.options.defaultIndent,
            renderHTML: (attributes) => {
              if (attributes.indent === this.options.defaultIndent) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.indent}`
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setIndentation:
        (indentValue) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { indent: indentValue })
          );
        }
    };
  }
});

const RichTextEditor = ({ editorAction, editorContent }) => {
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Indent,
      TextAlign.configure({
        types: ["listItem", "heading", "paragraph"]
      }),
      Image.configure({
        inline: true
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

  const handleIndentClick = () => {
    const indent = Number(
      editor.getAttributes("paragraph").indent?.slice(0, -3) ??
        editor.getAttributes("heading").indent?.slice(0, -3)
    );

    if (indent >= 20) return;

    editor
      .chain()
      .focus()
      .setIndentation(`${indent + 2}rem`)
      .run();
  };

  const handleOutdentClick = () => {
    const indent = Number(
      editor.getAttributes("paragraph").indent?.slice(0, -3) ??
        editor.getAttributes("heading").indent?.slice(0, -3)
    );

    if (indent <= 0) return;

    editor
      .chain()
      .focus()
      .setIndentation(`${indent - 2}rem`)
      .run();
  };

  const handleImageClick = () => {
    router.push(`${pathname}?edit_content=true&select_image=true`);
  };

  const addImage = (imageURL) => {
    editor.chain().focus().setImage({ src: imageURL }).run();
    router.push(`${pathname}?edit_content=true`);
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
        <button onClick={handleOutdentClick}>
          <MdFormatIndentDecrease />
        </button>
        <button onClick={handleIndentClick}>
          <MdFormatIndentIncrease />
        </button>
        <button onClick={handleImageClick}>
          <RiImageAddFill />
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
      {(searchParams.get("select_image") === "true" ||
        searchParams.get("upload_image") === "true") && (
        <ImageGalleryModal addImage={addImage} />
      )}
    </div>
  );
};

export default RichTextEditor;
