import * as React from "react";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export const useSchemaEnricher = () => {
  const API: APIService | null = React.useContext(APIContext);

  const enrichProperties = async (properties: any) => {
    const enrichedProperties = properties;

    for (const [key, value] of Object.entries(properties)) {
      if (!(value as any)._list) continue;

      await API.Object.getAllFromList((value as any)._list).then((res) => {
        enrichedProperties[key] = { ...enrichedProperties[key], enumNames: ["test"], enum: ["123"] };
      });
    }

    return enrichedProperties;
  };

  return { enrichProperties };
};
