import * as React from "react";

export interface IsLoadingProps {
  alert?: boolean;
  schemaForm?: boolean;
  userForm?: boolean;
}

export const isLoading = {} as IsLoadingProps;

export const IsLoadingContext = React.createContext<[IsLoadingProps, (data: IsLoadingProps) => void]>([
  isLoading,
  () => null,
]);

export const IsLoadingProvider = IsLoadingContext.Provider;
