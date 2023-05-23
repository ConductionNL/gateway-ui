import * as React from "react";
import { GlobalContext } from "./global";

export interface ILogFiltersContext {
  "_order[datetime]": "asc" | "desc";
  _id?: string;
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

export const defaultLogFiltersContext = {
  "_order[datetime]": "desc",
} as ILogFiltersContext;

export const useLogFiltersContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const logFilters: ILogFiltersContext = globalContext.logFilters;

  const setLogFilters = (logFilters: ILogFiltersContext) => {
    setGlobalContext((context) => ({ ...context, logFilters }));
  };

  const toggleOrder = (order: "asc" | "desc") => {
    setGlobalContext((context) => ({ ...context, logFilters: { ...logFilters, "_order[datetime]": order } }));
  };

  return { setLogFilters, toggleOrder, logFilters };
};

/**
 * Types
 */

export const levelNames = ["DEBUG", "INFO", "NOTICE", "WARNING", "ERROR", "CRITICAL", "ALERT", "EMERGENCY"] as const;
export type TLogLevelName = (typeof levelNames)[number];

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
export type TLogChannel = (typeof channels)[number];
