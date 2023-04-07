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

/**
 * Active object table columns
 */
export interface IObjectTableColumnsContext {
  id?: boolean;
  name?: boolean;
  schema?: boolean;
}

export const defaultObjectTableColumnsContext = {
  id: true,
  name: true,
  schema: true,
} as IObjectTableColumnsContext;

export const useObjectTableColumnsContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const objectTableColumns: IObjectTableColumnsContext = globalContext.objectTableColumns;

  const setObjectTableColumns = (objectTableColumns: IObjectTableColumnsContext) => {
    setGlobalContext((context) => ({
      ...context,
      objectTableColumns: { ...context.objectTableColumns, ...objectTableColumns },
    }));
  };

  return { setObjectTableColumns, objectTableColumns };
};
