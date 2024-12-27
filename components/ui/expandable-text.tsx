import React, { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  children: React.ReactNode;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const height = textRef.current.clientHeight;
      setShowButton(height > lineHeight * 2);
    }
  }, [children]);

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={`text-sm ${!isExpanded && showButton ? "line-clamp-2" : ""}`}
      >
        {children}
      </p>
      {showButton && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-sm font-semibold underline mt-1 focus:outline-none"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </span>
      )}
    </div>
  );
};

export default ExpandableText;
