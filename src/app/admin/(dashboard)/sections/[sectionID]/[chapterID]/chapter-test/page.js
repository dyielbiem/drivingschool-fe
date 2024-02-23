"use client";
import {
  useChapterTestQuestions,
  useChapterIndex,
  useSubChapters
} from "@/state/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddQuestionForm from "@/components/AddQuestionForm";
import handleChapterTestQuestionSubmit from "@/actions/handleChapterTestQuestionSubmit";

const ChapterTest = () => {
  const { chapterTestQuestions, setNewChapterTestQuestion } =
    useChapterTestQuestions();
  const pathname = usePathname();
  const chapterID = pathname.split("/").at(4);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { chapterIndex } = useChapterIndex();
  const { subChapters } = useSubChapters();

  const handleAddQuestionClick = () => {
    router.push(`${pathname}?add_question=true`);
  };

  const renderHeader = () => {
    if (!chapterTestQuestions) return <></>;
    return (
      <div className="header">
        <h1>
          Chapter {chapterIndex + 1}.
          {subChapters ? subChapters.length + 1 : "1"}. Chapter Test
        </h1>
        {searchParams.get("add_question") !== "true" && (
          <button onClick={handleAddQuestionClick}>Add question</button>
        )}
      </div>
    );
  };

  const renderTest = () => {
    if (chapterTestQuestions?.length === 0) return <></>;
    return (
      <ul className="test-question-container">
        {chapterTestQuestions?.map((question, index) => (
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
          submitAction={handleChapterTestQuestionSubmit}
          setNewTestQuestion={setNewChapterTestQuestion}
          parentID={chapterID}
        />
      )}
    </section>
  );
};

export default ChapterTest;
