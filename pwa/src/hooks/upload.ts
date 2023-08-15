import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useUpload = () => {
  const API: APIService | null = React.useContext(APIContext);

  const upload = () =>
    useMutation<any, Error, FormData>((variables) => API.Upload.upload({ payload: variables }), {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { upload };
};
