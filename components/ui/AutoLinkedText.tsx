"use client";

import React from "react";
import Link from "next/link";

interface AutoLinkedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

/**
 * Parses markdown links [anchor](url), bold **text**, and converts them to clickable Next.js Links
 */
export default function AutoLinkedText({
  text,
  className = "",
  linkClassName = "text-primary font-bold underline underline-offset-4 hover:text-orange-600 transition-colors"
}: AutoLinkedTextProps) {
  if (!text) return null;

  // Split by markdown links [text](url)
  const regex = /\[(.*?)\]\((.*?)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <React.Fragment key={`txt-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </React.Fragment>
      );
    }

    const anchorText = match[1];
    const targetUrl = match[2];

    const isExternal = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

    if (isExternal) {
      elements.push(
        <a
          key={`lnk-${match.index}`}
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {anchorText}
        </a>
      );
    } else {
      elements.push(
        <Link
          key={`lnk-${match.index}`}
          href={targetUrl}
          className={linkClassName}
        >
          {anchorText}
        </Link>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(
      <React.Fragment key={`txt-${lastIndex}`}>
        {text.substring(lastIndex)}
      </React.Fragment>
    );
  }

  return <span className={className}>{elements}</span>;
}
