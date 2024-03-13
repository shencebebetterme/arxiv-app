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

// import React, { useEffect, useState } from "react";

import PageHeader from "./components/Header";
import SearchBox from "./components/SearchBox";
import { PaperProps } from "./components/Paper";
import SearchParent from "./components/SearchParent";
import "katex/dist/katex.min.css";
import { Config } from "@/app/components/Config";

async function getInitPapers() {
  const response = await fetch(Config.flask_address + "/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ num: Config.init_topk }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}

async function HomePage() {
  const papers: PaperProps[] = await getInitPapers();
  return (
    <div id="main">
      <PageHeader />
      <SearchParent papers={papers} />
    </div>
  );
}

export default HomePage;
