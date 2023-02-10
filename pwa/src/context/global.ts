import * as React from "react";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";
import { defaultIsLoadingContext, IIsLoadingContext } from "./isLoading";
import { defaultTabsContext, ITabsContext } from "./tabs";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
  isLoading: IIsLoadingContext;
  currentTabs: ITabsContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
  isLoading: defaultIsLoadingContext,
  currentTabs: defaultTabsContext,
};

export const GlobalContext = React.createContext<[IGlobalContext, (data: IGlobalContext) => void]>([
  defaultGlobalContext,
  () => null,
]);

export const GlobalProvider = GlobalContext.Provider;
