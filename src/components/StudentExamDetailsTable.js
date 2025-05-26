import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import adminFetchStudentExamDetails from "@/services/api/adminFetchStudentExamDetails";

const getTestStatus = (test) => {
  const hasTest = !!(test.sectionID || test.hasTest);
  return hasTest
    ? test.isPassed
      ? "Passed"
      : test.isPassed === false
        ? "Failed"
        : "Not completed"
    : "No test";
};

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Test</th>
        <th>Status</th>
        <th>Score</th>
        <th>Percentage</th>
      </tr>
    </thead>
  );
};

const TableData = ({ testResults }) => {
  return (
    <tbody>
      {testResults.map((test, index) => {
        const {
          isPassed,
          chapterTitle,
          numberOfQuestions,
          score,
          scorePercentage
        } = test;
        const status = getTestStatus(test);

        return (
          <tr key={index}>
            <td className="title" data-cell="test">
              {chapterTitle || "Final Test"}
            </td>
            <td data-cell="status">
              <p
                className={`status ${
                  status === "Passed"
                    ? " text-custom-green-base bg-custom-green-light"
                    : status === "Failed"
                      ? " text-custom-red bg-rose-200"
                      : " text-custom-gray-dark bg-custom-gray-base"
                }`}
              >
                {status}
              </p>
            </td>
            <td data-cell="score">
              {status !== "No test" && status !== "Not completed"
                ? `${score}/${numberOfQuestions} `
                : ""}
            </td>
            <td data-cell="percentage">
              {scorePercentage} {isPassed !== undefined ? "%" : ""}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

const StudentExamDetailsTable = ({ student }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      const { ok, json } = await adminFetchStudentExamDetails(
        student.studentUserName
      );

      if (!ok) return setTestResults([]);

      setTestResults(json.latestTestResults);
    };

    fetchExamDetails();
  }, [student.studentUserName]);

  const handleBackClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("student");
    router.push(`${pathname}?${currentParams}`);
  };

  if (testResults.length === 0) return null;

  return (
    <div className="student-exam-details-table">
      <div className="header">
        <button onClick={handleBackClick}>
          <IoMdArrowRoundBack />
        </button>
        <h1>
          {`${student.mailingFirstName} ${student.mailingLastName} 
          (${student.studentUserName})`}
        </h1>
      </div>
      <table>
        <TableHeader />
        <TableData testResults={testResults} />
      </table>
    </div>
  );
};

export default StudentExamDetailsTable;
