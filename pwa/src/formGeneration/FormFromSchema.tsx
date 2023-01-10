import * as React from "react";
import { TReactHookFormProps } from "./types";
import { FormFromSchemaProperty } from "./FormFromSchemaProperty";

interface FormFromSchemaProps {
  schema: any; // json-schema from gateway
  disabled: boolean;
}

export const FormFromSchema: React.FC<FormFromSchemaProps & TReactHookFormProps> = ({ schema, ...rest }) => {
  const [properties, setProperties] = React.useState<any[]>([]);

  React.useEffect(() => {
    for (const [key, value] of Object.entries(schema.properties)) {
      setProperties((oldProperties) => [...oldProperties, { _propertyName: key, ...(value as any) }]);
    }
  }, [schema]);

  return (
    <>
      {properties.map((property, idx) => (
        <FormFromSchemaProperty key={idx} {...{ property, ...rest }} />
      ))}
    </>
  );
};
