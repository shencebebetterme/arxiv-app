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

import React, { useState, useRef, useEffect } from "react";
import SearchBox from "./SearchBox";
import { PaperProps } from "./Paper";
import PaperList from "./PaperList";

import { useIntersection } from "@mantine/hooks";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

async function initData(num: number = 10) {
  const response = await fetch("http://127.0.0.1:5001/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ num: 10 }),
  });
  const data: PaperProps[] = await response.json();
  return data;
}

async function searchData(query: string, pageParam: number = 1) {
  const response = await fetch("/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: query, topk: 10, offset: pageParam }),
  });
  const data = await response.json();
  return data;
}

const Page = () => {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["query"],
    async ({ pageParam = 1 }) => {
      const response = await initData(pageParam);
      return response;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [],
        pageParams: [1],
      },
    }
  );

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry]);

  const _posts = data?.pages.flatMap((page) => page);

  return (
    <div>
      <h1>Posts</h1>
      {_posts?.map((paper, i) => {
        if (_posts.length - 1 === i)
          return (
            <div
              className="h-20 text-red bg-slate-500"
              key={paper.id}
              ref={ref}
            >
              {paper.title}
            </div>
          );
        return (
          <div className="h-20 bg-sky-100" key={paper.id}>
            {paper.title}
          </div>
        );
      })}
      <button
        onClick={() => {
          fetchNextPage();
        }}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading..."
          : (data?.pages.length ?? 0) < 20
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

function SearchParent({ papers }: { papers: PaperProps[] }) {
  const [searchResults, setSearchResults] = useState(papers);

  const handleSearch = async (query: string) => {
    // Fetch data from the server
    const data = await searchData(query);
    setSearchResults(data);
  };

  return (
    <div>
      <SearchBox onSearch={handleSearch} />
      <PaperList papers={searchResults} />
    </div>
  );
}

// export default SearchParent;
