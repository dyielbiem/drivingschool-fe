"use client";
import {
  useChapterTestQuestions,
  useChapterIndex,
  useSubChapters
} from "@/state/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import AddQuestionForm from "@/components/AddQuestionForm";
import handleChapterTestQuestionSubmit from "@/actions/handleChapterTestQuestionSubmit";
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteQuestion from "@/services/api/adminDeleteQuestion";
import EditQuestionForm from "@/components/EditQuestionForm";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChapterTest = () => {
  const {
    chapterTestQuestions,
    setNewChapterTestQuestion,
    setChapterTestQuestions
  } = useChapterTestQuestions();
  const pathname = usePathname();
  const chapterID = pathname.split("/").at(4);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { chapterIndex } = useChapterIndex();
  const { subChapters } = useSubChapters();
  const [itemToDelete, setItemToDelete] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(undefined);

  // Observe for delete_question query
  useEffect(() => {
    if (!chapterTestQuestions || !searchParams.get("delete_question"))
      return setItemToDelete(undefined);
    const question = chapterTestQuestions.find(
      (eachQuestion) =>
        eachQuestion.questionID === searchParams.get("delete_question")
    );

    if (!question) return setItemToDelete(undefined);

    setItemToDelete(question);
  }, [searchParams, chapterTestQuestions]);

  // Observe for edit_question query
  useEffect(() => {
    if (!chapterTestQuestions || !searchParams.get("edit_question"))
      return setItemToEdit(undefined);
    const question = chapterTestQuestions.find(
      (eachQuestion) =>
        eachQuestion.questionID === searchParams.get("edit_question")
    );

    if (!question) return setItemToEdit(undefined);

    setItemToEdit(question);
  }, [searchParams, chapterTestQuestions]);

  const handleAddQuestionClick = () => {
    router.push(`${pathname}?add_question=true`);
  };

  const handleBackClick = () => {
    const backRoute = pathname.split("/").slice(0, -1).join("/");
    router.push(backRoute);
  };

  const renderHeader = () => {
    if (!chapterTestQuestions) return <></>;
    return (
      <div className="header">
        <button onClick={handleBackClick} className="back-btn">
          <IoMdArrowRoundBack />
        </button>
        <h1>
          Chapter {chapterIndex + 1}.
          {subChapters ? subChapters.length + 1 : "1"}. Chapter Test
        </h1>
        {searchParams.get("add_question") !== "true" && (
          <button onClick={handleAddQuestionClick} className="add-btn">
            Add question
          </button>
        )}
      </div>
    );
  };

  const handleDeleteClick = (id) => {
    router.push(`${pathname}?delete_question=${id}`);
  };

  const handleEditClick = (id) => {
    router.push(`${pathname}?edit_question=${id}`);
  };

  const renderTest = () => {
    if (chapterTestQuestions?.length === 0) return <></>;
    return (
      <ul className="test-question-container">
        {chapterTestQuestions?.map((question, index) => (
          <li key={index}>
            <p className="numbering">{String(index + 1).padStart(2, "0")}.</p>
            <div className="top">
              <div
                className="question"
                dangerouslySetInnerHTML={{
                  __html: question.question
                }}
              />
              <div className="action-btn-container">
                <button>
                  <FaPen onClick={() => handleEditClick(question.questionID)} />
                </button>
                <button onClick={() => handleDeleteClick(question.questionID)}>
                  <FaTrashCan />
                </button>
              </div>
            </div>
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

  const deleteAction = async () => {
    const response = await adminDeleteQuestion(itemToDelete.questionID);
    if (!response.ok) return;
    const updatedQuestions = chapterTestQuestions.filter(
      (eachQuestion) => itemToDelete.questionID !== eachQuestion.questionID
    );
    setChapterTestQuestions(updatedQuestions);
    router.push(pathname);
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
      {itemToDelete && (
        <ConfirmDeleteModal
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteAction}
        />
      )}
      {itemToEdit && <EditQuestionForm item={itemToEdit} />}
    </section>
  );
};

export default ChapterTest;
