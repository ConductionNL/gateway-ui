import * as React from "react";
import { GlobalContext } from "./global";

export interface IObjectsStateContext {
  order: "asc" | "desc";
  inDuplicatingMode?: boolean;
}

export const defaultObjectsContext = {
  order: "desc",
  inDuplicatingMode: false,
} as IObjectsStateContext;

export const useObjectsStateContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const objectsState: IObjectsStateContext = globalContext.objectsState;

  const setObjectsState = (objectsState: IObjectsStateContext) => {
    setGlobalContext((context) => ({ ...context, objectsState: { ...objectsState, objectsState } }));
  };

  const toggleOrder = (order: "asc" | "desc") => {
    setGlobalContext((context) => ({ ...context, objectsState: { ...objectsState, order: order } }));
  };

  return { setObjectsState, toggleOrder, objectsState };
};
