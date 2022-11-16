import * as React from "react";

export interface AlertProps {
  active: boolean;

  message?: string;
  body?: string;
  type?: "error" | "success";
}

export const defaultAlert = { active: false } as AlertProps;

export const AlertContext = React.createContext<[AlertProps, (data: AlertProps) => void]>([defaultAlert, () => null]);

export const AlertProvider = AlertContext.Provider;
