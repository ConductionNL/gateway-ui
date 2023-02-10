import * as React from "react";
import { GlobalContext } from "./global";

export interface ITabsContext {
  schemaDetailTabs: number;
  sourceDetailTabs: number;
  settingsDetailTabs: number;
  objectDetailTabs: number;
  userDetailTabs: number;
  organizationDetailTabs: number;
}

export const defaultTabsContext = {
  schemaDetailTabs: 0,
  sourceDetailTabs: 0,
  settingsDetailTabs: 0,
  objectDetailTabs: 0,
  userDetailTabs: 0,
  organizationDetailTabs: 0,
} as ITabsContext;

export const useCurrentTabContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const currentTabs: ITabsContext = globalContext.currentTabs;

  const setCurrentTabs = (currentTabs: ITabsContext) => {
    console.log({ currentTabs });

    setGlobalContext({ ...globalContext, currentTabs });
  };

  return { setCurrentTabs, currentTabs };
};
