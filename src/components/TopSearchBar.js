"use client";
import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const TopSearchBar = ({ placeholder }) => {
  const inputRef = useRef(undefined);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchClick = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("search", inputRef.current.value);
    currentParams.set("page", 1);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const handleEnterClick = (event) => {
    if (event.key !== "Enter") return;
    handleSearchClick();
  };

  const handleInputClear = () => {
    if (!inputRef.current || inputRef?.current?.value) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("search");
    currentParams.set("page", 1);
    router.push(`${pathname}?${currentParams}`);
  };

  if (searchParams.get("edit_student") || searchParams.get("student")) {
    return null;
  }

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
