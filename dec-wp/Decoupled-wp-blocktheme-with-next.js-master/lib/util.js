// UrlReplacer.js
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link from Next.js for client-side routing
import { replaceUrl } from "@/setup";

const UrlReplacer = ({ templateContent }) => {
  // State to hold the modified content
  const [modifiedContent, setModifiedContent] = useState([]);

  // State to hold the values of input fields
  const [inputValues, setInputValues] = useState({});

  // Function to parse HTML content and convert it to React elements
  const parseHTML = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const reactElements = [];

    // Function to handle form submission
    const onSubmit = (e, formNode) => {
      e.preventDefault();
      const formData = new FormData(formNode);
      const data = {};
      for (const pair of formData.entries()) {
        data[pair[0]] = pair[1];
      }

      // Create FormData object to send to REST API
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Define REST API endpoint URL
      const apiUrl = `${replaceUrl}/wp-json/contact-form-7/v1/contact-forms/${data["_wpcf7"]}/feedback`;

      // Define fetch options
      const requestOptions = {
        method: "POST",
        body: formDataToSend,
      };

      // Send POST request to REST API endpoint
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // Reset form after successful submission
          formNode.reset();
        })
        .catch((error) => {
          console.error("Error sending form data to REST API:", error);
        });
    };

    // Function to traverse HTML nodes and convert them to React elements
    const traverseNodes = (nodes) => {
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          reactElements.push(node.textContent);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          const attributes = {};

          for (let i = 0; i < node.attributes.length; i++) {
            let attributeName = node.attributes[i].name;
            let attributeValue = node.getAttribute(attributeName);

            // Handle special cases for attribute names
            // (e.g., convert dash-separated attribute names to camelCase)
            // Add more cases as needed
            if (attributeName === "class") {
              attributes["className"] = attributeValue || "";
            } else if (attributeName === "stroke-width") {
              attributes["strokeWidth"] = attributeValue || "";
            } else if (
              attributeName === "href" &&
              attributeValue &&
              !attributeValue.includes(window.location.host)
            ) {
              attributes[attributeName] =
                attributeValue.replace(replaceUrl, "") || "";
            } else if (attributeName === "src") {
              attributes[attributeName] = attributeValue || "";
            } else if (attributeName === "for") {
              attributes["htmlFor"] = attributeValue || "";
            } else if (attributeName === "spellcheck") {
              attributes["spellCheck"] = attributeValue || "";
            } else if (attributeName === "tabindex") {
              attributes["tabIndex"] = attributeValue || "";
            } else if (attributeName === "srcset") {
              attributes["srcSet"] = attributeValue || "";
            } else if (attributeName === "datetime") {
              attributes["dateTime"] = attributeValue || "";
            } else if (attributeName === "style") {
              // Convert inline style string to camelCase
              const styleString = attributeValue;
              if (styleString) {
                const styles = styleString.split(";").reduce((acc, curr) => {
                  const [key, value] = curr
                    .split(":")
                    .map((item) => item.trim());
                  if (key && value) {
                    const camelCaseKey = key.replace(/-([a-z])/g, function (g) {
                      return g[1].toUpperCase();
                    });
                    acc[camelCaseKey] = value;
                  }
                  return acc;
                }, {});
                attributes[attributeName] = styles;
              }
            } else if (attributeName === "novalidate") {
              attributes["noValidate"] = attributeValue || "";
            } else if (attributeName === "autocomplete") {
              attributes["autoComplete"] = attributeValue || "";
            } else if (typeof attributeName !== undefined) {
              attributes[attributeName] = attributeValue || "";
            }
          }

          if (tagName === "a") {
            let href = node.getAttribute("href");
            const currentUrl = window.location.href;
            const urlParts = currentUrl.split("/");
            const archivePart1 = urlParts[urlParts.length - 3];
            const archivePart2 = urlParts[urlParts.length - 2];
            const pageNumberMatch = href.match(/page=(\d+)/);
            const specialPageMatch = href.match(/\/(.*?)\?cst/);
            const constructedArchiveUrl = `${archivePart1}/${archivePart2}/`;
            const fullConstructedUrl = `${window.location.protocol}//${constructedArchiveUrl}`;
            const isArchivePage = fullConstructedUrl === currentUrl;
  
            if (isArchivePage) {
              if (pageNumberMatch) {
                const pageNumber = pageNumberMatch[1];
                if (node.classList.contains("wp-block-query-pagination-next")) {
                  attributes["href"] = `${archivePart2}/${pageNumber}`;
                } else {
                  attributes["href"] = `${archivePart2}/${pageNumber}`;
                }
              } else if (node.classList.contains("page-numbers")) {
                attributes["href"] = archivePart1;
              } 
            }
  
            if (!isArchivePage) {
              if (pageNumberMatch) {
                const pageNumber = pageNumberMatch[1];
                attributes["href"] = `${archivePart1}/${pageNumber}`;
              } else if (node.classList.contains("page-numbers")) {
                attributes["href"] = archivePart1;
              }
            }
  
            if (specialPageMatch) {
              const specialPageIdentifier = specialPageMatch[1];
              attributes["href"] = `${archivePart1}/${specialPageIdentifier}`;
            }
            if (href && !href.includes(window.location.host)) {
              href = href.replace(replaceUrl, window.location.host) || "";
              reactElements.push(
                <Link key={reactElements.length} href={href} {...attributes}>
                  {parseHTML(node.innerHTML)}
                </Link>
              );
            } else {
              reactElements.push(
                React.createElement(
                  tagName,
                  { key: reactElements.length, ...attributes },
                  parseHTML(node.innerHTML)
                )
              );
            }
          } else if (tagName === "br") {
            reactElements.push(
              <br key={reactElements.length} {...attributes} />
            );
          } else if (tagName === "img") {
            reactElements.push(
              <img key={reactElements.length} {...attributes} />
            );
          } else if (tagName === "textarea") {
            reactElements.push(
              <textarea
                key={reactElements.length}
                defaultValue={node.textContent}
                {...attributes}
              />
            );
          } else if (tagName === "form") {
            reactElements.push(
              <form
                key={reactElements.length}
                onSubmit={(e) => onSubmit(e, e.target)}
              >
                {parseHTML(node.innerHTML)}
              </form>
            );
          } else if (tagName === "input") {
            const inputName =
              node.getAttribute("name") ||
              node.getAttribute("id") ||
              `input-${reactElements.length}`;

            const inputType = node.getAttribute("type");
            const inputKey = `input-${inputName}`;

            if (inputType === "hidden" || inputType === "submit") {
              const modifiedAttributes = {
                ...attributes,
                value: attributes.value !== undefined ? attributes.value : "",
              };

              delete modifiedAttributes.defaultValue;

              reactElements.push(
                <input key={inputKey} {...modifiedAttributes} />
              );
            } else {
              // Set initial input values
              setInputValues({
                ...inputValues,
                [inputKey]: attributes.value,
              });
              delete attributes.value;

              // Render input element with controlled component approach
              reactElements.push(
                <input
                  key={inputKey}
                  defaultValue={inputValues[inputKey] || ""}
                  onChange={(e) => {
                    e.preventDefault();

                    setInputValues({
                      ...inputValues,
                      [inputKey]: e.target.value,
                    });
                  }}
                  {...attributes}
                />
              );
            }
          } else {
            if (node.childNodes.length > 0) {
              reactElements.push(
                React.createElement(
                  tagName,
                  { key: reactElements.length, ...attributes },
                  parseHTML(node.innerHTML)
                )
              );
            } else {
              reactElements.push(
                React.createElement(tagName, {
                  key: reactElements.length,
                  ...attributes,
                })
              );
            }
          }
        }
      });
    };

    traverseNodes(doc.body.childNodes);

    return reactElements;
  };

  // Effect hook to parse HTML content when templateContent changes
  useEffect(() => {
    if (templateContent) {
      const modifiedContent = parseHTML(templateContent);
      setModifiedContent(modifiedContent);
    } else {
      setModifiedContent([""]);
    }
  }, [templateContent]);

  // Render modified content as React elements
  return (
    <div>
      {modifiedContent.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </div>
  );
};

export default UrlReplacer;