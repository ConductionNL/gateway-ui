import * as React from "react";
import { GlobalContext } from "./global";

export type TColumnType = "objectColumns";

export type TColumns = { [key: string]: boolean };

/**
 * Columns per resource
 */
const objectColumns = {
  id: true,
  name: true,
  schema: true,
};

// Interface combining all above columns
export interface ITableColumnsContext {
  objectColumns: TColumns;
}

/**
 * Context start
 */
export const defaultTableColumnsContext = {
  objectColumns: objectColumns,
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
