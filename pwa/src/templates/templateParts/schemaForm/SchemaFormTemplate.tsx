import * as React from "react";
import * as styles from "./SchemaFormTemplate.module.css";
import * as _ from "lodash";
import clsx from "clsx";
import { InputCheckbox, InputText } from "@conduction/components";
import { FormField, FormFieldInput, FormFieldLabel, Heading2, Paragraph } from "@gemeente-denhaag/components-react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { CreateKeyValue, InputNumber, Textarea } from "@conduction/components/lib/components/formFields";
import { mapGatewaySchemaToInputValues } from "../../../services/mapGatewaySchemaToInputValues";
import { InputDate } from "@conduction/components";
import { InputDateTime, InputFloat, InputURL } from "@conduction/components/lib/components/formFields/input";
import { ReactTooltip } from "@conduction/components/lib/components/toolTip/ToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  SelectCreate,
  SelectMultiple,
  SelectSingle,
} from "@conduction/components/lib/components/formFields/select/select";
import { useObject } from "../../../hooks/object";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";

export type SchemaInputType =
  | "string"
  | "boolean"
  | "array"
  | "integer"
  | "int"
  | "date"
  | "number"
  | "object"
  | "datetime"
  | "uuid";

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
        _enum: value.enum,
        multiple: value.multiple,
        name: key,
        placeholder: value.example,
        description: value.description,
        format: value.format,
        readOnly: value.readOnly,
        required: schema?.required.includes(key),
        defaultValue: mapGatewaySchemaToInputValues(value),
        minLength: value.minLength,
        maxLength: value.maxLength,
      };

      property.type !== "array" && setSimpleProperties((p) => [...p, property]);
      property.type === "array" && setComplexProperties((p) => [...p, property]);
    }
  }, [schema]);

  if (!simpleProperties.length && !complexProperties.length) return <>This object's schema has no fields.</>;

  return (
    <div className={styles.container}>
      <Heading2 className={styles.title}>{schema.title}</Heading2>

      <Paragraph>{schema.description}</Paragraph>

      <div className={clsx(styles.simpleFormContainer, styles.formContainer)}>
        {simpleProperties.map(
          (
            {
              name,
              type,
              placeholder,
              description,
              format,
              defaultValue,
              _enum,
              multiple,
              readOnly,
              maxLength,
              minLength,
            },
            idx,
          ) => (
            <FormFieldGroup
              key={idx}
              required={schema.required.includes(name)}
              {...{
                register,
                errors,
                control,
                disabled,
                readOnly,
                name,
                type,
                placeholder,
                description,
                format,
                defaultValue,
                _enum,
                multiple,
                maxLength,
                minLength,
                schema,
              }}
            />
          ),
        )}
      </div>

      <div className={clsx(styles.complexFormContainer, styles.formContainer)}>
        {complexProperties.map(
          ({ name, type, placeholder, description, format, defaultValue, readOnly, maxLength, minLength }, idx) => (
            <FormFieldGroup
              key={idx}
              required={schema.required.includes(name)}
              {...{
                register,
                errors,
                control,
                disabled,
                name,
                type,
                placeholder,
                description,
                format,
                defaultValue,
                readOnly,
                maxLength,
                minLength,
                schema,
              }}
            />
          ),
        )}
      </div>

      <ReactTooltip className={styles.tooltip} />
    </div>
  );
};

interface FormFieldGroupProps {
  type: SchemaInputType;
  name: string;
  disabled: boolean;
  readOnly?: boolean;
  placeholder?: string;
  required?: boolean;
  description?: string;
  format?: string;
  defaultValue?: any;
  _enum?: any;
  multiple?: boolean;
  maxLength?: number;
  minLength?: number;
  schema: any;
}

const FormFieldGroup: React.FC<FormFieldGroupProps & ReactHookFormProps> = ({
  name,
  type,
  placeholder,
  description,
  format,
  register,
  errors,
  control,
  disabled,
  required,
  readOnly,
  defaultValue,
  _enum,
  multiple,
  maxLength,
  minLength,
  schema,
}) => {
  return (
    <FormField>
      <FormFieldInput>
        <div className={styles.formFieldHeader}>
          <FormFieldLabel>
            {name} {readOnly && <>(read only)</>}
          </FormFieldLabel>

          {description && (
            <p data-tip={description}>
              <FontAwesomeIcon data-tip={description} icon={faInfoCircle} />
            </p>
          )}
        </div>

        {type === "string" && !_enum && !multiple && !(format === "url") && (
          <InputText
            validation={{ required, maxLength, minLength }}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
          />
        )}

        {type === "string" && !_enum && !multiple && format === "url" && (
          <InputURL
            validation={{ required, maxLength, minLength }}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
          />
        )}

        {type === "uuid" && (
          <InputText
            validation={{ required, maxLength, minLength }}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
          />
        )}

        {type === "string" && !_enum && multiple && (
          <SelectCreate
            defaultValue={defaultValue}
            options={defaultValue}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control }}
          />
        )}

        {type === "string" && _enum && !multiple && (
          <SelectSingle
            defaultValue={defaultValue.defaultValue}
            options={defaultValue.options}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control }}
          />
        )}

        {type === "string" && _enum && multiple && (
          <SelectMultiple
            defaultValue={defaultValue.defaultValue}
            options={defaultValue.options}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control }}
          />
        )}

        {type === "boolean" && (
          <InputCheckbox
            label="True"
            validation={{ required }}
            defaultChecked={defaultValue}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name }}
          />
        )}

        {type === "integer" ||
          (type === "int" && (
            <InputNumber
              validation={{ required, maxLength, minLength }}
              disabled={disabled || readOnly}
              {...{ register, errors, placeholder, name, defaultValue }}
            />
          ))}

        {type === "number" && (
          <InputFloat
            validation={{ required, maxLength, minLength }}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, defaultValue }}
          />
        )}

        {type === "date" && (
          <InputDate
            validation={{ required }}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, defaultValue }}
          />
        )}

        {type === "datetime" && (
          <InputDateTime
            validation={{ required }}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, defaultValue }}
          />
        )}

        {type === "array" && (
          <CreateKeyValue
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
          />
        )}

        {type === "object" && (
          <SchemaTypeObject
            {...{
              name,
              placeholder,
              register,
              errors,
              control,
              disabled,
              required,
              readOnly,
              defaultValue,
              _enum,
              multiple,
              type,
              schema,
            }}
          />
        )}
      </FormFieldInput>
    </FormField>
  );
};

const SchemaTypeObject: React.FC<FormFieldGroupProps & ReactHookFormProps> = ({
  name,
  placeholder,
  register,
  errors,
  control,
  disabled,
  required,
  readOnly,
  _enum,
  multiple,
  schema,
}) => {
  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getAllFromList = _useObject.getAllFromList(schema.properties[name]._list);

  if (getAllFromList.isLoading) return <Skeleton height="50px" />;
  if (getAllFromList.isError) return <>Something went wrong...</>;

  return (
    <SelectSingle
      defaultValue={{}}
      options={getAllFromList.data?.map((object) => ({ label: object.name, value: object.id })) ?? []}
      disabled={disabled || readOnly}
      {...{ register, errors, placeholder, name, control }}
      validation={{ required }}
    />
  );
};
