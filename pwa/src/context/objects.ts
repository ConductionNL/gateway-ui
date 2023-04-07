import * as React from "react";
import { GlobalContext } from "./global";

export interface IObjectsStateContext {
  inDuplicatingMode?: boolean;
}

export const defaultObjectsContext = {
  inDuplicatingMode: false,
} as IObjectsStateContext;

export const useObjectsStateContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const objectsState: IObjectsStateContext = globalContext.objectsState;

  const setObjectsState = (objectsState: IObjectsStateContext) => {
    setGlobalContext((context) => ({ ...context, objectsState }));
  };

  return { setObjectsState, objectsState };
};
