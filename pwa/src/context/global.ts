import * as React from "react";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";
import { defaultIsLoadingContext, IIsLoadingContext } from "./isLoading";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
  isLoading: IIsLoadingContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
  isLoading: defaultIsLoadingContext,
};

export const GlobalContext = React.createContext<[IGlobalContext, (data: IGlobalContext) => void]>([
  defaultGlobalContext,
  () => null,
]);

export const GlobalProvider = GlobalContext.Provider;
