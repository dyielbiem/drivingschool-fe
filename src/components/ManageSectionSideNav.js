"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import adminFetchChapters from "@/services/api/adminFetchChapters";
import { FiEdit } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import AddChapterForm from "./AddChapterForm";

const ManageSectionSideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionID = pathname.split("/").at(3);
  const chapterID = pathname.split("/").at(4);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await adminFetchChapters(sectionID);
      setChapters(response.ok ? response.json.chapters : []);
    };

    fetchChapters();
  }, [sectionID]);

  const handleAddChapterClick = () => {
    router.push(`/admin/sections/${sectionID}?add_chapter=true`);
  };

  const renderChapterTitles = () => {
    if (chapters.length === 0) return <></>;
    return (
      <nav>
        {chapters.map((item, index) => (
          <Link
            href={`/admin/sections/${sectionID}/${item.chapterID}`}
            key={index}
            className={`${
              chapterID === item.chapterID
                ? "bg-custom-blue-darker font-bold"
                : ""
            }`}
          >
            Chapter {String(index + 1).padStart(2, "0")}:
            <span>{item.chapterTitle}</span>
          </Link>
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
