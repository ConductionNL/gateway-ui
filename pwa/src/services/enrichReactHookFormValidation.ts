import { FieldValues, RegisterOptions } from "react-hook-form";

type TValidation = Omit<RegisterOptions<FieldValues, any>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;

export const enrichValidation = (validation: TValidation): TValidation => {
  const enrichedValidation: TValidation = validation;

  for (const [key, value] of Object.entries(validation)) {
    switch (key) {
      case "required":
        enrichedValidation[key] = "This field is required";
        break;

      case "minLength":
        enrichedValidation[key] = { value, message: `Did not meet the minimum length of ${value}` };
        break;

      case "maxLength":
        enrichedValidation[key] = { value, message: `Exceeded the maximum length of ${value}` };
        break;

      case "min":
        enrichedValidation[key] = { value, message: `Did not meet the minimum value of ${value}` };
        break;

      case "max":
        enrichedValidation[key] = { value, message: `Exceeded the maximum value of ${value}` };
        break;

      case "pattern":
        enrichedValidation[key] = { value, message: `Did not match the expected pattern: ${value}` };
        break;
    }
  }

  return enrichedValidation;
};
