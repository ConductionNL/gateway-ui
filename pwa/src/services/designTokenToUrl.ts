export const designTokenToUrl = (tokenKey: string) => {
  return tokenKey.slice(5, -1).replace(/\\/g, "");
};
