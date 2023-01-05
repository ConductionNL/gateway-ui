import * as React from "react";

export interface ITabs {
  schemaDetailTabs: number;
  sourceDetailTabs: number;
  settingsDetailTabs: number;
  objectDetailTabs: number;
}

export const tabs = {
  schemaDetailTabs: 0,
  sourceDetailTabs: 0,
  settingsDetailTabs: 0,
  objectDetailTabs: 0,
} as ITabs;

export const TabsContext = React.createContext<[ITabs, (data: ITabs) => void]>([tabs, () => null]);

export const TabsProvider = TabsContext.Provider;
