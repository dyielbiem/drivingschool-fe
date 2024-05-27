"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TbClipboardList, TbEdit } from "react-icons/tb";

import AddChapterForm from "./AddChapterForm";

import {
  useChapterIndex,
  useSubChapterIndex,
  useSubChapters,
  useChapters,
  useSectionTestQuestions,
  useChapterTestQuestions
} from "@/state/store";

import adminFetchChapters from "@/services/api/adminFetchChapters";
import adminFetchSubChapters from "@/services/api/adminFetchSubChapters";
import adminFetchSectionTestQuestions from "@/services/api/adminFetchSectionTestQuestions";
import adminFetchChapterTestQuestions from "@/services/api/adminFetchChapterTestQuestions";

const ManageSectionSideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { chapterIndex, setChapterIndex } = useChapterIndex();
  const { subChapterIndex, setSubChapterIndex } = useSubChapterIndex();
  const searchParams = useSearchParams();
  const sectionID = pathname.split("/").at(3);
  const chapterID = pathname.split("/").at(4);
  const subChapterID = pathname.split("/").at(5);
  const { chapters, setChapters, setNewChapter } = useChapters();
  const { subChapters, setSubChapters } = useSubChapters();
  const {
    sectionTestQuestions,
    setSectionTestQuestions,
    setSectionQuestionToShowCount
  } = useSectionTestQuestions();
  const {
    chapterTestQuestions,
    setChapterTestQuestions,
    setChapterQuestionToShowCount
  } = useChapterTestQuestions();

  // To fetch all the chapters of the section
  useEffect(() => {
    const fetchChapters = async () => {
      const response = await adminFetchChapters(sectionID);
      setChapters(response.ok ? response.json.chapters : []);
    };

    fetchChapters();
  }, [sectionID, setChapters]);

  // To fetch all the section test questions
  useEffect(() => {
    const fetchSectionTestQuestions = async () => {
      const response = await adminFetchSectionTestQuestions(sectionID);
      setSectionTestQuestions(response.ok ? response.json.test : []);
      setSectionQuestionToShowCount(
        response.ok ? response.json.noOfQuestionsToShow : null
      );
    };

    fetchSectionTestQuestions();
  }, [sectionID, setSectionQuestionToShowCount, setSectionTestQuestions]);

  // To fetch all the sub-chapters of a chapter
  useEffect(() => {
    if (!chapterID) return;
    setChapterTestQuestions(null);
    setChapterQuestionToShowCount(null);
    const fetchSubChapters = async () => {
      const subChaptersResponse = await adminFetchSubChapters(chapterID);

      if (!subChaptersResponse.ok) return;
      setSubChapters(subChaptersResponse.json.subChapters);
    };

    fetchSubChapters();
  }, [
    chapterID,
    setChapterQuestionToShowCount,
    setChapterTestQuestions,
    setSubChapters
  ]);

  // To fetch all the chapter test questions
  useEffect(() => {
    if (!chapterID) return;
    const fetchChapterTest = async () => {
      const response = await adminFetchChapterTestQuestions(chapterID);
      setChapterTestQuestions(response.ok ? response.json.test : []);
      setChapterQuestionToShowCount(
        response.ok ? response.json.noOfQuestionsToShow : null
      );
    };

    fetchChapterTest();
  }, [chapterID, setChapterQuestionToShowCount, setChapterTestQuestions]);

  // Get the index of selected chapter
  useEffect(() => {
    if (!chapters || chapters.length === 0) return;

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

  const renderTop = () => {
    if (!chapters) return <></>;
    return (
      <div className="top">
        <Link href={"/admin/sections"} className="home">
          <Image
            src={"/logo.png"}
            alt="logo-image"
            width={1734}
            height={594}
            priority
          />
        </Link>
        <div className="btn-container">
          <button onClick={handleAddChapterClick}>
            Add new chapter <TbEdit />
          </button>
          {sectionTestQuestions?.length === 0 && chapters?.length !== 0 && (
            <Link href={`/admin/sections/${sectionID}/final-test`}>
              Add final test <TbClipboardList />
            </Link>
          )}
        </div>
      </div>
    );
  };

  const renderSubChapters = (chapterIndex) => {
    if (!subChapters || !chapterTestQuestions) return <></>;
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
        {chapterTestQuestions && chapterTestQuestions?.length !== 0 && (
          <Link
            href={`/admin/sections/${sectionID}/${chapterID}/chapter-test`}
            className={`${
              subChapterID === "chapter-test" ? "bg-custom-blue-darker" : ""
            }`}
          >
            {chapterIndex + 1}.{subChapters.length + 1} Chapter Test
          </Link>
        )}
      </div>
    );
  };

  const renderChapters = () => {
    if (!chapters || chapters.length === 0) return <></>;
    return (
      <>
        {chapters.map((chapter, index) => (
          <Fragment key={index}>
            <Link
              href={`/admin/sections/${sectionID}/${chapter.chapterID}`}
              className={`${
                chapterIndex === index
                  ? "bg-custom-blue-darker font-bold after:bg-custom-blue-light"
                  : ""
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
      </>
    );
  };

  const renderSectionTest = () => {
    if (
      !chapters ||
      sectionTestQuestions?.length === 0 ||
      chapters?.length === 0
    )
      return <></>;
    return (
      <Link
        href={`/admin/sections/${sectionID}/final-test`}
        className={`${
          chapterID === "final-test"
            ? "bg-custom-blue-darker font-bold after:bg-custom-blue-light"
            : ""
        }`}
      >
        Chapter {String(chapters?.length + 1).padStart(2, "0")}:
        <span>Final Test</span>
      </Link>
    );
  };

  return (
    <>
      <div className="side-nav-container">
        {renderTop()}
        <nav>
          {renderChapters()}
          {renderSectionTest()}
        </nav>
      </div>
      {searchParams.get("add_chapter") === "true" && (
        <AddChapterForm sectionID={sectionID} setNewChapter={setNewChapter} />
      )}
    </>
  );
};

export default ManageSectionSideNav;
