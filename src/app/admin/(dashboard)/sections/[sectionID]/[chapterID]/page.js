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
import { FaTrashCan, FaPen } from "react-icons/fa6";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteSubChapter from "@/services/api/adminDeleteSubChapter";
import EditTitleForm from "@/components/EditTitleForm";
import handleChapterTitleUpdate from "@/actions/handleChapterTitleUpdate";
import { useChapters } from "@/state/store";

const ChapterID = ({ params }) => {
  const [chapter, setChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const { chapterTestQuestions } = useChapterTestQuestions();
  const { subChapters, setSubChapters } = useSubChapters();
  const { chapterIndex } = useChapterIndex();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [itemToDelete, setItemToDelete] = useState(undefined);
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

  // Validate for delete sub-chapter query in URL
  useEffect(() => {
    if (!subChapters) return;
    if (!searchParams.get("delete_sub_chapter"))
      return setItemToDelete(undefined);
    const subChapterToDelete = subChapters?.find(
      (subChapter) =>
        subChapter.subChapterID === searchParams.get("delete_sub_chapter")
    );

    setItemToDelete(
      subChapterToDelete ? subChapterToDelete.subChapterTitle : undefined
    );
  }, [searchParams, subChapters]);

  // Update the title of chapter on side nav to reflect
  // the change made by the user
  useEffect(() => {
    if (!chapter) return;
    setUpdatedChapter(chapter);
  }, [chapter, setUpdatedChapter]);

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

  const handleEditTitleClick = () => {
    router.push(pathname + "?edit_content=true&edit_title=true");
  };

  const renderChapter = () => {
    if (
      !chapter ||
      (searchParams.get("edit_content") === "true" &&
        searchParams.get("edit_title") === "true")
    )
      return <></>;
    return (
      <div className="header">
        <h1>
          Chapter {String(chapterIndex + 1).padStart(2, "0")}:{" "}
          {chapter.chapterTitle}
        </h1>
        {searchParams.get("edit_content") !== "true" && (
          <button onClick={handleEditContentClick} className="edit-content-btn">
            Edit content
          </button>
        )}
        {searchParams.get("edit_content") === "true" && (
          <button className="edit-title-btn" onClick={handleEditTitleClick}>
            <FaPen />
          </button>
        )}
      </div>
    );
  };

  const handleChapterTitleUpdateWithChapter = handleChapterTitleUpdate.bind(
    null,
    chapter
  );

  const renderEditTitleInput = () => {
    if (
      !chapter ||
      searchParams.get("edit_content") !== "true" ||
      searchParams.get("edit_title") !== "true"
    )
      return <></>;

    return (
      <EditTitleForm
        pathWhenCancelled={`${pathname}/?edit_content=true`}
        prevTitle={chapter.chapterTitle}
        setItemToEdit={setChapter}
        updateAction={handleChapterTitleUpdateWithChapter}
      />
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

  const handleEditClick = (subChapterID) => {
    router.push(`${pathname}/${subChapterID}?edit_content=true`);
  };

  const handleDeleteClick = (subChapterID) => {
    router.push(`${pathname}?delete_sub_chapter=${subChapterID}`);
  };

  const renderSubChapters = () => {
    if (!chapter || !subChapters || searchParams.get("edit_content") === "true")
      return <></>;
    return (
      <>
        <ul className="sub-chapters-container">
          {subChapters.length != 0 &&
            subChapters.map((subChapter, index) => (
              <li key={index}>
                <Link href={`${pathname}/${subChapter.subChapterID}`}>
                  <span>
                    {chapterIndex + 1}.{index + 1}
                  </span>{" "}
                  {subChapter.subChapterTitle}
                </Link>
                <div>
                  <button
                    onClick={() => handleEditClick(subChapter.subChapterID)}
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(subChapter.subChapterID)}
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </li>
            ))}
          {chapterTestQuestions && chapterTestQuestions.length !== 0 && (
            <li>
              <Link href={`${pathname}/chapter-test`}>
                <span>
                  {chapterIndex + 1}.{subChapters.length + 1}
                </span>{" "}
                Chapter Test
              </Link>
            </li>
          )}
        </ul>
        <div className="button-container">
          <button onClick={handleAddChapterClick}>Add new sub-chapter</button>
          {chapterTestQuestions?.length === 0 && (
            <button onClick={handleAddChapterTestClick}>
              Add chapter test
            </button>
          )}
        </div>
      </>
    );
  };

  const deleteSubChapter = async () => {
    if (!searchParams.get("delete_sub_chapter")) return;
    const response = await adminDeleteSubChapter(
      String(searchParams.get("delete_sub_chapter"))
    );
    if (!response.ok) return;
    setSubChapters(
      subChapters?.filter(
        (subChapter) =>
          subChapter.subChapterID !== searchParams.get("delete_sub_chapter")
      )
    );
    router.push(pathname);
  };

  return (
    <>
      <section className="admin-chapter-section">
        {renderChapter()}
        {renderEditTitleInput()}
        {renderChapterContent()}
        {renderRichTextEditor()}
        {renderSubChapters()}
      </section>
      {searchParams.get("add_sub_chapter") === "true" && (
        <AddSubChapterForm chapterID={params.chapterID} />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          itemToDelete={itemToDelete}
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteSubChapter}
        />
      )}
    </>
  );
};

export default ChapterID;
