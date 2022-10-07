import * as React from "react";
import { useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useAction = () => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("actions", API.Action.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAll };
};
