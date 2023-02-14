import * as React from "react";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";
import { defaultIsLoadingContext, IIsLoadingContext } from "./isLoading";
import {
  defaultLogFiltersContext,
  defaultLogTableColumnsContext,
  ILogFiltersContext,
  ILogTableColumnsContext,
} from "./logs";
import { defaultTabsContext, ITabsContext } from "./tabs";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
  isLoading: IIsLoadingContext;
  currentTabs: ITabsContext;
  logFilters: ILogFiltersContext;
  logTableColumns: ILogTableColumnsContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
  isLoading: defaultIsLoadingContext,
  currentTabs: defaultTabsContext,
  logFilters: defaultLogFiltersContext,
  logTableColumns: defaultLogTableColumnsContext,
};

export const GlobalContext = React.createContext<
  [IGlobalContext, React.Dispatch<React.SetStateAction<IGlobalContext>>]
>([defaultGlobalContext, () => null]);

export const GlobalProvider = GlobalContext.Provider;
