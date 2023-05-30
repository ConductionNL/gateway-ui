import * as React from "react";
import { GlobalContext } from "./global";

export interface IAdvancedSwitchContext {
  decodeContent?: "string" | "boolean";
  delay?: "int" | "float";
  expect?: "int" | "boolean";
  verify?: "string" | "boolean";
  idnConversion?: "int" | "boolean";
}

export const defaultAdvancedSwitchContext: IAdvancedSwitchContext = {
  decodeContent: "string",
  delay: "int",
  expect: "int",
  verify: "string",
  idnConversion: "int",
};

export const useAdvancedSwitchContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const advancedSwitch: IAdvancedSwitchContext = globalContext.advancedSwitch;

  const setAdvancedSwitch = (advanced: IAdvancedSwitchContext) => {
    setGlobalContext((context) => ({ ...context, advancedSwitch: { ...globalContext.advancedSwitch, ...advanced } }));
  };

  const setupAdvancedSwitch = (configuration: any) => {
    const newAdvancedSwitch = { ...advancedSwitch };

    for (const [key, value] of Object.entries(configuration)) {
      if (key === "decode_content") {
        if (typeof value === "string") newAdvancedSwitch.decodeContent = "string";
        if (typeof value === "boolean") newAdvancedSwitch.decodeContent = "boolean";
        continue;
      }
      if (key === "delay") {
        if (Number.isInteger(value)) newAdvancedSwitch.delay = "int";
        else newAdvancedSwitch.delay = "float";
        continue;
      }
      if (key === "expect") {
        if (typeof value === "number") newAdvancedSwitch.expect = "int";
        if (typeof value === "boolean") newAdvancedSwitch.expect = "boolean";
        continue;
      }
      if (key === "verify") {
        if (typeof value === "string") newAdvancedSwitch.verify = "string";
        if (typeof value === "boolean") newAdvancedSwitch.verify = "boolean";
        continue;
      }
      if (key === "idn_conversion") {
        if (typeof value === "number") newAdvancedSwitch.idnConversion = "int";
        if (typeof value === "boolean") newAdvancedSwitch.idnConversion = "boolean";
      }
    }

    setAdvancedSwitch(newAdvancedSwitch);
  };

  return { advancedSwitch, setAdvancedSwitch, setupAdvancedSwitch };
};
