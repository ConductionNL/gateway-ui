import * as React from "react";

export interface IsLoadingProps {
  schemaForm?: boolean;
  authenticationForm?: boolean;
  sourceForm?: boolean;
  applicationForm?: boolean;
}

export const isLoading = {} as IsLoadingProps;

export const IsLoadingContext = React.createContext<[IsLoadingProps, (data: IsLoadingProps) => void]>([
  isLoading,
  () => null,
]);

export const IsLoadingProvider = IsLoadingContext.Provider;
