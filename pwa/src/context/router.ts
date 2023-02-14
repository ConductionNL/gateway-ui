import * as React from "react";
import { GlobalContext } from "./global";

export interface IRouterContext {
  previousPathname: string;
}

export const defaultRouterContext: IRouterContext = {
  previousPathname: "/",
};

export const useRouterContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const router: IRouterContext = globalContext.router;

  const setCurrentTabs = (router: IRouterContext) => {
    setGlobalContext({ ...globalContext, router });
  };

  return { setCurrentTabs, router };
};
