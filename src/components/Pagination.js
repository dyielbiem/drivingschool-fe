import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiMiniEllipsisHorizontal } from "react-icons/hi2";

const Pagination = ({ itemsLength, noOfRows }) => {
  const numberOfPage = Math.ceil(itemsLength / noOfRows);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const router = useRouter();

  if (numberOfPage === 1 || !isFinite(numberOfPage)) return null;

  if (numberOfPage < page) {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", numberOfPage);
    router.replace(`${pathname}?${currentParams}`);
    return null;
  }

  const navigateTo = (page) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page);
    return `${pathname}?${currentParams.toString()}`;
  };

  const renderSelectedStyling = (index) => {
    if (Number(searchParams.get("page")) !== index + 1) return "";
    return "!bg-custom-blue-dark !text-white";
  };

  const setPageVisibility = (index) => {
    if (
      (index + 1 >= page && index + 1 <= page + 2) ||
      (index + 1 <= page && index + 1 >= page - 2)
    )
      return "";
    return "hidden";
  };

  const renderPrevPage = () => {
    if (page === 1) return null;
    return (
      <Link href={navigateTo(page - 1)} className="arrow">
        <FaChevronLeft />
      </Link>
    );
  };

  const renderNextPage = () => {
    if (page === numberOfPage) return null;
    return (
      <Link href={navigateTo(page + 1)} className="arrow">
        <FaChevronRight />
      </Link>
    );
  };

  const renderFirstPage = () => {
    if (page < numberOfPage - 1 || numberOfPage < 5) return null;
    return (
      <>
        <Link href={navigateTo(1)} className="arrow">
          1
        </Link>
        <div>
          <HiMiniEllipsisHorizontal />
        </div>
      </>
    );
  };

  const renderLastPage = () => {
    if (page > 2 || numberOfPage < 5) return null;
    return (
      <>
        <div>
          <HiMiniEllipsisHorizontal />
        </div>
        <Link href={navigateTo(numberOfPage)} className="arrow">
          {numberOfPage}
        </Link>
      </>
    );
  };

  const renderPagination = () => {
    return Array.from(Array(numberOfPage).keys()).map((_, index) => (
      <Link
        key={index}
        href={navigateTo(index + 1)}
        className={`${renderSelectedStyling(index)} ${setPageVisibility(
          index
        )}`}
      >
        {index + 1}
      </Link>
    ));
  };

  return (
    <div className="pagination">
      {renderPrevPage()}
      {renderFirstPage()}
      {renderPagination()}
      {renderLastPage()}
      {renderNextPage()}
    </div>
  );
};

export default Pagination;
