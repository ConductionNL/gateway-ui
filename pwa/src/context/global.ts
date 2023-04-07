import * as React from "react";
import { defaultDeletedItemsContext, IDeletedItemsContext } from "./deletedItems";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";
import { defaultIsLoadingContext, IIsLoadingContext } from "./isLoading";
import {
  defaultLogFiltersContext,
  defaultLogTableColumnsContext,
  ILogFiltersContext,
  ILogTableColumnsContext,
} from "./logs";
import { defaultTabsContext, ITabsContext } from "./tabs";
import {
  defaultObjectsContext,
  defaultObjectTableColumnsContext,
  IObjectsStateContext,
  IObjectTableColumnsContext,
} from "./objects";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
  isLoading: IIsLoadingContext;
  currentTabs: ITabsContext;
  logFilters: ILogFiltersContext;
  logTableColumns: ILogTableColumnsContext;
  deletedItems: IDeletedItemsContext;
  objectsState: IObjectsStateContext;
  objectTableColumns: IObjectTableColumnsContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
  isLoading: defaultIsLoadingContext,
  currentTabs: defaultTabsContext,
  logFilters: defaultLogFiltersContext,
  logTableColumns: defaultLogTableColumnsContext,
  deletedItems: defaultDeletedItemsContext,
  objectsState: defaultObjectsContext,
  objectTableColumns: defaultObjectTableColumnsContext,
};

export const GlobalContext = React.createContext<
  [IGlobalContext, React.Dispatch<React.SetStateAction<IGlobalContext>>]
>([defaultGlobalContext, () => null]);

export const GlobalProvider = GlobalContext.Provider;
