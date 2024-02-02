"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import adminFetchChapters from "@/services/api/adminFetchChapters";
import { FiEdit } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import AddChapterForm from "./AddChapterForm";
import { useChapterIndex, useSubChapters } from "@/state/store";

const ManageSectionSideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setChapterIndex } = useChapterIndex();
  const searchParams = useSearchParams();
  const sectionID = pathname.split("/").at(3);
  const chapterID = pathname.split("/").at(4);
  const [chapters, setChapters] = useState([]);
  const { subChapters, setSubChapters } = useSubChapters();

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await adminFetchChapters(sectionID);
      setChapters(response.ok ? response.json.chapters : []);
    };

    fetchChapters();
  }, [sectionID]);

  useEffect(() => {
    if (chapters.length === 0) return;
    const chapterIndex = chapters.findIndex(
      (item) => item.chapterID === chapterID
    );
    setChapterIndex(chapterIndex);
  }, [chapterID, chapters, setChapterIndex]);

  const handleAddChapterClick = () => {
    router.push(`/admin/sections/${sectionID}?add_chapter=true`);
  };

  const handleChapterClick = (thisChapterID) => {
    if (thisChapterID === chapterID) return;
    setSubChapters(null);
  };

  const renderSubChapters = (chapterIndex) => {
    if (!subChapters) return <></>;
    return (
      <div>
        {subChapters.length != 0 &&
          subChapters.map((subChapter, index) => (
            <Link key={index} href={`/admin`}>
              {chapterIndex + 1}.{index + 1} {subChapter.subChapterTitle}
            </Link>
          ))}
      </div>
    );
  };

  const renderChapterTitles = () => {
    if (chapters.length === 0) return <></>;
    return (
      <nav>
        {chapters.map((item, index) => (
          <Fragment key={index}>
            <Link
              href={`/admin/sections/${sectionID}/${item.chapterID}`}
              className={`${
                chapterID === item.chapterID
                  ? "bg-custom-blue-darker font-bold"
                  : ""
              } chapter-link`}
              key={index}
              onClick={() => handleChapterClick(item.chapterID)}
            >
              Chapter {String(index + 1).padStart(2, "0")}:
              <span>{item.chapterTitle}</span>
            </Link>
            {chapterID === item.chapterID ? renderSubChapters(index) : <></>}
          </Fragment>
        ))}
      </nav>
    );
  };

  return (
    <>
      <div className="side-nav-container">
        <button onClick={handleAddChapterClick}>
          Add new chapter <FiEdit />
        </button>
        {renderChapterTitles()}
      </div>
      {searchParams.get("add_chapter") === "true" && (
        <AddChapterForm sectionID={sectionID} setChapters={setChapters} />
      )}
    </>
  );
};

export default ManageSectionSideNav;
