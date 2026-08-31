"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AutoLinkedText from "@/components/ui/AutoLinkedText";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
  className?: string;
  buttonClassName?: string;
  linkClassName?: string;
}

export default function ReadMore({ 
  text, 
  maxLength = 150, 
  className = "",
  buttonClassName = "mt-2 text-primary font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1",
  linkClassName = "text-primary font-bold underline underline-offset-4 hover:text-orange-600 transition-colors"
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  // Plain text length calculation (excluding markdown link syntax for accurate word count)
  const plainTextLength = text.replace(/\[(.*?)\]\(.*?\)/g, "$1").length;

  if (plainTextLength <= maxLength) {
    return (
      <div className={className}>
        <AutoLinkedText text={text} linkClassName={linkClassName} />
      </div>
    );
  }

  // If not expanded, safely truncate plain text or markdown
  let truncatedText = text;
  if (!isExpanded) {
    // If text has markdown links, let's truncate cleanly
    let accumulated = "";
    let rawIdx = 0;
    const regex = /\[(.*?)\]\((.*?)\)/g;
    let match: RegExpExecArray | null;
    let plainCount = 0;

    while ((match = regex.exec(text)) !== null) {
      const before = text.substring(rawIdx, match.index);
      if (plainCount + before.length >= maxLength) {
        accumulated += before.substring(0, maxLength - plainCount);
        plainCount = maxLength;
        break;
      }
      accumulated += before;
      plainCount += before.length;

      const linkText = match[1];
      const linkUrl = match[2];
      if (plainCount + linkText.length >= maxLength) {
        accumulated += `[${linkText}](${linkUrl})`;
        plainCount += linkText.length;
        break;
      }
      accumulated += `[${linkText}](${linkUrl})`;
      plainCount += linkText.length;
      rawIdx = regex.lastIndex;
    }

    if (plainCount < maxLength && rawIdx < text.length) {
      accumulated += text.substring(rawIdx, rawIdx + (maxLength - plainCount));
    }
    truncatedText = `${accumulated.trim()}...`;
  }

  return (
    <div className="flex flex-col items-start">
      <div className={className}>
        <AutoLinkedText text={isExpanded ? text : truncatedText} linkClassName={linkClassName} />
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={buttonClassName}
      >
        {isExpanded ? (
          <>Read Less <ChevronUp size={14} /></>
        ) : (
          <>Read More <ChevronDown size={14} /></>
        )}
      </button>
    </div>
  );
}
