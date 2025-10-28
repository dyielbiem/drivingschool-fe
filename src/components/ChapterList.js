import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { TbArrowsMaximize } from "react-icons/tb";

import ImageWithFallback from "@/components/ImageWithFallback";
import FullScreenLoading from "@/components/FullScreenLoading";

import adminUpdateChaptersOrder from "@/services/api/adminUpdateChaptersOrder";
import { useChapters, useSectionTestQuestions } from "@/state/store";

const getCoverImageURL = (chapterID) =>
  `${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/image/chapter/` +
  `${chapterID}?image_refresher=${new Date().getTime()}`;

const Chapters = ({ sectionID }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { chapters, setChapters } = useChapters();
  const [isDragging, setIsDragging] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    const isChaptersOrdered = chapters.every(
      (item, idx) =>
        idx === 0 ||
        (chapters[idx - 1].chapterOrder || 0) <= (item.chapterOrder || 0)
    );
    if (!sectionID || isDragging || isChaptersOrdered) return;

    const updateChapterOrder = async () => {
      setIsReordering(true);
      const { ok } = await adminUpdateChaptersOrder(sectionID, chapters);
      setIsReordering(false);

      if (!ok) return;
      setChapters(
        chapters.map((item, idx) => ({ ...item, chapterOrder: idx + 1 }))
      );
    };

    updateChapterOrder();
  }, [sectionID, chapters, isDragging, setChapters]);

  const handleEditClick = (chapterID) => {
    router.push(`${pathname}/${chapterID}?edit_content=true`);
  };

  const handleDeleteClick = (chapterID) => {
    router.push(`${pathname}?delete_chapter=${chapterID}`);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    window.addEventListener("pointerup", handleDragEnd, { once: true });
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
  };

  if (!chapters || chapters?.length === 0) return null;

  return (
    <Reorder.Group
      className="draggable-chapters-container"
      values={chapters}
      axis="y"
      onReorder={setChapters}
    >
      {chapters.map((chapter, index) => {
        return (
          <Reorder.Item
            key={chapter.chapterID}
            value={chapter}
            dragListener={isDragging}
          >
            <div className="chapter-item">
              <Link href={`${pathname}/${chapter.chapterID}`}>
                <ImageWithFallback
                  src={`${getCoverImageURL(chapter.chapterID)}`}
                  alt="chapter-cover-img"
                  width={0}
                  height={0}
                  fallBackSrc={"/logo.png"}
                  unoptimized={true}
                />
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
                <button onPointerDownCapture={handleDragStart}>
                  <TbArrowsMaximize />
                </button>
              </div>
            </div>
          </Reorder.Item>
        );
      })}
      {isReordering && <FullScreenLoading loadingText={"Reording chapters"} />}
    </Reorder.Group>
  );
};

const SectionTest = () => {
  const pathname = usePathname();
  const { chapters } = useChapters();
  const { sectionTestQuestions } = useSectionTestQuestions();

  if (!sectionTestQuestions || sectionTestQuestions?.length === 0) return null;

  return (
    <div className="chapter-item">
      <Link href={`${pathname}/final-test`}>
        Chapter {String(chapters?.length + 1).padStart(2, "0")}: Final Test
      </Link>
    </div>
  );
};

const ChapterList = ({ sectionID }) => {
  return (
    <div className="chapters-container">
      <Chapters sectionID={sectionID} />
      <SectionTest />
    </div>
  );
};

export default ChapterList;
