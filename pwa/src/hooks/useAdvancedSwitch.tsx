import * as React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { SourceFormAdvancedTemplate } from "../templates/templateParts/sourcesForm/SourceFormAdvancedTemplate";

export interface IAdvancedSwitch {
  decodeContent?: "string" | "boolean";
  delay?: "int" | "float";
  expect?: "int" | "boolean";
  verify?: "string" | "boolean";
  idnConversion?: "int" | "boolean";
}

const defaultAdvancedSwitchState: IAdvancedSwitch = {
  decodeContent: "string",
  delay: "int",
  expect: "int",
  verify: "string",
  idnConversion: "int",
};

export type IAdvancedSwitchSetters = {
  decodeContent: (value: "string" | "boolean") => void;
  delay: (value: "int" | "float") => void;
  expect: (value: "int" | "boolean") => void;
  verify: (value: "string" | "boolean") => void;
  idnConversion: (value: "int" | "boolean") => void;
};

export const useAdvancedSwitch = (
  isLoading: boolean,
  register: UseFormRegister<FieldValues>,
  errors: { [x: string]: any },
) => {
  const [advancedSwitchState, setAdvancedSwitchState] = React.useState<IAdvancedSwitch>(defaultAdvancedSwitchState);

  /**
   * Setters
   */
  const setDecodeContent = (value: "string" | "boolean") =>
    setAdvancedSwitchState((oldState) => ({ ...oldState, decodeContent: value }));

  const setDelay = (value: "int" | "float") => setAdvancedSwitchState((oldState) => ({ ...oldState, delay: value }));

  const setExpect = (value: "int" | "boolean") =>
    setAdvancedSwitchState((oldState) => ({ ...oldState, expect: value }));

  const setVerify = (value: "string" | "boolean") =>
    setAdvancedSwitchState((oldState) => ({ ...oldState, verify: value }));

  const setIdnConversion = (value: "int" | "boolean") =>
    setAdvancedSwitchState((oldState) => ({ ...oldState, idnConversion: value }));

  const set: IAdvancedSwitchSetters = {
    decodeContent: setDecodeContent,
    delay: setDelay,
    expect: setExpect,
    verify: setVerify,
    idnConversion: setIdnConversion,
  };

  const AdvancedSwitch: React.FC = () => (
    <SourceFormAdvancedTemplate {...{ isLoading, register, errors, set, advancedSwitchState }} />
  );

  return { AdvancedSwitch, advancedSwitchState, set };
};
