import * as React from "react";
import { defaultDeletedItemsContext, IDeletedItemsContext } from "./deletedItems";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";
import { defaultIsLoadingContext, IIsLoadingContext } from "./isLoading";
import { defaultLogFiltersContext, ILogFiltersContext } from "./logs";
import { defaultTabsContext, ITabsContext } from "./tabs";
import { defaultObjectsContext, IObjectsStateContext } from "./objects";
import { defaultTableColumnsContext, ITableColumnsContext } from "./tableColumns";
import { defaultAdvancedSwitchContext, IAdvancedSwitchContext } from "./advancedSwitch";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
  isLoading: IIsLoadingContext;
  currentTabs: ITabsContext;
  logFilters: ILogFiltersContext;
  deletedItems: IDeletedItemsContext;
  objectsState: IObjectsStateContext;
  tableColumns: ITableColumnsContext;
  advancedSwitch: IAdvancedSwitchContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
  isLoading: defaultIsLoadingContext,
  currentTabs: defaultTabsContext,
  logFilters: defaultLogFiltersContext,
  deletedItems: defaultDeletedItemsContext,
  objectsState: defaultObjectsContext,
  tableColumns: defaultTableColumnsContext,
  advancedSwitch: defaultAdvancedSwitchContext,
};

export const GlobalContext = React.createContext<
  [IGlobalContext, React.Dispatch<React.SetStateAction<IGlobalContext>>]
>([defaultGlobalContext, () => null]);

export const GlobalProvider = GlobalContext.Provider;
