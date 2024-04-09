"use client";
import { useChapters, useSectionTestQuestions } from "@/state/store";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteChapter from "@/services/api/adminDeleteChapter";
import EditTitleForm from "@/components/EditTitleForm";
import handleSectionTitleUpdate from "@/actions/handleSectionTitleUpdate";
import { IoMdArrowRoundBack } from "react-icons/io";

const SectionID = () => {
  const { chapters, setChapters } = useChapters();
  const { sectionTestQuestions } = useSectionTestQuestions();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionID = pathname.split("/").at(3);
  const [section, setSection] = useState(undefined);
  const router = useRouter();
  const [itemToDelete, setItemToDelete] = useState(undefined);

  useEffect(() => {
    if (!sectionID) return;
    const fetchSection = async () => {
      const response = await adminFetchSectionByID(sectionID);
      setSection(response.ok ? response.json : undefined);
    };

    fetchSection();
  }, [sectionID]);

  useEffect(() => {
    if (!chapters) return;
    if (!searchParams.get("delete_chapter")) return setItemToDelete(undefined);
    const chapterToDelete = chapters?.find(
      (chapter) => chapter.chapterID === searchParams.get("delete_chapter")
    );

    setItemToDelete(chapterToDelete ? chapterToDelete.chapterTitle : undefined);
  }, [chapters, searchParams]);

  const handleEditSectionTitle = () => {
    router.push(`${pathname}?edit_title=true`);
  };

  const handleBackClick = () => {
    router.push("/admin/sections/");
  };

  const renderSection = () => {
    if (!section || searchParams.get("edit_title") === "true") return <></>;
    return (
      <div className="header">
        <button onClick={handleBackClick} className="back-btn">
          <IoMdArrowRoundBack />
        </button>
        <h1>
          {section.sectionTitle} {section.isActive ? "(Latest Version)" : ""}
        </h1>
        <button onClick={handleEditSectionTitle} className="edit-btn">
          <FaPen />
        </button>
      </div>
    );
  };

  const handleEditClick = (chapterID) => {
    router.push(`${pathname}/${chapterID}?edit_content=true`);
  };

  const handleDeleteClick = (chapterID) => {
    router.push(`${pathname}?delete_chapter=${chapterID}`);
  };

  const renderChapters = () => {
    if (
      !section ||
      !sectionTestQuestions ||
      !chapters ||
      chapters?.length === 0
    )
      return <></>;
    return (
      <ul className="chapters-container">
        {chapters.map((chapter, index) => (
          <li key={index}>
            <Link href={`${pathname}/${chapter.chapterID}`}>
              Chapter {String(index + 1).padStart(2, "0")}:{" "}
              {chapter.chapterTitle}
            </Link>
            <div>
              <button onClick={() => handleEditClick(chapter.chapterID)}>
                <FaPen />
              </button>
              <button onClick={() => handleDeleteClick(chapter.chapterID)}>
                <FaTrashCan />
              </button>
            </div>
          </li>
        ))}
        {sectionTestQuestions?.length !== 0 && (
          <li>
            <Link href={`${pathname}/final-test`}>
              Chapter {String(chapters?.length + 1).padStart(2, "0")}: Final
              Test
            </Link>
          </li>
        )}
      </ul>
    );
  };

  const deleteChapter = async () => {
    if (!searchParams.get("delete_chapter")) return;
    const response = await adminDeleteChapter(
      String(searchParams.get("delete_chapter"))
    );
    if (!response.ok) return;
    setChapters(
      chapters?.filter(
        (chapter) => chapter.chapterID !== searchParams.get("delete_chapter")
      )
    );
    router.push(pathname);
  };

  const handleSectionTitleUpdateWithSection = handleSectionTitleUpdate.bind(
    null,
    section
  );

  return (
    <>
      <section className="admin-manage-section">
        {renderSection()}
        {searchParams.get("edit_title") === "true" && (
          <EditTitleForm
            prevTitle={section?.sectionTitle}
            pathWhenCancelled={pathname}
            updateAction={handleSectionTitleUpdateWithSection}
            setItemToEdit={setSection}
          />
        )}
        {renderChapters()}
      </section>
      {itemToDelete && (
        <ConfirmDeleteModal
          itemToDelete={itemToDelete}
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteChapter}
        />
      )}
    </>
  );
};

export default SectionID;
