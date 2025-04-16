export const isParallel = () => {
    return import.meta.env.VITE_IS_PARALLEL === '1';
  };

  export const isProduct = () => {
    return import.meta.env.VITE_IS_PRODUCT === '1';
  };
  
