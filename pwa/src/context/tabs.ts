import * as React from "react";

export interface ITabs {
  schemaDetailTabs: number;
  sourceDetailTabs: number;
}

export const tabs = {
  schemaDetailTabs: 0,
  sourceDetailTabs: 0,
} as ITabs;

export const TabsContext = React.createContext<[ITabs, (data: ITabs) => void]>([tabs, () => null]);

export const TabsProvider = TabsContext.Provider;
