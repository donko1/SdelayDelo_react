export const isParallel = () => {
    return import.meta.env.VITE_IS_PARALLEL === '1';
  };

export const isProduct = () => {
  return import.meta.env.VITE_IS_PRODUCT === '1';
};
  
export function get_COOKIE_EXPIRES_DAYS() {
  return import.meta.env.COOKIE_EXPIRES_DAYS;
}
