"use client";
import { useChapterIndex, useSubChapterIndex } from "@/state/store";
import adminFetchSubChapterByID from "@/services/api/adminFetchSubChapterByID";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import adminUpdateSubChapterContent from "@/services/api/adminUpdateSubChapterContent";

const SubChapterID = ({ params }) => {
  const { chapterIndex } = useChapterIndex();
  const { subChapterIndex } = useSubChapterIndex();
  const [subChapter, setSubChapter] = useState(null);
  const [subChapterContent, setSubChapterContent] = useState(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchSubChapter = async () => {
      const response = await adminFetchSubChapterByID(params.subChapterID);
      if (!response.ok) return;

      setSubChapter(response.json);
      setSubChapterContent(response.json.subChapterContent);
    };

    fetchSubChapter();
  }, [params.subChapterID]);

  const handleEditContentClick = () => {
    router.push(pathname + "?edit_content=true");
  };

  const renderSubChapter = () => {
    if (!subChapter || subChapterIndex === undefined) return <></>;
    return (
      <div className="header">
        <h1>
          Chapter {chapterIndex + 1}.{subChapterIndex + 1}.{" "}
          {subChapter.subChapterTitle}
        </h1>
        {searchParams.get("edit_content") !== "true" && (
          <button onClick={handleEditContentClick}>Edit Content</button>
        )}
      </div>
    );
  };

  const updateSubChapterContent = async (subChapterContent) => {
    if (!subChapter) return null;
    const response = await adminUpdateSubChapterContent(
      subChapter.subChapterID,
      subChapterContent
    );
    if (!response.ok) return null;

    setSubChapter(response.json);
    setSubChapterContent(response.json.subChapterContent);
    router.push(pathname);

    return response;
  };

  const renderRichTextEditor = () => {
    if (
      subChapterIndex === undefined ||
      !subChapter ||
      searchParams.get("edit_content") !== "true"
    )
      return <></>;
    return (
      <RichTextEditor
        editorAction={updateSubChapterContent}
        editorContent={subChapterContent}
      />
    );
  };

  const renderSubChapterContent = () => {
    if (!subChapterContent || searchParams.get("edit_content") === "true")
      return <></>;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: subChapterContent }}
        className="section-content-container"
      />
    );
  };

  return (
    <section className="admin-sub-chapter-section">
      {renderSubChapter()}
      {renderRichTextEditor()}
      {renderSubChapterContent()}
    </section>
  );
};

export default SubChapterID;
