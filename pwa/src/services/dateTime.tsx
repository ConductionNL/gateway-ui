import _ from "lodash";
import { languageOptions, TLanguageCodes } from "../data/languageOptions";

export const dateTime = (language: TLanguageCodes, dateTime: string): JSX.Element => {
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

export const formatDateTime = (language: TLanguageCodes, dateTime: string): string => {
  const newDate = new Date(Date.parse(dateTime));

  const _language = languageOptions.find((_language) => _language.label === _.upperCase(language));

  const localDate = newDate.toLocaleDateString(_language?.value);
  const localTime = newDate.toLocaleTimeString(_language?.value);

  return `${localDate} | ${localTime}`;
};
