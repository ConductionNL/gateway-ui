import { SchemaInputType } from "../templates/templateParts/schemaForm/SchemaFormTemplate";

export const mapGatewaySchemaToInputValues = (type: SchemaInputType, schemaValues?: any): any => {
  switch (type) {
    case "array":
      let values = [];

      for (const [key, value] of Object.entries(schemaValues)) {
        values.push({ key, value });
      }

      return values;

    case "boolean":
    case "string":
    case "integer":
    case "date":
    case "number":
      return schemaValues;
  }
};
