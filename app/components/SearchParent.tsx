// # Copyright (c) 2023 Baidu, Inc. All Rights Reserved.
// #
// # Licensed under the Apache License, Version 2.0 (the "License");
// # you may not use this file except in compliance with the License.
// # You may obtain a copy of the License at
// #
// #     http://www.apache.org/licenses/LICENSE-2.0
// #
// # Unless required by applicable law or agreed to in writing, software
// # distributed under the License is distributed on an "AS IS" BASIS,
// # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// # See the License for the specific language governing permissions and
// # limitations under the License.

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
