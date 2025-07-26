// Export the bookmarklet code as a string
export const bookmarkletCode = `
(function () {
  // Constants
  const DIALOG_STYLES = {
    padding: "1em",
    width: "300px",
    fontFamily: "sans-serif",
    backgroundColor: "hsl(222.2 84% 4.9%)",
    color: "hsl(210 40% 98%)",
    borderRadius: "0.4rem",
    border: "1px solid hsl(210 40% 98%)",
    fontSize: "0.8rem",
  };

  const HIGHLIGHT_STYLES = 
    '.highlight-green {' +
    '  background-color: rgba(0, 255, 0, 0.2) !important;' +
    '  transition: background-color 0.2s ease;' +
    '  cursor: pointer;' +
    '}';

  // Utility functions
  function applyStyles(element, styles) {
    Object.assign(element.style, styles);
  }

  function sanitizeUrl(url) {
    try {
      const parsed = new URL(url);
      // Only allow specific domains and protocols
      if (!parsed.protocol.match(/^https?:$/)) {
        throw new Error("Invalid protocol");
      }
      // Add more domain validations as needed
      return parsed.toString();
    } catch (e) {
      throw new Error("Invalid URL");
    }
  }

  function createDialog() {
    return new Promise((resolve, reject) => {
      const dialog = document.createElement("dialog");
      applyStyles(dialog, DIALOG_STYLES);

      const label = document.createElement("label");
      label.textContent = "Enter URL to embed:";
      applyStyles(label, {
        fontSize: "0.9rem",
      });

      const paragraph = document.createElement("p");
      paragraph.textContent =
        "Provide the URL of the build, then select where on the page to embed it";
      applyStyles(paragraph, {
        fontSize: "0.7rem",
        marginBottom: "0.3rem",
        marginTop: "0.3rem",
        lineHeight: "1rem",
        color: "hsl(215.4 16.3% 46.9%)",
      });

      const input = document.createElement("input");
      input.type = "text";
      input.value = "https://www.example.com";
      applyStyles(input, {
        width: "100%",
        padding: "0.5em",
        marginBottom: "0.5rem",
        borderRadius: "0.2rem",
        border: "1px solid hsl(217.2 32.6% 17.5%)",
        backgroundColor: "transparent",
        color: "inherit",
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const sanitizedUrl = sanitizeUrl(input.value);
          cleanup();
          resolve(sanitizedUrl);
        } catch (error) {
          input.setCustomValidity(error.message);
          input.reportValidity();
        }
      };

      const cleanup = () => {
        dialog.close();
        dialog.remove();
        okButton.removeEventListener("click", handleSubmit);
        input.removeEventListener("keypress", handleKeypress);
      };

      const handleKeypress = (e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      };

      const buttonContainer = document.createElement("div");
      applyStyles(buttonContainer, {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
      });

      const okButton = document.createElement("button");
      okButton.textContent = "OK";
      applyStyles(okButton, {
        padding: "0.5em 1em",
        borderRadius: "0.2rem",
        border: "1px solid currentColor",
        backgroundColor: "transparent",
        color: "inherit",
        cursor: "pointer",
      });

      okButton.addEventListener("click", handleSubmit);
      input.addEventListener("keypress", handleKeypress);

      label.appendChild(paragraph);
      label.appendChild(input);
      dialog.appendChild(label);
      buttonContainer.appendChild(okButton);
      dialog.appendChild(buttonContainer);

      document.body.appendChild(dialog);
      dialog.showModal();
      input.focus();

      // Timeout to prevent hanging dialogs
      setTimeout(cleanup, 300000); // 5 minutes
    });
  }

  function setupHighlighting() {
    const style = document.createElement("style");
    style.textContent = HIGHLIGHT_STYLES;
    document.head.appendChild(style);
    return style;
  }

  function createIframe(url, targetElement) {
    const iframe = document.createElement("iframe");
    const rect = targetElement.getBoundingClientRect();

    applyStyles(iframe, {
      width: rect.width + "px",
      height: rect.height + "px",
      border: "none",
      backgroundColor: "transparent",
    });

    // Set source and transparency
    iframe.src = url;
    iframe.setAttribute("allowTransparency", "true");

    // Add comprehensive sandbox permissions
    iframe.setAttribute(
      "sandbox",
      [
        "allow-same-origin",
        "allow-scripts",
        "allow-forms",
        "allow-popups",
        "allow-popups-to-escape-sandbox",
        "allow-modals",
        "allow-downloads",
        "allow-storage-access-by-user-activation",
        "allow-presentation",
        "allow-top-navigation",
        "allow-top-navigation-by-user-activation",
      ].join(" ")
    );

    // Add comprehensive feature permissions
    iframe.setAttribute(
      "allow",
      [
        "payment",
        "camera",
        "microphone",
        "geolocation",
        "fullscreen",
        "clipboard-read",
        "clipboard-write",
        "web-share",
      ].join("; ")
    );

    iframe.setAttribute("loading", "lazy");

    return iframe;
  }

  function handleElementReplacement(url) {
    return new Promise((resolve) => {
      let highlightStyle;

      function handleClick(e) {
        if (e.target.closest("dialog")) return;

        e.preventDefault();
        e.stopPropagation();

        const iframe = createIframe(url, e.target);
        e.target.replaceWith(iframe);

        cleanup();
        resolve();
      }

      function handleMouseOver(e) {
        if (!e.target.closest("dialog")) {
          e.target.classList.add("highlight-green");
        }
      }

      function handleMouseOut(e) {
        e.target.classList.remove("highlight-green");
      }

      function cleanup() {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
        if (highlightStyle) highlightStyle.remove();
      }

      highlightStyle = setupHighlighting();

      document.addEventListener("click", handleClick);
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);

      // Timeout to prevent hanging event listeners
      setTimeout(cleanup, 300000); // 5 minutes
    });
  }

  // Main execution
  createDialog()
    .then((url) => handleElementReplacement(url))
    .catch((error) => {
      console.error("Error:", error);
      // Clean up any remaining styles or listeners
      const style = document.querySelector("style.highlight-green");
      if (style) style.remove();
    });
})();
`;

// Optional: Export the function for direct usage
export const executeBookmarklet = () => {
  eval(bookmarkletCode);
};
