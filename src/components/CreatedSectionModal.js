import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CreatedSectionModal = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const confirmClick = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete("create_section");
    router.replace(`${pathname}?$${currentParams}`);
  };

  return (
    <div className="created-section-modal">
      <div>
        <h3>A new section has been successfully created!</h3>
        <p>
          A newly created section starts out inactive. Complete its content and
          then activate it for it to be utilized.
        </p>
        <button onClick={confirmClick}>Confirm</button>
      </div>
    </div>
  );
};

export default CreatedSectionModal;
