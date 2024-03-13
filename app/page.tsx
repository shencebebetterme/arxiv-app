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
