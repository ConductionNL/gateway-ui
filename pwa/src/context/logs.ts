import * as React from "react";

export interface LogProps {
  channel?: TLogChannel;
  level_name?: TLogLevelName;
  context?: {
    endpoint?: string;
    schema?: string;
    cronjob?: string;
    action?: string;
    user?: string;
    organization?: string;
    application?: string;
  };
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
] as const;
export type TLogChannel = typeof channels[number];
