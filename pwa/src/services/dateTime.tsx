import _ from "lodash";
import { languageOptions, TLanguageCodes } from "../data/languageOptions";

export const dateTime = (language: TLanguageCodes, dateTime: string) => {
  if (!dateTime) return;

  let _dateTime = Date.parse(dateTime);
  const newDate = new Date(_dateTime);

  const _language = languageOptions.find((_language) => _language.label === _.upperCase(language));

  const localDate = newDate.toLocaleDateString(_language?.value);
  const localTime = newDate.toLocaleTimeString(_language?.value);
  return (
    <div>
      <a>{localDate}</a>
      <br />
      <a>{localTime}</a>
    </div>
  );
};

export const dateTimeTag = (language: TLanguageCodes, dateTime: string) => {
  if (!dateTime) return;

  let _dateTime = Date.parse(dateTime);
  const newDate = new Date(_dateTime);

  const _language = languageOptions.find((_language) => _language.label === _.upperCase(language));

  const localDate = newDate.toLocaleDateString(_language?.value);
  const localTime = newDate.toLocaleTimeString(_language?.value);

  const returnValue = `${localDate} | ${localTime}`;

  return returnValue;
};
