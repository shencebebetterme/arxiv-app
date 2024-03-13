const paperCount: number = 2435999;

function PageHeader() {
  const paperCountStr: string = paperCount.toLocaleString();
  return (
    <header>
      <h1 className="p-10 text-3xl font-bold text-center text-sky-800">
        Search in <span className="p-4 text-red-400">{paperCountStr}</span>{" "}
        arXiv papers!
      </h1>
    </header>
  );
}

export default PageHeader;
