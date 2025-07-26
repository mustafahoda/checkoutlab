// useViewport.ts
import { useEffect, useState } from "react";

interface Viewport {
  width: number | null;
  height: number | null;
}

const useViewport = (): Viewport => {
  const [viewport, setViewport] = useState<Viewport>({
    width: null,
    height: null,
  });

  useEffect(() => {
    // Function to update the viewport size
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Ensure this code runs only in the browser
    if (typeof window !== "undefined") {
      // Set initial size
      handleResize();

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Cleanup event listener on component unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return viewport;
};

export default useViewport;