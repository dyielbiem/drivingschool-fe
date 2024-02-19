"use client";
import { useChapterIndex } from "@/state/store";
import { useEffect, useState } from "react";
import adminFetchChapterByID from "@/services/api/adminFetchChapterByID";
import Link from "next/link";
import { useSubChapters } from "@/state/store";
import AddSubChapterForm from "@/components/AddSubChapterForm";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import adminUpdateChapterContent from "@/services/api/adminUpdateChapterContent";
import { useChapterTestQuestions } from "@/state/store";

const ChapterID = ({ params }) => {
  const [chapter, setChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const { chapterTestQuestions } = useChapterTestQuestions();
  const { subChapters, setSubChapters } = useSubChapters();
  const { chapterIndex } = useChapterIndex();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchChapter = async () => {
      const chapterResponse = await adminFetchChapterByID(params.chapterID);
      if (!chapterResponse?.ok) return;
      setChapter(chapterResponse?.json);
      setChapterContent(chapterResponse?.json?.chapterContent);
    };

    fetchChapter();
  }, [params.chapterID, setChapter, setSubChapters]);

  const handleAddChapterClick = () => {
    router.push(pathname + "?add_sub_chapter=true");
  };

  const handleEditContentClick = () => {
    router.push(pathname + "?edit_content=true");
  };

  const updateChapterContent = async (chapterContent) => {
    if (!chapter) return null;
    const response = await adminUpdateChapterContent(
      chapter.chapterID,
      chapterContent
    );
    if (!response.ok) return null;

    setChapter(response.json);
    setChapterContent(response.json.chapterContent);
    router.push(pathname);

    return response;
  };

  const renderChapter = () => {
    if (!chapter) return <></>;
    return (
      <div className="header">
        <h1>
          Chapter {String(chapterIndex + 1).padStart(2, "0")}:{" "}
          {chapter.chapterTitle}
        </h1>
        {searchParams.get("edit_content") !== "true" && (
          <button onClick={handleEditContentClick}>Edit content</button>
        )}
      </div>
    );
  };

  const renderRichTextEditor = () => {
    if (!chapter || searchParams.get("edit_content") !== "true") return <></>;
    return (
      <RichTextEditor
        editorAction={updateChapterContent}
        editorContent={chapterContent}
      />
    );
  };

  const renderChapterContent = () => {
    if (!chapterContent || searchParams.get("edit_content")) return <></>;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: chapter.chapterContent }}
        className="section-content-container"
      />
    );
  };

  const handleAddChapterTestClick = () => {
    router.push(`${pathname}/chapter-test`);
  };

  const renderSubChapters = () => {
    if (!chapter || !subChapters || searchParams.get("edit_content") === "true")
      return <></>;
    return (
      <div className="sub-chapters-container">
        {subChapters.length != 0 &&
          subChapters.map((subChapter, index) => (
            <Link key={index} href={`${pathname}/${subChapter.subChapterID}`}>
              <span>
                {chapterIndex + 1}.{index + 1}
              </span>{" "}
              {subChapter.subChapterTitle}
            </Link>
          ))}
        {chapterTestQuestions && chapterTestQuestions.length !== 0 && (
          <Link href={`${pathname}/chapter-test`}>
            <span>
              {chapterIndex + 1}.{subChapters.length + 1}
            </span>{" "}
            Chapter Test
          </Link>
        )}
        <div className="button-container">
          <button onClick={handleAddChapterClick}>Add new sub-chapter</button>
          {chapterTestQuestions?.length === 0 && (
            <button onClick={handleAddChapterTestClick}>
              Add chapter test
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="admin-chapter-section">
        {renderChapter()}
        {renderChapterContent()}
        {renderRichTextEditor()}
        {renderSubChapters()}
      </section>
      {searchParams.get("add_sub_chapter") === "true" && (
        <AddSubChapterForm chapterID={params.chapterID} />
      )}
    </>
  );
};

export default ChapterID;
