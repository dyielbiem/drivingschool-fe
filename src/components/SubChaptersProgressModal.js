import { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";

import adminFetchSubChaptersProgress from "@/services/api/adminFetchSubChaptersProgress";

const SubChaptersProgressModal = ({
  onCloseClick,
  chapterID,
  chapterTitle,
  student
}) => {
  const [isProgressFetched, setIsProgressFetched] = useState(false);
  const [subChaptersProgress, setSubChaptersProgress] = useState([]);
  useEffect(() => {
    const fetchProgress = async () => {
      const { ok, json } = await adminFetchSubChaptersProgress(
        chapterID,
        student
      );

      if (!ok) return setIsProgressFetched(true);

      setSubChaptersProgress(json.subChaptersProgress);
      setIsProgressFetched(true);
    };

    fetchProgress();
  }, [chapterID, student]);

  const renderLoader = () => {
    if (isProgressFetched) return null;
    return (
      <p className="fetching-msg">
        <LuLoader2 />
        <span>Fetching sub-chapter progress</span>
      </p>
    );
  };

  const renderNoProgress = () => {
    if (!isProgressFetched || subChaptersProgress.length > 0) return null;
    return (
      <p className="no-sub-chapter-msg">This chapter has no sub-chapters.</p>
    );
  };

  const renderTable = () => {
    if (subChaptersProgress.length === 0) return null;
    return (
      <table>
        <thead>
          <tr>
            <th>Sub-chapter</th>
            <th>Progress</th>
            <th>Completion Date</th>
          </tr>
        </thead>
        <tbody>
          {subChaptersProgress.map((subChapter, index) => {
            let formattedDateCompleted = "";

            if (subChapter.dateViewed) {
              const dateCompleted = new Date(subChapter.dateViewed);
              formattedDateCompleted = `${
                dateCompleted.getMonth() + 1
              }/${dateCompleted.getDate()}/${dateCompleted.getFullYear()}`;
            }

            return (
              <tr key={index}>
                <td className="title" data-cell="sub-chapter">
                  {subChapter.subChapterTitle}
                </td>
                <td data-cell="sub-progress">
                  <p
                    className={`progress ${
                      subChapter.isViewed
                        ? "text-custom-green-base bg-custom-green-light"
                        : "text-custom-gray-dark bg-custom-gray-base"
                    }`}
                  >
                    {subChapter.isViewed ? "Completed" : "Not completed"}
                  </p>
                </td>
                <td data-cell="completion date">{formattedDateCompleted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="sub-chapters-progress-modal">
      <div>
        <button className="close-btn" onClick={onCloseClick}>
          <IoCloseCircleSharp />
        </button>
        <h3>{chapterTitle}</h3>
        {renderLoader()}
        {renderNoProgress()}
        {renderTable()}
      </div>
    </div>
  );
};

export default SubChaptersProgressModal;
