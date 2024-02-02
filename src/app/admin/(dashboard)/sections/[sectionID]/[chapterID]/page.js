"use client";
import { useChapterIndex } from "@/state/store";
import { useEffect, useState } from "react";
import adminFetchChapterByID from "@/services/api/adminFetchChapterByID";
import adminFetchSubChapters from "@/services/api/adminFetchSubChapters";
import Link from "next/link";
import { useSubChapters } from "@/state/store";
import AddSubChapterForm from "@/components/AddSubChapterForm";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const ChapterID = ({ params }) => {
  const [chapter, setChapter] = useState(null);
  const { subChapters, setSubChapters } = useSubChapters();
  const { chapterIndex } = useChapterIndex();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchChapter = async () => {
      const chapterResponse = await adminFetchChapterByID(params.chapterID);
      if (!chapterResponse.ok) return;
      setChapter(chapterResponse.json);

      const subChaptersResponse = await adminFetchSubChapters(
        chapterResponse.json.chapterID
      );

      if (!subChaptersResponse.ok) return;
      setSubChapters(subChaptersResponse.json.subChapters);
    };

    fetchChapter();
  }, [params.chapterID, setChapter, setSubChapters]);

  const handleAddChapterClick = () => {
    router.push(pathname + "?add_sub_chapter=true");
  };

  const renderChapter = () => {
    if (!chapter) return <></>;
    return (
      <div className="header">
        <h1>
          Chapter {String(chapterIndex + 1).padStart(2, "0")}:{" "}
          {chapter.chapterTitle}
        </h1>
      </div>
    );
  };

  const renderSubChapters = () => {
    if (!subChapters) return <></>;
    return (
      <div className="sub-chapters-container">
        {subChapters.length != 0 &&
          subChapters.map((subChapter, index) => (
            <Link key={index} href={`/admin`}>
              <span>
                {chapterIndex + 1}.{index + 1}
              </span>{" "}
              {subChapter.subChapterTitle}
            </Link>
          ))}
        <div className="button-container">
          <button onClick={handleAddChapterClick}>Add new sub-chapter</button>
          <button>Add chapter test</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="admin-chapter-section">
        {renderChapter()}
        {renderSubChapters()}
      </section>
      {searchParams.get("add_sub_chapter") === "true" && (
        <AddSubChapterForm chapterID={params.chapterID} />
      )}
    </>
  );
};

export default ChapterID;
