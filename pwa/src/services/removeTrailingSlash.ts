export const removeTrailingSlash = (str: string) => {
  const newStr = str.endsWith("/") ? str.slice(0, -1) : str;
  return newStr;
};
