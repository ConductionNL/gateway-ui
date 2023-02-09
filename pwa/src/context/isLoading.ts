import * as React from "react";

export interface IsLoadingProps {
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

export const isLoading = {} as IsLoadingProps;

export const IsLoadingContext = React.createContext<[IsLoadingProps, (data: IsLoadingProps) => void]>([
  isLoading,
  () => null,
]);

export const IsLoadingProvider = IsLoadingContext.Provider;
