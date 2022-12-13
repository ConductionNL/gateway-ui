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
