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
