import { isValidCron } from "cron-validator";

export const validateStringAsCronTab = (crontab: string): boolean | string => {
  if (!crontab) return true;

  if (isValidCron(crontab)) {
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

export const validatePassword = (value: string, validationValue: string): string | boolean => {
  if (!value && !validationValue) return true;
  if (!value || !validationValue) return "Password does not match";
  if (value === validationValue) {
    return true;
  } else {
    return "Password does not match";
  }
};
