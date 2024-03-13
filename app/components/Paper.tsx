import styles from "./Paper.module.css";
import MathReactKatex from "./MathReactKatex";
import MathKatex from "./MathKatex";

export interface PaperProps {
  id: string;
  title: string;
  //   authors: string[];
  authors: string;
  abstract: string;
  tags: string;
}

function parse_id(id: string) {
  // replace '/' with '_'
  return id.replace(/\//g, "_");
}

const handleOpen = async (id: string) => {
  // Fetch data from the server
  const response = await fetch("/open", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
  const data = await response.json();
};

function Paper({ id, title, authors, abstract, tags }: PaperProps) {
  const tags_list = tags.split(" ");
  const parsed_id = parse_id(id);

  return (
    // <div className="p-4 mt-5 bg-slate-100 rounded-lg">
    <div className="card bg-base-200 p-4 mt-5">
      <div className="text-xl font-semibold">{title}</div>
      {/* <div className="authors">{authors.join(", ")}</div> */}
      <div className="italic text-sm text-amber-900">{authors}</div>
      <div className="font-semibold text-sm text-blue-900">
        <a
          href={`https://arxiv.org/abs/${id}`}
          target="_blank"
          className="link"
        >
          {id}
        </a>
        <span className="px-2 text-sky-700">|</span>
        <span
          className="btn btn-xs btn-outline btn-secondary"
          onClick={() => handleOpen(id)}
        >
          open
        </span>
        <span className="px-2 text-sky-700">|</span>
        <span className="text-sky-700">{tags}</span>
      </div>
      <div className="text-base text-slate-700">
        <MathReactKatex text={abstract} />
        {/* {abstract} */}
      </div>
      <div className="showSimilar">
        {/* <a href={`/similar/${id}`} target="_blank">
          Show similar papers
        </a> */}
        <a
          href={`/similar/${parsed_id}`}
          target="_blank"
          role="button"
          className="btn btn-xs btn-outline btn-primary"
        >
          Similar
        </a>
      </div>
    </div>
  );
}

export default Paper;
