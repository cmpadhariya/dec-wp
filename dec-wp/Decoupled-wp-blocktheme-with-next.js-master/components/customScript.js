import { replaceUrl } from "@/setup";
import React, { useEffect, useRef } from "react";

const DynamicScriptTag = ({ scripts }) => {
  // Ensure scripts is an array to avoid errors if no scripts are passed
  if (!scripts) {
    scripts = [];
  }

  // Create a ref to store the previous scripts
  const prevScriptsRef = useRef([]);

  useEffect(() => {
    // Check if the scripts have changed by comparing the new scripts with the previous ones
    const scriptsChanged =
      JSON.stringify(scripts) !== JSON.stringify(prevScriptsRef.current);

    if (scriptsChanged) {
      // Remove previous script elements from the DOM if they exist
      prevScriptsRef.current.forEach((script) => {
        if (script.src) {
          const scriptElement = document.querySelector(
            `script[src="${script.src}"]`
          );
          scriptElement && scriptElement.remove();
        }
        if (script.content) {
          const scriptElement = document.querySelector(
            `script[data-id="${script.id}"]`
          );
          scriptElement && scriptElement.remove();
        }
      });

      // Add new script elements to the DOM
      scripts.forEach((script) => {
        const scriptCopy = { ...script }; 

        // If the script has a source, ensure it's a full URL by prepending replaceUrl if necessary
        if (scriptCopy.src) {
          if (!scriptCopy.src.startsWith("http")) {
            scriptCopy.src = replaceUrl + scriptCopy.src;
          }

          const scriptElement = document.createElement("script");
          scriptElement.src = scriptCopy.src;
          document.body.appendChild(scriptElement);
        }

        // If the script has content, create a script element with the content
        if (scriptCopy.content) {
          const scriptElement = document.createElement("script");
          scriptElement.innerHTML = scriptCopy.content;
          scriptElement.dataset.id = scriptCopy.id; // Use data-id attribute to identify the script
          document.body.appendChild(scriptElement);
        }
      });

      // Update the previous scripts ref to the current scripts
      prevScriptsRef.current = scripts;
    }
  }, [scripts]);

  // This component does not render any visible elements
  return null;
};

export default DynamicScriptTag;
