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

// components/SearchBox.js
import React, { useState } from "react";

function SearchBox({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // Prevents the default action (newline) from occurring

      setIsSubmitting(true); // Prevents the user from submitting multiple times

      onSearch(query);

      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-1">
      <textarea
        className="textarea textarea-bordered w-full text-base"
        placeholder="Type your text here, press Shift+Enter to send"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      ></textarea>
    </div>
  );
}

export default SearchBox;
