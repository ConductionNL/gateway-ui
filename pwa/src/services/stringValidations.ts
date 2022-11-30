export const validateStringAsCronTab = (crontab: string): boolean | string => {
  if (!crontab) return true;

  const cronregex = new RegExp(
    /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
  );

  if (cronregex.test(crontab)) {
    return true;
  } else {
    return "This is not valid crontab. see https://crontab.guru/ to create an interval.";
  }
};

export const validateThrowsArray = (rawString: string): boolean | string => {
  if (!rawString) return true;

  try {
    return Array.isArray(JSON.parse(rawString)) ? true : "The JSON needs to be within an array.";
  } catch {
    return "This is not valid JSON";
  }
};
