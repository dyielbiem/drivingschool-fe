import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import adminFetchStudentCompletions from "@/services/api/adminFetchStudentCompletions";

const StudentCompletionsTable = ({ student }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      const { ok, json } = await adminFetchStudentCompletions(
        student.studentUserName
      );

      if (!ok) return setCompletions([]);

      setCompletions(json.completions);
    };

    fetchExamDetails();
  }, [student.studentUserName]);

  const handleBackClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("student");
    router.push(`${pathname}?${currentParams}`);
  };

  const renderTestResults = () => {
    if (completions.length === 0) return null;
    return (
      <table>
        <thead>
          <tr>
            <th>Chapter</th>
            <th>Progress</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {completions.map((completion, index) => {
            return (
              <tr key={index}>
                <td className="title">
                  {completion.chapterTitle || "Final Test"}
                </td>
                <td>
                  <p
                    className={`status ${
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
                  {completion.answers
                    ? `${completion.score}/${completion.numberOfQuestions}`
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
      {renderTestResults()}
    </div>
  );
};

export default StudentCompletionsTable;
