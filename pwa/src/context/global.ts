import * as React from "react";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";
import { defaultIsLoadingContext, IIsLoadingContext } from "./isLoading";
import { defaultLogFiltersContext, ILogFiltersContext } from "./logs";
import { defaultTabsContext, ITabsContext } from "./tabs";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
  isLoading: IIsLoadingContext;
  currentTabs: ITabsContext;
  logFilters: ILogFiltersContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
  isLoading: defaultIsLoadingContext,
  currentTabs: defaultTabsContext,
  logFilters: defaultLogFiltersContext,
};

export const GlobalContext = React.createContext<[IGlobalContext, (data: IGlobalContext) => void]>([
  defaultGlobalContext,
  () => null,
]);

export const GlobalProvider = GlobalContext.Provider;
