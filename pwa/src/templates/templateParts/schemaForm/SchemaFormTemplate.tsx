import * as React from "react";
import * as styles from "./SchemaFormTemplate.module.css";
import * as _ from "lodash";
import clsx from "clsx";
import { InputCheckbox, InputText } from "@conduction/components";
import { FormField, FormFieldInput, FormFieldLabel, Heading2, LeadParagraph } from "@gemeente-denhaag/components-react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import { mapGatewaySchemaToInputValues } from "../../../services/mapGatewaySchemaToInputValues";

export type SchemaInputType = "string" | "boolean" | "array";

interface ReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
  control: any; // todo: type this
}

interface SchemaFormTemplateProps {
  schema: any;
  disabled: boolean;
}

export const SchemaFormTemplate: React.FC<SchemaFormTemplateProps & ReactHookFormProps> = ({
  schema,
  register,
  errors,
  control,
  disabled,
}) => {
  const [simpleProperties, setSimpleProperties] = React.useState<any[]>([]);
  const [complexProperties, setComplexProperties] = React.useState<any[]>([]);

  React.useEffect(() => {
    setSimpleProperties([]);
    setComplexProperties([]);

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

      property.type !== "array" && setSimpleProperties((p) => [...p, property]);
      property.type === "array" && setComplexProperties((p) => [...p, property]);
    }
  }, [schema]);

  if (!simpleProperties.length) return <>This schema has no fields.</>;

  return (
    <div className={styles.container}>
      <Heading2>{schema.title}</Heading2>

      <LeadParagraph>{schema.description}</LeadParagraph>

      <div className={clsx(styles.simpleFormContainer, styles.formContainer)}>
        {simpleProperties.map(({ name, type, placeholder, description, defaultValue }, idx) => (
          <FormFieldGroup
            key={idx}
            required={schema.required.includes(name)}
            {...{ register, errors, control, disabled, name, type, placeholder, description, defaultValue }}
          />
        ))}
      </div>

      <div className={clsx(styles.complexFormContainer, styles.formContainer)}>
        {complexProperties.map(({ name, type, placeholder, description, defaultValue }, idx) => (
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

        {type === "boolean" && (
          <InputCheckbox
            label="True"
            validation={{ required }}
            defaultChecked
            {...{ register, errors, disabled, placeholder, name }}
          />
        )}

        {type === "array" && (
          <CreateKeyValue {...{ register, errors, control, disabled, placeholder, name, defaultValue }} />
        )}
      </FormFieldInput>
    </FormField>
  );
};
