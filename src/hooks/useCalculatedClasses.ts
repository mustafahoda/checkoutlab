import { useEffect, useState } from "react";

interface ClassHook {
  result: object | null;
  error: object | null;
  loading: boolean;
}
const traverseAdyenComponent = (root: HTMLElement | null): string[] => {
  if (!root) return [];

  const classes: string[] = [];
  const queue: HTMLElement[] = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    // Add only Adyen-specific classes
    if (current.className && typeof current.className === "string") {
      const elementClasses = current.className.split(" ");
      classes.push(
        ...elementClasses.filter((className) =>
          className.startsWith("adyen-checkout_")
        )
      );
    }

    // Add all child elements to queue
    const children = Array.from(current.children) as HTMLElement[];
    queue.push(...children);
  }

  // Filter out duplicates
  return [...new Set(classes)];
};
const addPropertiesToClasses = (classes: string[]) => {
  const styles: any = {};
  const additionalProperties: any = {
    type: "class",
    additionalProperties: {
      "background-color": {
        type: "color",
        description:
          "The background-color CSS property sets the background color of an element.",
      },

      "border-color": {
        type: "color",
        description:
          "The border-color CSS property sets the color of an element's border.",
      },
      "border-radius": {
        type: "size",
        description:
          "The border-radius CSS property rounds the corners of an element's outer border edge.",
      },
      "border-width": {
        type: "size",
        description:
          "The border-width CSS property sets the width of the border of an element.",
      },
      color: {
        type: "color",
        description:
          "The color CSS property sets the foreground color value of an element's text and text decorations.",
      },
      "font-family": {
        type: "font-family",
        values: ["Arial", "Helvetica", "sans-serif"],
        description: "The font family to use for the selector",
      },
      "font-size": {
        type: "size",
        description: "The font-size CSS property sets the size of the font.",
      },
      margin: {
        type: "size",
        description:
          "The margin CSS property sets the margin area on all four sides of an element.",
      },
      padding: {
        type: "size",
        description:
          "The padding CSS property sets the padding area on all four sides of an element.",
      },
    },
  };
  classes.forEach((className) => {
    styles[`.${className}`] = {
      ...additionalProperties,
      selector: className,
    };
  });
  return styles;
};

export const useCalculatedClasses = (
  checkoutRef: any,
  isReady: boolean
): ClassHook => {
  const [error, setError] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<object | null>(null);
  useEffect(() => {
    if (isReady) {
      try {
        const componentClasses = traverseAdyenComponent(checkoutRef.current);
        setResult(addPropertiesToClasses(componentClasses));
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    }
  }, [isReady]);

  return { result, error, loading };
};
