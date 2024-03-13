"use client";

// contains the search box, and the search results

import React, { useState } from "react";
import SearchBox from "./SearchBox";
import { PaperProps } from "./Paper";
import PaperList from "./PaperList";
import PaperListScroll from "./PaperListScroll";
import { Config } from "@/app/components/Config";

function SearchParent({ papers }: { papers: PaperProps[] }) {
  const [searchResults, setSearchResults] = useState(papers);

  const handleSearch = async (query: string) => {
    // Fetch data from the server
    const response = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: query, topk: Config.search_topk }),
    });
    const data = await response.json();
    setSearchResults(data);
  };

  return (
    <div>
      <SearchBox onSearch={handleSearch} />
      <PaperList papers={searchResults} />
      {/* <PaperListScroll papers={searchResults} /> */}
    </div>
  );
}

export default SearchParent;
