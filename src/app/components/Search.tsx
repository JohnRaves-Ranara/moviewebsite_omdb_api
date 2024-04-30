"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useDebounce } from "../custom-hooks/useDebounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("")

  useEffect(()=> {
    setSearchInput(searchParams.get("query") || "")
  },[searchParams])

  const handleSearch = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.delete("with_genres")
      paramsSetAllFromObj(
        [
          ["query", searchTerm],
          ["page", "1"],
        ],
        params
      );
    } else {
      paramsDeleteAllFromObj(["page", "query"], params);
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 500);

  function paramsSetAllFromObj(
    paramsToSet: string[][],
    urlSearchParams: URLSearchParams
  ) {
    paramsToSet.forEach((param) => {
      urlSearchParams.set(param[0], param[1]);
    });
  }

  function paramsDeleteAllFromObj(
    paramsToSet: string[],
    urlSearchParams: URLSearchParams
  ) {
    paramsToSet.forEach((param) => {
      urlSearchParams.delete(param);
    });
  }

  return (
    <div className="w-screen py-8 fixed px-24 z-20">
      <input
        onChange={(e) => {
          setSearchInput(e.target.value)
          handleSearch(e.target.value);
        }}
        value={searchInput}
        placeholder="Enter movie title here..."
        type="text"
        className="bg-gray-800/80 w-full px-5 py-4 text-lg rounded-lg text-white"
      />
    </div>
  );
}
