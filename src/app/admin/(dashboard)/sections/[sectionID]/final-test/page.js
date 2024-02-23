"use client";
import { useChapters, useSectionTestQuestions } from "@/state/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddQuestionForm from "@/components/AddQuestionForm";
import handleSectionTestQuestionSubmit from "@/actions/handleSectionTestQuestionSubmit";

const FinalTest = () => {
  const { chapters } = useChapters();
  const { sectionTestQuestions, setNewSectionTestQuestion } =
    useSectionTestQuestions();
  const pathname = usePathname();
  const sectionID = pathname.split("/").at(3);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleAddQuestionClick = () => {
    router.push(`${pathname}?add_question=true`);
  };

  const renderHeader = () => {
    if (!sectionTestQuestions) return <></>;
    return (
      <div className="header">
        <h1>
          Chapter{" "}
          {!chapters ? "01" : String(chapters?.length + 1).padStart(2, "0")}:
          Final Test
        </h1>
        {searchParams.get("add_question") !== "true" && (
          <button onClick={handleAddQuestionClick}>Add question</button>
        )}
      </div>
    );
  };

  const renderTest = () => {
    if (sectionTestQuestions?.length === 0) return <></>;
    return (
      <ul className="test-question-container">
        {sectionTestQuestions?.map((question, index) => (
          <li key={index}>
            <h2>
              <span>{String(index + 1).padStart(2, "0")}.</span>{" "}
              {question.question}
            </h2>
            <ul className="question-choices">
              {question?.choices?.map((choice, subIndex) => (
                <li
                  key={subIndex}
                  className={`${
                    question.correctAnswer === choice ? "font-bold" : ""
                  }`}
                >
                  {choice}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="test-section">
      {renderHeader()}
      {renderTest()}
      {searchParams.get("add_question") === "true" && (
        <AddQuestionForm
          submitAction={handleSectionTestQuestionSubmit}
          parentID={sectionID}
          setNewTestQuestion={setNewSectionTestQuestion}
        />
      )}
    </section>
  );
};

export default FinalTest;
