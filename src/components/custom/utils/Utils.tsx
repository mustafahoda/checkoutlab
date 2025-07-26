import React from "react";

export const parseStringWithLinks = (text: string) => {
  const linkPattern = /\[(.*?)\]\((.*?)\)/g;
  const parts: any = [];
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    const [fullMatch, linkText, linkUrl] = match;
    const startIndex = match.index;

    // Push the text before the link
    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    // Push the link
    parts.push(
      <a
        style={{ color: "blue" }}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        key={linkUrl}
      >
        {linkText}
      </a>
    );

    lastIndex = startIndex + fullMatch.length;
  }

  // Push the remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};
