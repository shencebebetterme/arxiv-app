"use client";

import React, { useEffect, useState } from "react";
import styles from "./SearchBox.module.css";

function SearchBox() {
  const [text, setText] = useState("");

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // Prevents the default action (newline) from occurring
      // Send text to backend
      try {
        const response = await fetch("/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        });
        const responseData = await response.json();
        // console.log("Response:", responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="px-1">
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Type your text here, press Shift+Enter to send"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      ></textarea>
    </div>
  );
}

export default SearchBox;
