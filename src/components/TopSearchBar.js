"use client";
import { FiSearch } from "react-icons/fi";
import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TopSearchBar = ({ placeholder }) => {
  const inputRef = useRef(undefined);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchClick = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    router.push(`${pathname}?search=${inputRef.current.value}`);
  };

  const handleEnterClick = (event) => {
    if (event.key !== "Enter") return;
    handleSearchClick();
  };

  const handleInputClear = () => {
    if (!inputRef.current || inputRef?.current?.value) return;
    router.push(pathname);
  };

  return (
    <div className="top-search-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onKeyDown={handleEnterClick}
        onKeyUp={handleInputClear}
        defaultValue={searchParams.get("search")}
      />
      <button onClick={handleSearchClick}>
        <FiSearch />
      </button>
    </div>
  );
};

export default TopSearchBar;
