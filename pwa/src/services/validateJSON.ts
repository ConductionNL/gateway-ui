export const validateStringAsJSONArray = (rawString: string): boolean | string => {
  if (!rawString) return true;

  try {
    return Array.isArray(JSON.parse(rawString)) ? true : "The JSON needs to be within an array.";
  } catch {
    return "This is not valid JSON";
  }
};

export const validateStringAsJSON = (rawString: string): boolean | string => {
  if (!rawString) return true;

  try {
    JSON.parse(rawString);

    return true;
  } catch {
    return "This is not valid JSON";
  }
};

export const validateStringAs24DigitHex = (rawString: string): boolean | string => {
  if (!rawString) return true;

  const hexCodePattern = /^[0-9a-fA-F]{24}$/;

  if (hexCodePattern.test(rawString)) return true;

  return "This is not a valid 24 digit hex code.";
};
