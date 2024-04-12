import Link from "next/link";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import FullScreenLoading from "./FullScreenLoading";
import adminDeleteSubChapter from "@/services/api/adminDeleteSubChapter";
import adminUpdateSubChaptersOrder from "@/services/api/adminUpdateSubChaptersOrder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSubChapters, useChapterIndex } from "@/state/store";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { Reorder } from "framer-motion";
import { TbArrowsMaximize } from "react-icons/tb";

const SubChapterList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chapterID = pathname.split("/").at(4);
  const [isDragging, setIsDragging] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const { subChapters, setSubChapters } = useSubChapters();
  const { chapterIndex } = useChapterIndex();

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

  // Observe for reorder drag end
  useEffect(() => {
    if (!isDragging) return;
    const dragEnd = async () => {
      setIsDragging(false);
      const isSubChaptersOnOrder = subChapters.every(
        (item, index) =>
          String(item.orderID) &&
          (index === 0 || item.orderID >= subChapters[index - 1].orderID)
      );

      if (isSubChaptersOnOrder) return;
      setIsReordering(true);
      const subChapterIDs = subChapters.map((item) => ({
        subChapterID: item.subChapterID
      }));

      const response = await adminUpdateSubChaptersOrder(
        chapterID,
        subChapterIDs
      );

      if (!response.ok) return setIsReordering(false);

      setSubChapters(
        subChapters.map((item, index) => ({
          ...item,
          orderID: response.json.subChapters[index].orderID
        }))
      );

      setIsReordering(false);
    };
    window.addEventListener("pointerup", dragEnd);

    return () => window.removeEventListener("pointerup", dragEnd);
  }, [chapterID, isDragging, setSubChapters, subChapters]);

  const handleEditClick = (subChapterID) => {
    router.push(`${pathname}/${subChapterID}?edit_content=true`);
  };

  const handleDeleteClick = (subChapterID) => {
    router.push(`${pathname}?delete_sub_chapter=${subChapterID}`);
  };

  const renderSubChapterButtons = (subChapter) => {
    return (
      <div>
        <button onClick={() => handleEditClick(subChapter.subChapterID)}>
          <FaPen />
        </button>
        <button onClick={() => handleDeleteClick(subChapter.subChapterID)}>
          <FaTrashCan />
        </button>
        <button onPointerDownCapture={() => setIsDragging(true)}>
          <TbArrowsMaximize />
        </button>
      </div>
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

  const sortSubChapters = (event) => {
    setSubChapters(event);
  };

  const renderSubChapters = () => {
    if (subChapters.length === 0) return null;
    return (
      <Reorder.Group
        values={subChapters}
        onReorder={sortSubChapters}
        className="sub-chapters-container"
        axis="y"
      >
        {subChapters.map((subChapter, index) => (
          <Reorder.Item
            key={subChapter.subChapterID}
            value={subChapter}
            dragListener={isDragging}
          >
            <Link href={`${pathname}/${subChapter.subChapterID}`}>
              <span>
                {chapterIndex + 1}.{index + 1}
              </span>{" "}
              {subChapter.subChapterTitle}
            </Link>
            {renderSubChapterButtons(subChapter)}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    );
  };

  return (
    <>
      {renderSubChapters()}
      {itemToDelete && (
        <ConfirmDeleteModal
          itemToDelete={itemToDelete}
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteSubChapter}
        />
      )}
      {isReordering && (
        <FullScreenLoading loadingText={"Reording sub-chapters"} />
      )}
    </>
  );
};

export default SubChapterList;
