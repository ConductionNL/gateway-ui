import * as React from "react";
import * as styles from "./GeneratedSchemaFormTemplate.module.css";
import * as _ from "lodash";
import { InputCheckbox, InputText } from "@conduction/components";
import { FormField, FormFieldInput, FormFieldLabel, Heading2, LeadParagraph } from "@gemeente-denhaag/components-react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { mapGatewaySchemaToInputValues } from "../../../services/mapGatewaySchemaToInputValues";

export type SchemaInputType = "string" | "boolean" | "array";

interface ReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
  control: any; // todo: type this
}

interface GeneratedSchemaFormTemplateProps {
  schema: any;
  disabled: boolean;
}

export const GeneratedSchemaFormTemplate: React.FC<GeneratedSchemaFormTemplateProps & ReactHookFormProps> = ({
  schema,
  register,
  errors,
  control,
  disabled,
}) => {
  const [properties, setProperties] = React.useState<any[]>([]);

  React.useEffect(() => {
    setProperties([]);

    for (const [key, _value] of Object.entries(schema.properties)) {
      const value = _value as any; // todo: type this

      const property = {
        type: value.type as SchemaInputType,
        name: _.startCase(key),
        placeholder: value.example,
        description: value.description,
        required: schema.required.includes(key),
        defaultValue: mapGatewaySchemaToInputValues(value.type, value.default),
      };

      setProperties((p) => [...p, property]);
    }
  }, [schema]);

  if (!properties.length) return <>This schema has no fields.</>;

  return (
    <div className={styles.container}>
      <Heading2>{schema.title}</Heading2>

      <LeadParagraph>{schema.description}</LeadParagraph>

      <div className={styles.formContainer}>
        {properties.map(({ name, type, placeholder, description, defaultValue }, idx) => (
          <FormFieldGroup
            key={idx}
            required={schema.required.includes(name)}
            {...{ register, errors, control, disabled, name, type, placeholder, description, defaultValue }}
          />
        ))}
      </div>
    </div>
  );
};

interface FormFieldGroupProps {
  type: SchemaInputType;
  name: string;
  disabled: boolean;
  placeholder?: string;
  required?: boolean;
  description?: string;
  defaultValue?: any;
}

const FormFieldGroup: React.FC<FormFieldGroupProps & ReactHookFormProps> = ({
  name,
  type,
  placeholder,
  description,
  register,
  errors,
  control,
  disabled,
  required,
  defaultValue,
}) => {
  return (
    <FormField>
      <FormFieldInput>
        <div className={styles.formFieldHeader}>
          <FormFieldLabel>{name}</FormFieldLabel>
          <span className={styles.description}>{description}</span>
        </div>

        {type === "string" && (
          <InputText
            validation={{ required }}
            {...{ register, errors, control, disabled, placeholder, name, defaultValue }}
          />
        )}

        {type === "array" && (
          <SelectCreate
            options={defaultValue}
            defaultValue={defaultValue}
            validation={{ required }}
            {...{ register, errors, control, disabled, placeholder, name }}
          />
        )}

        {type === "boolean" && (
          <InputCheckbox
            label="True"
            validation={{ required }}
            defaultChecked
            {...{ register, errors, disabled, placeholder, name }}
          />
        )}
      </FormFieldInput>
    </FormField>
  );
};
