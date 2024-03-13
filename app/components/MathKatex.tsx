import katex from "katex";

function MathKatex({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
  });

  // return <span dangerouslySetInnerHTML={{ __html: html }} />;
  return <div></div>;
}

export default MathKatex;
