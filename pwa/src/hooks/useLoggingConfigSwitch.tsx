import * as React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { SourceFormLoggingConfigTemplate } from "../templates/templateParts/sourcesForm/SourceFormLoggingConfigTemplate";

export interface ILoggingConfigSwitch {
  callBody?: "boolean",
  callContentType?: "boolean",
  callMethod?: "boolean",
  callQuery?: "boolean",
  callUrl?: "boolean",
  maxCharCountBody?: "int",
  maxCharCountErrorBody?: "int",
  responseBody?: "boolean",
  responseContentType?: "boolean",
  responseStatusCode?: "boolean"
}

const defaultLoggingConfigSwitchState: ILoggingConfigSwitch = {
  callBody: "boolean",
  callContentType: "boolean",
  callMethod: "boolean",
  callQuery: "boolean",
  callUrl: "boolean",
  maxCharCountBody: "int",
  maxCharCountErrorBody: "int",
  responseBody: "boolean",
  responseContentType: "boolean",
  responseStatusCode: "boolean"
};

export type ILoggingConfigSwitchSetters = {
  callBody: (value: "boolean") => void;
  callContentType: (value: "boolean") => void;
  callMethod: (value: "boolean") => void;
  callQuery: (value: "boolean") => void;
  callUrl: (value: "boolean") => void;
  maxCharCountBody: (value: "int") => void;
  maxCharCountErrorBody: (value: "int") => void;
  responseBody: (value: "boolean") => void;
  responseContentType: (value: "boolean") => void;
  responseStatusCode: (value: "boolean") => void;
};

export const useLoggingConfigSwitch = (
  isLoading: boolean,
  register: UseFormRegister<FieldValues>,
  errors: { [x: string]: any },
) => {
  const [loggingConfigSwitchState, setLoggingConfigSwitchState] = React.useState<ILoggingConfigSwitch>(
    defaultLoggingConfigSwitchState,
  );

  /**
   * Setters
   */
  const setCallBody = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, callBody: value }));
  const setCallContentType = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, callContentType: value }));
  const setCallMethod = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, callMethod: value }));
  const setCallQuery = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, callQuery: value }));
  const setCallUrl = (value: "boolean") => setLoggingConfigSwitchState((oldState) => ({ ...oldState, callUrl: value }));
  const setMaxCharCountBody = (value: "int") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, maxCharCountBody: value }));
  const setMaxCharCountErrorBody = (value: "int") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, maxCharCountErrorBody: value }));
  const setResponseBody = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, responseBody: value }));
  const setResponseContentType = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, responseContentType: value }));
  const setResponseStatusCode = (value: "boolean") =>
    setLoggingConfigSwitchState((oldState) => ({ ...oldState, responseStatusCode: value }));

  const set2: ILoggingConfigSwitchSetters = {
    callBody: setCallBody,
    callContentType: setCallContentType,
    callMethod: setCallMethod,
    callQuery: setCallQuery,
    callUrl: setCallUrl,
    maxCharCountBody: setMaxCharCountBody,
    maxCharCountErrorBody: setMaxCharCountErrorBody,
    responseBody: setResponseBody,
    responseContentType: setResponseContentType,
    responseStatusCode: setResponseStatusCode,
  };

  const LoggingConfigSwitch: React.FC = () => (
    <SourceFormLoggingConfigTemplate {...{ isLoading, register, errors, set2, loggingConfigSwitchState }} />
  );

  return { LoggingConfigSwitch, loggingConfigSwitchState, set2 };
};
