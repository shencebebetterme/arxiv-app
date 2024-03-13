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

import Paper, { PaperProps } from "./Paper";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "react-query";
import { QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient();

const numInPage = 5;

// async function fetchData(papers: PaperProps[], page: number) {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return papers.slice((page - 1) * numInPage, page * numInPage);
// }

// generate random integer between min and max
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function PaperList({ papers }: { papers: PaperProps[] }) {
  const numPapers = papers.length;
  const numPages = Math.ceil(numPapers / numInPage);
  const waitingTime = getRandomInt(100, 200);
  // mock database fetch
  const fetchData = async (page: number) => {
    await new Promise((resolve) => setTimeout(resolve, waitingTime));
    return papers.slice((page - 1) * numInPage, page * numInPage);
  };

  // solve the problem of not loading search page
  const queryKey = useMemo(
    () => ["papers", { first_paper_id: papers[0]?.id }],
    [papers]
  );

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    {queryKey:[queryKey]},
    async ({ pageParam = 1 }) => {
      const response = await fetchData(pageParam);
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

  const _papers = data?.pages.flatMap((page) => page);


  return (
    <div>
      {papers?.map((paper, i) => {
        if (papers.length - 1 === i)
          return (
            // <div ref={ref}>
              <Paper key={paper.id} {...paper} />
            // </div>
          );
        return <Paper key={paper.id} {...paper} />;
      })}
      <button
        onClick={() => {
          fetchNextPage();
        }}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          <div>
            <span className="loading loading-spinner text-primary w-16 h-16"></span>
          </div>
        ) : (data?.pages.length ?? 0) < numPages ? (
          <div>
            <span className="loading loading-spinner text-primary w-16 h-16"></span>
          </div>
        ) : (
          ""
        )}
      </button>
    </div>
  );
}

export default function PaperListScroll({ papers }: { papers: PaperProps[] }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperList papers={papers} />
    </QueryClientProvider>
  );
}
