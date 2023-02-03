import * as React from "react";

export interface LogProps {
  channels?: TLogChannel[];
  levelNames?: TLogLevelName[];
  endpoints?: string[];
  schemas?: string[];
  cronjobs?: string[];
  actions?: string[];
  users?: string[];
  organizations?: string[];
  applications?: string[];
}

export const logFilters = {} as LogProps;

export const LogFiltersContext = React.createContext<[LogProps, (data: LogProps) => void]>([logFilters, () => null]);

export const LogFiltersProvider = LogFiltersContext.Provider;

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
  "action",
  "object",
  "synchronization",
  "plugin",
  "composer",
  "installation",
  "mapping",
] as const;
export type TLogChannel = typeof levelNames[number];
