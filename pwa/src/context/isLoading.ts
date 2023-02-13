import * as React from "react";
import { GlobalContext } from "./global";

export interface IIsLoadingContext {
  schemaForm?: boolean;
  userForm?: boolean;
  authenticationForm?: boolean;
  sourceForm?: boolean;
  applicationForm?: boolean;
  endpointForm?: boolean;
  cronjobForm?: boolean;
  actionForm?: boolean;
  securityGroupForm?: boolean;
  collectionForm?: boolean;
  organizationForm?: boolean;
}

export const defaultIsLoadingContext: IIsLoadingContext = {};

export const useIsLoadingContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const isLoading: IIsLoadingContext = globalContext.isLoading;

  const setIsLoading = (loading: IIsLoadingContext) => {
    setGlobalContext((context) => ({ ...context, isLoading: { ...globalContext.isLoading, ...loading } }));
  };

  return { setIsLoading, isLoading };
};
