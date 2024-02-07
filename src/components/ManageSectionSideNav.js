"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import adminFetchChapters from "@/services/api/adminFetchChapters";
import { FiEdit } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import AddChapterForm from "./AddChapterForm";
import {
  useChapterIndex,
  useSubChapterIndex,
  useSubChapters
} from "@/state/store";
import adminFetchSubChapters from "@/services/api/adminFetchSubChapters";

const ManageSectionSideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { chapterIndex, setChapterIndex } = useChapterIndex();
  const { subChapterIndex, setSubChapterIndex } = useSubChapterIndex();
  const searchParams = useSearchParams();
  const sectionID = pathname.split("/").at(3);
  const chapterID = pathname.split("/").at(4);
  const subChapterID = pathname.split("/").at(5);
  const [chapters, setChapters] = useState([]);
  const { subChapters, setSubChapters } = useSubChapters();

  // To fetch all the chapters of the section
  useEffect(() => {
    const fetchChapters = async () => {
      const response = await adminFetchChapters(sectionID);
      setChapters(response.ok ? response.json.chapters : []);
    };

    fetchChapters();
  }, [sectionID]);

  // To fetch all the sub-chapters of a chapter
  useEffect(() => {
    if (!chapterID) return;
    const fetchSubChapters = async () => {
      const subChaptersResponse = await adminFetchSubChapters(chapterID);

      if (!subChaptersResponse.ok) return;
      setSubChapters(subChaptersResponse.json.subChapters);
    };

    fetchSubChapters();
  }, [chapterID, setSubChapters]);

  // Get the index of selected chapter
  useEffect(() => {
    if (chapters.length === 0) return;

    const index = chapters.findIndex((item) => item.chapterID === chapterID);
    setChapterIndex(index);
  }, [chapterID, chapters, setChapterIndex]);

  // Get the index of selected sub-chapter
  useEffect(() => {
    if (!subChapterID || !subChapters || subChapters.length === 0) return;

    const index = subChapters.findIndex(
      (item) => item.subChapterID === subChapterID
    );

    setSubChapterIndex(index);
  }, [setSubChapterIndex, subChapterID, subChapters]);

  const handleAddChapterClick = () => {
    router.push(`/admin/sections/${sectionID}?add_chapter=true`);
  };

  const handleChapterClick = (thisChapterID) => {
    setSubChapterIndex(undefined);
    if (thisChapterID === chapterID) return;
    setSubChapters(undefined);
  };

  const renderSubChapters = (chapterIndex) => {
    if (!subChapters) return <></>;
    return (
      <div>
        {subChapters.length != 0 &&
          subChapters.map((subChapter, index) => (
            <Link
              key={index}
              href={`/admin/sections/${sectionID}/${chapterID}/${subChapter.subChapterID}`}
              className={`${
                subChapterIndex === index
                  ? "bg-custom-blue-darker font-bold"
                  : ""
              } chapter-link`}
            >
              {chapterIndex + 1}.{index + 1} {subChapter.subChapterTitle}
            </Link>
          ))}
      </div>
    );
  };

  const renderChapters = () => {
    if (chapters.length === 0) return <></>;
    return (
      <nav>
        {chapters.map((chapter, index) => (
          <Fragment key={index}>
            <Link
              href={`/admin/sections/${sectionID}/${chapter.chapterID}`}
              className={`${
                chapterIndex === index ? "bg-custom-blue-darker font-bold" : ""
              } chapter-link`}
              key={index}
              onClick={() => handleChapterClick(chapter.chapterID)}
            >
              Chapter {String(index + 1).padStart(2, "0")}:
              <span>{chapter.chapterTitle}</span>
            </Link>
            {chapterID === chapter.chapterID ? renderSubChapters(index) : <></>}
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
        {renderChapters()}
      </div>
      {searchParams.get("add_chapter") === "true" && (
        <AddChapterForm sectionID={sectionID} setChapters={setChapters} />
      )}
    </>
  );
};

export default ManageSectionSideNav;
