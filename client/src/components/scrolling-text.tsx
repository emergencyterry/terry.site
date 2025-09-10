import { useState, useEffect } from "react";

export default function ScrollingText() {
  const [scrollingText, setScrollingText] = useState("PLACEHOLDER");

  useEffect(() => {
    // Fetch the scrolling text from the root text file
    const fetchScrollingText = async () => {
      try {
        const response = await fetch('/scrolling-text.txt');
        if (response.ok) {
          const text = await response.text();
          setScrollingText(text.trim());
        }
      } catch (error) {
        console.error('Failed to load scrolling text:', error);
        setScrollingText("PLACEHOLDER");
      }
    };

    fetchScrollingText();
  }, []);

  return (
    <div className="bg-terminal-green text-background p-2 overflow-hidden whitespace-nowrap relative">
      <div className="scrolling-text-animation inline-block">
        <span className="font-mono text-sm font-bold">
          {scrollingText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {scrollingText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {scrollingText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {scrollingText}
        </span>
      </div>
    </div>
  );
}