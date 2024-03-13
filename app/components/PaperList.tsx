import Paper, { PaperProps } from "./Paper";

function PaperList({ papers }: { papers: PaperProps[] }) {
  return (
    <div className="paper-list">
      {papers.map((paper) => (
        <Paper key={paper.id} {...paper} />
      ))}
    </div>
  );
}

export default PaperList;
