import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiExternalLinkFill } from "react-icons/ri";

import SubChaptersProgressModal from "./SubChaptersProgressModal";

import adminFetchStudentCompletions from "@/services/api/adminFetchStudentCompletions";

const StudentCompletionsTable = ({ student }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [completions, setCompletions] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [progress, setProgress] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const fetchCompletions = async () => {
      const { ok, json } = await adminFetchStudentCompletions(
        student.studentUserName
      );

      if (!ok) return setCompletions([]);

      setCompletions(json.completions);
      setProgress(
        `${json.viewedSubChaptersCount}/${json.totalSubChaptersCount}`
      );
      setProgressPercentage(
        parseInt(
          (json.viewedSubChaptersCount / json.totalSubChaptersCount) * 100
        ) || 0
      );
    };

    fetchCompletions();
  }, [student.studentUserName]);

  const handleBackClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("student");
    router.push(`${pathname}?${currentParams}`);
  };

  const renderProgress = () => {
    if (!progress) return null;
    return (
      <div className="progress">
        <h3>Course progress</h3>
        <div className="progress-bar">
          <div className="progress-graph">
            <div
              className="progress-percentage"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="percentage-text">{progressPercentage}%</p>
        </div>
        <p className="progress-fraction">{progress} sub-chapters</p>
      </div>
    );
  };

  const renderCompletions = () => {
    if (completions.length === 0) return null;
    return (
      <table>
        <thead>
          <tr>
            <th>Chapter</th>
            <th>Progress</th>
            <th>Score</th>
            <th>Completion Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {completions.map((completion, index) => {
            let formattedDateCompleted = "";

            if (completion.dateCompleted) {
              const dateCompleted = new Date(completion.dateCompleted);
              formattedDateCompleted = `${
                dateCompleted.getMonth() + 1
              }/${dateCompleted.getDate()}/${dateCompleted.getFullYear()}`;
            }

            return (
              <tr key={index}>
                <td className="title">
                  {completion.chapterTitle || "Final Test"}
                </td>
                <td>
                  <p
                    className={`progress ${
                      completion.progressStatus === "Completed"
                        ? " text-custom-green-base bg-custom-green-light"
                        : completion.progressStatus === "Exam not passed"
                          ? " text-custom-red bg-rose-200"
                          : " text-custom-gray-dark bg-custom-gray-base"
                    }`}
                  >
                    {completion.progressStatus}
                  </p>
                </td>
                <td>
                  {completion.numberOfQuestions
                    ? `${completion.score}/${completion.numberOfQuestions}`
                    : ""}
                </td>
                <td>{formattedDateCompleted}</td>
                {completion.chapterTitle && (
                  <td>
                    <button onClick={() => setSelectedChapter(completion)}>
                      <p>Sub-chapters</p>
                      <RiExternalLinkFill />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderSubChaptersProgressModal = () => {
    if (!selectedChapter) return null;
    return (
      <SubChaptersProgressModal
        onCloseClick={() => setSelectedChapter(null)}
        student={student.studentUserName}
        chapterID={selectedChapter.chapterID}
        chapterTitle={selectedChapter.chapterTitle}
      />
    );
  };

  return (
    <div className="student-completions-table">
      <div className="header">
        <button onClick={handleBackClick}>
          <IoMdArrowRoundBack />
        </button>
        <h2>
          {`${student.billingFirstName} ${student.billingLastName} 
          (${student.studentUserName})`}
        </h2>
      </div>
      {renderProgress()}
      {renderCompletions()}
      {renderSubChaptersProgressModal()}
    </div>
  );
};

export default StudentCompletionsTable;
