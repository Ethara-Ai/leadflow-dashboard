import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/dashboard.jsx';
import LoadingScreen from './components/LoadingScreen';
import { MAX_LOADING_TIME, MIN_LOADING_TIME } from './constants/index.js';

/**
 * Loading state machine states
 */
const LOADING_STATE = {
  LOADING: 'loading',
  MIN_TIME_ELAPSED: 'minTimeElapsed',
  READY: 'ready',
};

/**
 * App Component
 * Root application component that handles initial loading state
 * and renders the main dashboard once ready.
 */
function App() {
  const [loadingState, setLoadingState] = useState(LOADING_STATE.LOADING);

  /**
   * Determine if we should show the loading screen
   * Only hide when both conditions are met:
   * 1. Minimum display time has elapsed (for smooth UX)
   * 2. Document is fully loaded OR max time has elapsed
   */
  const isLoading = loadingState === LOADING_STATE.LOADING;

  const checkIfReady = useCallback((minTimeElapsed, documentLoaded, maxTimeElapsed) => {
    // If max time has elapsed, force ready regardless of document state
    if (maxTimeElapsed) {
      return true;
    }
    // Otherwise, require both min time and document loaded
    return minTimeElapsed && documentLoaded;
  }, []);

  useEffect(() => {
    let minTimeoutId;
    let maxTimeoutId;
    let isCleanedUp = false;

    // Track state flags
    let minTimeElapsed = false;
    let documentLoaded = document.readyState === 'complete';
    let maxTimeElapsed = false;

    /**
     * Check if we can transition to ready state
     */
    const maybeSetReady = () => {
      if (isCleanedUp) return;

      if (checkIfReady(minTimeElapsed, documentLoaded, maxTimeElapsed)) {
        setLoadingState(LOADING_STATE.READY);
      }
    };

    /**
     * Handle minimum time elapsed
     */
    minTimeoutId = setTimeout(() => {
      minTimeElapsed = true;
      maybeSetReady();
    }, MIN_LOADING_TIME);

    /**
     * Handle maximum time elapsed (failsafe)
     */
    maxTimeoutId = setTimeout(() => {
      maxTimeElapsed = true;
      maybeSetReady();
    }, MAX_LOADING_TIME);

    /**
     * Handle document load event
     */
    const handleLoad = () => {
      documentLoaded = true;
      maybeSetReady();
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      documentLoaded = true;
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Cleanup function
    return () => {
      isCleanedUp = true;
      clearTimeout(minTimeoutId);
      clearTimeout(maxTimeoutId);
      window.removeEventListener('load', handleLoad);
    };
  }, [checkIfReady]);

  return (
    <>
      <AnimatePresence mode="wait">{isLoading && <LoadingScreen key="loading" />}</AnimatePresence>
      {!isLoading && <Dashboard />}
    </>
  );
}

export default App;
