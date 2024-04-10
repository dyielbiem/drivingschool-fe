import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import History from "@tiptap/extension-history";
import ImageGalleryModal from "./ImageGalleryModal";
import { useEditor, EditorContent } from "@tiptap/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiImageAddFill } from "react-icons/ri";
import { useEffect } from "react";

const QuestionEditor = ({ editorContent, onChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image"
        }
      })
    ],
    content: editorContent
  });

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

  const getImageURL = (imageURL) => {
    editor.chain().focus().setImage({ src: imageURL }).run();
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("select_image");
    currentParams.delete("upload_image");
    router.push(`${pathname}?${currentParams}`);
  };

  const addImageClick = () => {
    router.push(`${pathname}?${searchParams}&select_image=true`);
  };

  return (
    <div className="question-editor">
      <EditorContent editor={editor} />{" "}
      <button type="button" onClick={addImageClick}>
        <RiImageAddFill />
      </button>
      {(searchParams.get("select_image") === "true" ||
        searchParams.get("upload_image") === "true") && (
        <ImageGalleryModal onAddImage={getImageURL} />
      )}
    </div>
  );
};

export default QuestionEditor;
