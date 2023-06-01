import * as React from "react";
import { GlobalContext } from "./global";

export type TColumnType = "objectColumns" | "logColumns";

export type TColumns = { [key: string]: boolean };

/**
 * Columns per resource
 */
const objectColumns = {
  id: false,
  name: true,
  schema: true,
  actions: true,
};

const logColumns = {
  level: true,
  message: true,
  created: true,
  endpoint: true,
  schema: true,
  cronjob: true,
  action: true,
  user: true,
  organization: true,
  application: true,
};

// Interface combining all above columns
export interface ITableColumnsContext {
  objectColumns: TColumns;
  logColumns: TColumns;
}

/**
 * Context start
 */
export const defaultTableColumnsContext = {
  objectColumns: objectColumns,
  logColumns: logColumns,
} as ITableColumnsContext;

export const useTableColumnsContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const columns: ITableColumnsContext = globalContext.tableColumns;

  const setColumns = (columnType: TColumnType, columns: TColumns) =>
    setGlobalContext((context) => ({
      ...context,
      tableColumns: { ...context.tableColumns, [columnType]: { ...context.tableColumns[columnType], ...columns } },
    }));

  return { setColumns, columns };
};
