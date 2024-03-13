import { PaperProps } from "../../components/Paper";
import SearchParent from "../../components/SearchParent";
import PaperList from "@/app/components/PaperList";
import PaperListScroll from "@/app/components/PaperListScroll";
import { Config } from "@/app/components/Config";

function restore_id(id: string) {
  // replace '_' with '/'
  return id.replace(/_/g, "/");
}

async function getSimilarPapers(id: string) {
  const id_restored = restore_id(id);
  const response = await fetch(Config.flask_address + "/similar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id_restored, topk: Config.similar_topk }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}

// deal with the /similar/id route
export default async function Page({ params }: { params: { id: string } }) {
  console.log(`showing similar papers to ${params.id}`);
  const papers: PaperProps[] = await getSimilarPapers(params.id);
  return (
    <>
      <header>
        <h1 className="p-10 text-3xl font-bold text-center text-sky-800">
          Papers similar to arxiv:
          <span className="text-sky-800">{params.id}</span>
        </h1>
      </header>
      {/* <PaperList papers={papers} /> */}
      <PaperListScroll papers={papers} />
    </>
  );
}
