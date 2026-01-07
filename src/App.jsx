import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ZoolabDashboard from "./components/ZoolabDashboard";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a maximum loading time of less than 5 seconds (using 4 seconds)
    const maxLoadingTime = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    // Also check if the page is fully loaded
    const handleLoad = () => {
      // Add a minimum display time for the loading animation (at least 1.5 seconds)
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    // If the document is already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(maxLoadingTime);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
      {!isLoading && <ZoolabDashboard />}
    </>
  );
}

export default App;
