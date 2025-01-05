import { replaceUrl } from "@/setup"; // Import replaceUrl from the setup file
import React, { useEffect, useRef } from "react"; // Import React, useEffect, and useRef from React

// DynamicStyleTag component, which expects a styles prop
const DynamicStyleTag = ({ styles }) => {
  // Default to an empty array if styles prop is not provided
  if (!styles) {
    styles = [];
  }

  // Create a ref to track previously applied styles
  const prevStylesRef = useRef([]);

  // useEffect to run when the styles prop changes
  useEffect(() => {
    // Check if the styles have changed
    const stylesChanged =
      JSON.stringify(styles) !== JSON.stringify(prevStylesRef.current);

    // If styles have changed
    if (stylesChanged) {
      // Remove previously applied styles
      prevStylesRef.current.forEach((style) => {
        if (style.src) {
          // If style.src exists, find and remove the <link> tag
          const styleElement = document.querySelector(
            `link[href="${style.src}"]`
          );
          styleElement && styleElement.remove();
        }
        if (style.content) {
          // If style.content exists, find and remove the <style> tag by data-id
          const styleElement = document.querySelector(
            `style[data-id="${style.id}"]`
          );
          styleElement && styleElement.remove();
        }
      });

      // Inject new styles
      styles.forEach((style) => {
        const styleCopy = { ...style };

        if (styleCopy.src) {
          // If styleCopy.src is not an absolute URL, prepend replaceUrl
          if (!styleCopy.src.startsWith("http")) {
            styleCopy.src = replaceUrl + styleCopy.src;
          }

          // Create a new <link> tag and append it to the document head
          const styleElement = document.createElement("link");
          styleElement.rel = "stylesheet";
          styleElement.href = styleCopy.src;
          document.head.appendChild(styleElement);
        }

        if (styleCopy.content) {
          // Create a new <style> tag and append it to the document head
          const styleElement = document.createElement("style");
          styleElement.innerHTML = styleCopy.content;
          styleElement.dataset.id = styleCopy.id;
          document.head.appendChild(styleElement);
        }
      });

      // Update the ref with the current styles
      prevStylesRef.current = styles;
    }
  }, [styles]);

  return null; // This component does not render any visible output
};

export default DynamicStyleTag; // Export the DynamicStyleTag component
