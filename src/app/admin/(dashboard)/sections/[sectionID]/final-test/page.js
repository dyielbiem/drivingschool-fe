"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";

import AddQuestionForm from "@/components/AddQuestionForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditQuestionForm from "@/components/EditQuestionForm";
import TestSettingsForm from "@/components/TestSettingsForm";

import { useChapters, useSectionTestQuestions } from "@/state/store";

import handleSectionTestQuestionSubmit from "@/actions/handleSectionTestQuestionSubmit";
import adminDeleteQuestion from "@/services/api/adminDeleteQuestion";

const FinalTest = () => {
  const { chapters } = useChapters();
  const {
    sectionTestQuestions,
    setNewSectionTestQuestion,
    setSectionTestQuestions,
    setSectionQuestionToShowCount,
    sectionQuestionToShowCount
  } = useSectionTestQuestions();
  const pathname = usePathname();
  const sectionID = pathname.split("/").at(3);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [itemToDelete, setItemToDelete] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(undefined);
  const [isSettingsHidden, setIsSettingsHidden] = useState(true);

  // Observe for delete_question query
  useEffect(() => {
    if (!sectionTestQuestions || !searchParams.get("delete_question"))
      return setItemToDelete(undefined);
    const question = sectionTestQuestions.find(
      (eachQuestion) =>
        eachQuestion.questionID === searchParams.get("delete_question")
    );

    if (!question) return setItemToDelete(undefined);

    setItemToDelete(question);
  }, [searchParams, sectionTestQuestions]);

  // Observe for edit_question query
  useEffect(() => {
    if (!sectionTestQuestions || !searchParams.get("edit_question"))
      return setItemToEdit(undefined);
    const question = sectionTestQuestions.find(
      (eachQuestion) =>
        eachQuestion.questionID === searchParams.get("edit_question")
    );

    if (!question) return setItemToEdit(undefined);

    setItemToEdit(question);
  }, [searchParams, sectionTestQuestions]);

  const handleAddQuestionClick = () => {
    router.push(`${pathname}?add_question=true`);
  };

  const handleBackClick = () => {
    const backRoute = pathname.split("/").slice(0, -1).join("/");
    router.push(backRoute);
  };

  const renderHeader = () => {
    if (!sectionTestQuestions) return <></>;
    return (
      <div className="header">
        <button onClick={handleBackClick} className="back-btn">
          <IoMdArrowRoundBack />
        </button>
        <h1>
          Chapter{" "}
          {!chapters ? "01" : String(chapters?.length + 1).padStart(2, "0")}:
          Final Test
        </h1>
        <button
          className="setting-btn"
          onClick={() => setIsSettingsHidden(false)}
        >
          <IoSettingsSharp />
        </button>
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
    if (sectionTestQuestions?.length === 0) return <></>;
    return (
      <ul className="test-question-container">
        {sectionTestQuestions?.map((question, index) => (
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
    const updatedQuestions = sectionTestQuestions.filter(
      (eachQuestion) => itemToDelete.questionID !== eachQuestion.questionID
    );
    setSectionTestQuestions(updatedQuestions);
    router.push(pathname);
  };

  return (
    <section className="test-section">
      {renderHeader()}
      <div className="content">
        <button onClick={handleAddQuestionClick} className="add-btn">
          Add question
        </button>
        {renderTest()}
      </div>
      {searchParams.get("add_question") === "true" && (
        <AddQuestionForm
          submitAction={handleSectionTestQuestionSubmit}
          parentID={sectionID}
          setNewTestQuestion={setNewSectionTestQuestion}
        />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteAction}
        />
      )}
      {itemToEdit && <EditQuestionForm item={itemToEdit} />}
      {!isSettingsHidden && (
        <TestSettingsForm
          type="section"
          hideForm={setIsSettingsHidden}
          questionToShowCount={sectionQuestionToShowCount}
          parentID={sectionID}
          updateQuestionToShowCount={setSectionQuestionToShowCount}
        />
      )}
    </section>
  );
};

export default FinalTest;
