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

// components/MathRenderer.js
import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function MathReactKatex({ text }: { text: string }) {
  // Replace ``...'' with LaTeX quotation marks
  text = text.replace(/``/g, "“").replace(/''/g, "”");
  // // Replace `...' with LaTeX quotation marks
  // text = text.replace(/`/g, "``").replace(/'/g, "''");

  // Regular expression to match $...$
  const regex = /\$(.*?)\$/g;

  let lastIndex = 0;
  const elements = [];
  let match;
  let matchIndex = 0; // Create a separate index for matches

  // Loop through all matches
  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Push LaTeX match
    elements.push(<InlineMath key={`math-${matchIndex++}`} math={match[1]} />);

    // Update last index
    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    elements.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
  }

  return <>{elements}</>;
}

export default MathReactKatex;
