"use client";
import { useChapterIndex, useSubChapterIndex } from "@/state/store";
import adminFetchSubChapterByID from "@/services/api/adminFetchSubChapterByID";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import ContentEditor from "@/components/ContentEditor";
import adminUpdateSubChapterContent from "@/services/api/adminUpdateSubChapterContent";
import EditTitleForm from "@/components/EditTitleForm";
import { FaPen } from "react-icons/fa6";
import handleSubChapterTitleUpdate from "@/actions/handleSubChapterTitleUpdate";
import { useSubChapters } from "@/state/store";
import { IoMdArrowRoundBack } from "react-icons/io";

const SubChapterID = ({ params }) => {
  const { chapterIndex } = useChapterIndex();
  const { subChapterIndex } = useSubChapterIndex();
  const [subChapter, setSubChapter] = useState(null);
  const [subChapterContent, setSubChapterContent] = useState(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { setUpdatedSubChapter } = useSubChapters();

  // Fetch the current sub-chapter
  useEffect(() => {
    const fetchSubChapter = async () => {
      const response = await adminFetchSubChapterByID(params.subChapterID);
      if (!response.ok) return;

      setSubChapter(response.json);
      setSubChapterContent(response.json.subChapterContent);
    };

    fetchSubChapter();
  }, [params.subChapterID]);

  // Update the title of sub-chapter on side nav to reflect
  // the change made by the user
  useEffect(() => {
    if (!subChapter) return;
    setUpdatedSubChapter(subChapter);
  }, [setUpdatedSubChapter, subChapter]);

  const handleEditContentClick = () => {
    router.push(pathname + "?edit_content=true");
  };

  const handleEditTitleClick = () => {
    router.push(pathname + "?edit_content=true&edit_title=true");
  };

  const handleBackClick = () => {
    const backRoute = pathname.split("/").slice(0, -1).join("/");
    router.push(backRoute);
  };

  const renderSubChapter = () => {
    if (
      !subChapter ||
      subChapterIndex === undefined ||
      (searchParams.get("edit_content") === "true" &&
        searchParams.get("edit_title") === "true")
    )
      return <></>;
    return (
      <div className="header">
        <button onClick={handleBackClick} className="back-btn">
          <IoMdArrowRoundBack />
        </button>
        <h1>
          Chapter {chapterIndex + 1}.{subChapterIndex + 1}.{" "}
          {subChapter.subChapterTitle}
        </h1>
        {searchParams.get("edit_content") !== "true" && (
          <button onClick={handleEditContentClick} className="edit-content-btn">
            Edit Content
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

  const handleSubChapterTitleUpdateWithSubChapter =
    handleSubChapterTitleUpdate.bind(null, subChapter);

  const renderEditTitleInput = () => {
    if (
      !subChapter ||
      searchParams.get("edit_content") !== "true" ||
      searchParams.get("edit_title") !== "true"
    )
      return <></>;

    return (
      <EditTitleForm
        pathWhenCancelled={`${pathname}/?edit_content=true`}
        prevTitle={subChapter.subChapterTitle}
        setItemToEdit={setSubChapter}
        updateAction={handleSubChapterTitleUpdateWithSubChapter}
      />
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
      <ContentEditor
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
      {renderEditTitleInput()}
      {renderRichTextEditor()}
      {renderSubChapterContent()}
    </section>
  );
};

export default SubChapterID;
