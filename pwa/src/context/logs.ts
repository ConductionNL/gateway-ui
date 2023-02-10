import * as React from "react";
import { GlobalContext } from "./global";

export interface ILogFiltersContext {
  channel?: TLogChannel;
  level_name?: TLogLevelName;
  context?: {
    session?: string;
    process?: string;
    endpoint?: string;
    schema?: string;
    cronjob?: string;
    action?: string;
    user?: string;
    organization?: string;
    application?: string;
  };
}

export const defaultLogFiltersContext = {} as ILogFiltersContext;

export const useLogFiltersContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const logFilters: ILogFiltersContext = globalContext.logFilters;

  const setLogFilters = (logFilters: ILogFiltersContext) => {
    setGlobalContext({ ...globalContext, logFilters });
  };

  return { setLogFilters, logFilters };
};

/**
 * Types
 */

export const levelNames = ["DEBUG", "INFO", "NOTICE", "WARNING", "ERROR", "CRITICAL", "ALERT", "EMERGENCY"] as const;
export type TLogLevelName = typeof levelNames[number];

export const channels = [
  "endpoint",
  "request",
  "schema",
  "cronjob",
  "source",
  "action",
  "object",
  "synchronization",
  "plugin",
  "composer",
  "installation",
  "mapping",
  "organization",
  "user",
  "collection",
] as const;
export type TLogChannel = typeof channels[number];
