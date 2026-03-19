import { useCallback } from 'react';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useUIStore, type ActiveScreen } from '../../stores/uiStore';

/**
 * Shared hook for cross-screen transitions with element pre-selection.
 * Encapsulates the pattern: selectElement(id) + setScreen(target).
 */
export function useNavigateToElement() {
  const selectElement = useAnalysisStore((s) => s.selectElement);
  const setScreen = useUIStore((s) => s.setScreen);

  const navigateToElement = useCallback(
    (elementId: string, screen: ActiveScreen = 'impact') => {
      selectElement(elementId);
      setScreen(screen);
    },
    [selectElement, setScreen],
  );

  return navigateToElement;
}
