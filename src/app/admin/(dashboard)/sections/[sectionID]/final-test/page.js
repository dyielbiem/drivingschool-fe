"use client";
import { useChapters, useSectionTestQuestions } from "@/state/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import AddQuestionForm from "@/components/AddQuestionForm";
import handleSectionTestQuestionSubmit from "@/actions/handleSectionTestQuestionSubmit";
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteQuestion from "@/services/api/adminDeleteQuestion";

const FinalTest = () => {
  const { chapters } = useChapters();
  const {
    sectionTestQuestions,
    setNewSectionTestQuestion,
    setSectionTestQuestions
  } = useSectionTestQuestions();
  const pathname = usePathname();
  const sectionID = pathname.split("/").at(3);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [itemToDelete, setItemToDelete] = useState(undefined);

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
            <div className="top">
              <h2>
                <span>{String(index + 1).padStart(2, "0")}.</span>{" "}
                {question.question}
              </h2>
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
      {renderTest()}
      {searchParams.get("add_question") === "true" && (
        <AddQuestionForm
          submitAction={handleSectionTestQuestionSubmit}
          parentID={sectionID}
          setNewTestQuestion={setNewSectionTestQuestion}
        />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          itemToDelete={itemToDelete.question}
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteAction}
        />
      )}
    </section>
  );
};

export default FinalTest;
