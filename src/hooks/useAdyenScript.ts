import { useEffect, useState } from "react";

interface AdyenScriptHook {
  error: string | null;
  loading: boolean;
}

const useAdyenScript = (version: string): AdyenScriptHook => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const scriptId = `adyen-script-${version}`;
    const cssId = `adyen-css-${version}`;

    // Remove existing script and CSS if version has changed
    document
      .querySelectorAll('script[id^="adyen-script-"], link[id^="adyen-css-"]')
      .forEach((el: Element) => {
        el.remove();
      });

    // Add the new script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://checkoutshopper-test.cdn.adyen.com/checkoutshopper/sdk/${version}/adyen.js`;
    script.async = true;// 	https://checkoutshopper-test.cdn.adyen.com
    script.onload = () => {
      setLoading(false); // Set loading to false when the script has loaded
    };
    script.onerror = () => {
      setError("Error loading Adyen script");
      setLoading(false);
    }; // Set error if there's an error loading the script
    document.body.appendChild(script);

    // Add the new CSS before the last link in head
    const link = document.createElement("link");
    link.id = cssId;
    link.href = `https://checkoutshopper-test.cdn.adyen.com/checkoutshopper/sdk/${version}/adyen.css`;
    link.type = "text/css";
    link.rel = "stylesheet";

    // Get all link elements in head
    const links = document.head.getElementsByTagName("link");
    const lastLink = links[links.length - 1];

    if (lastLink) {
      // Insert before the last link
      document.head.insertBefore(link, lastLink);
    } else {
      // If no links exist, just append
      document.head.appendChild(link);
    }

    // Cleanup function to remove the script and CSS when the component unmounts
    return () => {
      script.remove();
      link.remove();
    };
  }, [version]); // This effect depends on the version, it will re-run if the version changes

  return { error, loading };
};

export default useAdyenScript;
