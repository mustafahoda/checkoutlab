import { useEffect, useState } from "react";

export const useStyle = (variant: string, style: string) => {
  const [styleNode, setStyleNode] = useState({
    loading: true,
    error: null,
    success: false,
  });

  const { loading, error, success } = styleNode;

  useEffect(() => {
    if (style) {
      // Create a unique ID for the style tag
      try {
        const styleId = `adyen-style-${variant}`;

        // Remove existing style tag if it exists
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          existingStyle.remove();
        }

        // Create new style element
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = style;

        // Append to document head
        document.head.appendChild(styleElement);

        setStyleNode({
          loading: false,
          error: null,
          success: true,
        });

        // Cleanup function
        return () => {
          const styleToRemove = document.getElementById(styleId);
          if (styleToRemove) {
            styleToRemove.remove();
          }
        };
      } catch (e: any) {
        setStyleNode({
          loading: false,
          error: e,
          success: false,
        });
      }
    }
  }, [style, variant]);

  return { loading, error, success };
};
