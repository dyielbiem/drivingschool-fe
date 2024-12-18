"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import { Link } from "@tiptap/extension-link";
import { Extension } from "@tiptap/core";
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
  MdFormatIndentDecrease,
  MdOutlineLink,
  MdOutlineFormatUnderlined
} from "react-icons/md";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { RiImageAddFill } from "react-icons/ri";

import ImageGalleryModal from "./ImageGalleryModal";
import LinkURLForm from "./LinkURLForm";

const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      defaultIndent: "0%"
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

const PolicyEditor = ({
  editorContent = "",
  onSave = null,
  onCancel = null
}) => {
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isLinkURLVisible, setIsLinkURLVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Indent,
      Underline,
      TextAlign.configure({
        types: ["listItem", "heading", "paragraph"]
      }),
      Image.configure({
        inline: true
      }),
      Link.configure({
        openOnClick: false,
        autolink: true
      })
    ],
    content: editorContent
  });

  if (!editor) {
    return <></>;
  }

  const handleSetLink = (link) => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: link
      })
      .run();
  };

  const handleToggleLink = () => {
    const { view, state } = editor;
    const { from, to } = view.state.selection;
    const text = state.doc.textBetween(from, to, "");
    if (!editor.isActive("link") && !text) return;
    if (editor.isActive("link"))
      return editor.chain().focus().extendMarkRange("link").unsetLink().run();

    setIsLinkURLVisible(true);
  };

  const handleSubListClick = () => {
    if (!editor.can().sinkListItem("listItem")) {
      return editor.chain().focus().liftListItem("listItem").run();
    }

    editor.chain().focus().sinkListItem("listItem").run();
  };

  const handleIndentClick = () => {
    const indent = Number(
      editor.getAttributes("paragraph").indent?.slice(0, -1) ??
        editor.getAttributes("heading").indent?.slice(0, -1)
    );

    if (indent >= 40) return;

    editor
      .chain()
      .focus()
      .setIndentation(`${indent + 4}%`)
      .run();
  };

  const handleOutdentClick = () => {
    const indent = Number(
      editor.getAttributes("paragraph").indent?.slice(0, -1) ??
        editor.getAttributes("heading").indent?.slice(0, -1)
    );

    if (indent <= 0) return;

    editor
      .chain()
      .focus()
      .setIndentation(`${indent - 4}%`)
      .run();
  };

  const handleImageClick = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("select_image", "true");
    router.replace(`${pathname}?${currentParams}`);
  };

  const getImageURL = (imageURL) => {
    editor.chain().focus().setImage({ src: imageURL }).run();
    router.push(`${pathname}?edit_policy=true`);
  };

  const handleSaveClick = async () => {
    setIsSaveLoading(true);
    await onSave(editor.getHTML());
    router.replace(pathname);
  };

  return (
    <div className="policy-editor">
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
          className={editor.isActive("underline") ? "bg-white" : ""}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <MdOutlineFormatUnderlined />
        </button>
        <button
          className={editor.isActive("link") ? "bg-white" : ""}
          onClick={handleToggleLink}
        >
          <MdOutlineLink />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-white" : ""}
        >
          <MdFormatListBulleted />
        </button>
        <button
          onClick={handleSubListClick}
          className={
            !editor.can().sinkListItem("listItem") &&
            editor.isActive("bulletList")
              ? "bg-white"
              : ""
          }
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
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {(searchParams.get("select_image") === "true" ||
        searchParams.get("upload_image") === "true") && (
        <ImageGalleryModal onAddImage={getImageURL} />
      )}
      {isLinkURLVisible && (
        <LinkURLForm
          setIsVisible={setIsLinkURLVisible}
          formAction={handleSetLink}
        />
      )}
    </div>
  );
};

export default PolicyEditor;
