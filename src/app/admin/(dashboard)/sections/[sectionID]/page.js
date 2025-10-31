"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaPen } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditTitleForm from "@/components/EditTitleForm";
import ActivateSectionModal from "@/components/ActivateSectionModal";
import ChapterList from "@/components/ChapterList";

import { useChapters } from "@/state/store";

import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import adminDeleteChapter from "@/services/api/adminDeleteChapter";
import handleSectionTitleUpdate from "@/actions/handleSectionTitleUpdate";

const SectionID = ({ params }) => {
  const sectionID = params.sectionID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { chapters, setChapters } = useChapters();
  const [section, setSection] = useState(undefined);
  const [itemToDelete, setItemToDelete] = useState(undefined);
  const [isActivateModalVisible, setIsActivateModalVisible] = useState(false);

  useEffect(() => {
    if (!sectionID) return;
    const fetchSection = async () => {
      const response = await adminFetchSectionByID(sectionID);
      setSection(response.ok ? response.json : undefined);
    };

    fetchSection();
  }, [sectionID]);

  useEffect(() => {
    if (!chapters || !Array.isArray(chapters)) return;
    if (!searchParams.get("delete_chapter")) return setItemToDelete(undefined);
    const chapterToDelete = chapters.find(
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
          {section.sectionTitle}
          <span
            className={`${
              section.isActive
                ? "bg-custom-green-light text-custom-green-base"
                : "bg-custom-gray-base text-custom-gray-dark"
            }`}
          >
            {section.isActive ? "Active" : "Inactive"}
          </span>
        </h1>
        <button onClick={handleEditSectionTitle} className="edit-btn">
          <FaPen />
        </button>
        {!section.isActive && (
          <button
            className="activate-btn"
            onClick={() => setIsActivateModalVisible(true)}
          >
            Activate
          </button>
        )}
      </div>
    );
  };

  const handleConfirmChapterDelete = async () => {
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

  const onSuccessActivate = () => {
    setIsActivateModalVisible(false);
    setSection((prevState) => ({ ...prevState, isActive: true }));
  };

  if (!section) return null;

  return (
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
      <ChapterList sectionID={sectionID} />
      {isActivateModalVisible && (
        <ActivateSectionModal
          closeModalClick={() => setIsActivateModalVisible(false)}
          onSuccessActivate={onSuccessActivate}
          sectionID={sectionID}
        />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          itemToDelete={itemToDelete}
          pathWhenModalIsClosed={pathname}
          confirmAction={handleConfirmChapterDelete}
        />
      )}
    </section>
  );
};

export default SectionID;
