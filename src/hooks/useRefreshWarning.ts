import { useBeforeUnload } from 'react-use';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const useRefreshWarning = () => {
  const { buildId, unsavedChanges } = useSelector((state: RootState) => state.formula);

  const hasBuiltWork = buildId !== '1';
  const hasUnsavedChanges = Object.values(unsavedChanges).some(Boolean);
  const shouldWarn = hasBuiltWork || hasUnsavedChanges;

  useBeforeUnload(
    shouldWarn,
    'You have built work or have unsaved changes that will be lost on refresh.'
  );
}; 