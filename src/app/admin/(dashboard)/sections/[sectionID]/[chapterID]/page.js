"use client";
import Link from "next/link";
import AddSubChapterForm from "@/components/AddSubChapterForm";
import ContentEditor from "@/components/ContentEditor";
import EditTitleForm from "@/components/EditTitleForm";
import SubChapterList from "@/components/SubChapterList";
import adminFetchChapterByID from "@/services/api/adminFetchChapterByID";
import adminUpdateChapterContent from "@/services/api/adminUpdateChapterContent";
import handleChapterTitleUpdate from "@/actions/handleChapterTitleUpdate";
import { useChapterIndex } from "@/state/store";
import { useEffect, useState } from "react";
import { useSubChapters } from "@/state/store";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useChapterTestQuestions } from "@/state/store";
import { useChapters } from "@/state/store";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaPen } from "react-icons/fa6";

const ChapterID = ({ params }) => {
  const [chapter, setChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const { chapterTestQuestions } = useChapterTestQuestions();
  const { subChapters, setSubChapters } = useSubChapters();
  const { chapterIndex } = useChapterIndex();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { setUpdatedChapter } = useChapters();

  // Fetch the current chapter
  useEffect(() => {
    const fetchChapter = async () => {
      const chapterResponse = await adminFetchChapterByID(params.chapterID);
      if (!chapterResponse?.ok) return;
      setChapter(chapterResponse?.json);
      setChapterContent(chapterResponse?.json?.chapterContent);
    };

    fetchChapter();
  }, [params.chapterID, setChapter, setSubChapters]);

  // Update the title of chapter on side nav to reflect
  // the change made by the user
  useEffect(() => {
    if (!chapter) return;
    setUpdatedChapter(chapter);
  }, [chapter, setUpdatedChapter]);

  const handleEditContentClick = () => {
    router.push(pathname + "?edit_content=true");
  };

  const handleAddSubChapterClick = () => {
    router.push(pathname + "?add_sub_chapter=true");
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

  const handleEditTitleClick = () => {
    router.push(pathname + "?edit_content=true&edit_title=true");
  };

  const handleBackClick = () => {
    const backRoute = pathname.split("/").slice(0, -1).join("/");
    router.push(backRoute);
  };

  const handleChapterTitleUpdateWithChapter = handleChapterTitleUpdate.bind(
    null,
    chapter
  );

  const handleAddChapterTestClick = () => {
    router.push(`${pathname}/chapter-test`);
  };

  const renderChapterHeaderBox = () => {
    if (
      !chapter ||
      (searchParams.get("edit_content") === "true" &&
        searchParams.get("edit_title") === "true")
    )
      return null;

    return (
      <div className="header">
        <button onClick={handleBackClick} className="back-btn">
          <IoMdArrowRoundBack />
        </button>
        <h1>
          Chapter {String(chapterIndex + 1).padStart(2, "0")}:{" "}
          {chapter.chapterTitle}
        </h1>
        {searchParams.get("edit_content") !== "true" ? (
          <button onClick={handleEditContentClick} className="edit-content-btn">
            Edit content
          </button>
        ) : (
          <button className="edit-title-btn" onClick={handleEditTitleClick}>
            <FaPen />
          </button>
        )}
      </div>
    );
  };

  const renderEditTitleInput = () => {
    if (
      !chapter ||
      searchParams.get("edit_content") !== "true" ||
      searchParams.get("edit_title") !== "true"
    )
      return null;

    return (
      <EditTitleForm
        pathWhenCancelled={`${pathname}/?edit_content=true`}
        prevTitle={chapter.chapterTitle}
        setItemToEdit={setChapter}
        updateAction={handleChapterTitleUpdateWithChapter}
      />
    );
  };

  const renderChapterContent = () => {
    if (!chapterContent) return null;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: chapter.chapterContent }}
        className="section-content-container"
      />
    );
  };

  const renderChapterTest = () => {
    if (!chapterTestQuestions || chapterTestQuestions.length === 0) return null;
    return (
      <div className="chapter-test-item">
        <Link href={`${pathname}/chapter-test`}>
          <span>
            {chapterIndex + 1}.{subChapters.length + 1}
          </span>{" "}
          Chapter Test
        </Link>
      </div>
    );
  };

  const renderActionButtons = () => {
    return (
      <div className="button-container">
        <button onClick={handleAddSubChapterClick}>Add new sub-chapter</button>
        {chapterTestQuestions?.length === 0 && (
          <button onClick={handleAddChapterTestClick}>Add chapter test</button>
        )}
      </div>
    );
  };

  const renderChapterMainSection = () => {
    if (!chapter || !subChapters || searchParams.get("edit_content") === "true")
      return null;
    return (
      <>
        {renderChapterContent()}
        <div className="nav-links">
          <SubChapterList />
          {renderChapterTest()}
        </div>
        {renderActionButtons()}
      </>
    );
  };

  const renderRichTextEditor = () => {
    if (!chapter || searchParams.get("edit_content") !== "true") return <></>;
    return (
      <ContentEditor
        editorAction={updateChapterContent}
        editorContent={chapterContent}
      />
    );
  };

  return (
    <section className="admin-chapter-section">
      {renderChapterHeaderBox()}
      {renderEditTitleInput()}
      {renderChapterMainSection()}
      {renderRichTextEditor()}
      {searchParams.get("add_sub_chapter") === "true" && (
        <AddSubChapterForm chapterID={params.chapterID} />
      )}
    </section>
  );
};

export default ChapterID;
