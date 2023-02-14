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

  const setRouter = (router: IRouterContext) => {
    setGlobalContext({ ...globalContext, router });
  };

  return { setRouter, router };
};
