import * as React from "react";
import { GlobalContext } from "./global";

export type IDeletedItemsContext = string[];

export const defaultDeletedItemsContext: IDeletedItemsContext = [];

export const useDeletedItemsContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const addDeletedItem = (uuid: string) => {
    setGlobalContext((context) => ({ ...context, deletedItems: [...context.deletedItems, uuid] }));
  };

  const removeDeletedItem = (uuid: string) => {
    setGlobalContext((context) => ({ ...context, deletedItems: context.deletedItems.filter((item) => item !== uuid) }));
  };

  const isDeleted = (uuid: string): boolean => globalContext.deletedItems.includes(uuid);

  return { isDeleted, addDeletedItem, removeDeletedItem };
};
