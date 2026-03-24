import { useContext } from 'react';
import { DesignContext, DEFAULT_DARK } from '@/contexts/DesignContext';

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    return {
      getDesign: () => DEFAULT_DARK,
      getLayout: () => 'default',
      refreshDesign: () => {},
      loading: false,
      presetsBySection: {},
    };
  }
  return context;
};
