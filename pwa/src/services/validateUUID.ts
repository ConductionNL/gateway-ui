export const validateUUID = (rawString: string): boolean | string => {
  if (!rawString) return true;

  const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

  if (uuidRegex.test(rawString)) return true;

  return "This is not a valid UUID.";
};
