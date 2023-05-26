import * as React from "react";
import { GlobalContext } from "./global";

export interface IAdvancedSwitchContext {
  decodeContent?: "string" | "boolean";
  delay?: "int" | "float";
  expect?: "int" | "boolean";
  verify?: "string" | "boolean";
  idnConversion?: "int" | "boolean";
}

export const defaultAdvancedSwitchContext: IAdvancedSwitchContext = {};

export const useAdvancedSwitchContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const advancedSwitch: IAdvancedSwitchContext = globalContext.advancedSwitch;

  const setAdvancedSwitch = (advanced: IAdvancedSwitchContext) => {
    setGlobalContext((context) => ({ ...context, advancedSwitch: { ...globalContext.advancedSwitch, ...advanced } }));
  };

  return { setAdvancedSwitch, advancedSwitch };
};
