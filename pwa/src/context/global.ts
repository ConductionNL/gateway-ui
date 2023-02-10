import * as React from "react";
import { defaultGatsbyContext, IGatsbyContext } from "./gatsby";

export interface IGlobalContext {
  gatsby: IGatsbyContext;
}

export const defaultGlobalContext: IGlobalContext = {
  gatsby: defaultGatsbyContext,
};

export const GlobalContext = React.createContext<[IGlobalContext, (data: IGlobalContext) => void]>([
  defaultGlobalContext,
  () => null,
]);

export const GlobalProvider = GlobalContext.Provider;
