import { useCallback } from 'react';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useUIStore, type ActiveScreen } from '../../stores/uiStore';

/**
 * Returns a callback that selects an element and navigates to a target screen.
 * Encapsulates the `analysisStore.selectElement + uiStore.setScreen` pattern.
 */
export function useNavigateToElement() {
  const selectElement = useAnalysisStore((s) => s.selectElement);
  const setScreen = useUIStore((s) => s.setScreen);

  return useCallback(
    (elementId: string, screen: ActiveScreen = 'impact') => {
      selectElement(elementId);
      setScreen(screen);
    },
    [selectElement, setScreen],
  );
}
