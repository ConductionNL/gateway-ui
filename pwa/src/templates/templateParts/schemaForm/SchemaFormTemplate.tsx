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
import { InputFloat, InputURL } from "@conduction/components/lib/components/formFields/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  SelectCreate,
  SelectMultiple,
  SelectSingle,
} from "@conduction/components/lib/components/formFields/select/select";
import { useObject } from "../../../hooks/object";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { getIdFromObjectId } from "../../../services/getIdFromObjectId";

export type SchemaInputType =
  | "string"
  | "boolean"
  | "bool"
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
  object?: any;
  schema: any;
  disabled?: boolean;
}

export const SchemaFormTemplate: React.FC<SchemaFormTemplateProps & ReactHookFormProps> = ({
  object,
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

    if (!schema.properties) return;

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
                object,
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
                object,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
};

interface FormFieldGroupProps {
  type: SchemaInputType;
  name: string;
  disabled?: boolean;
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
  object: any;
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
  object,
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

        {type === "string" && !_enum && !multiple && !(format === "url" || format === "text") && (
          <InputText
            validation={enrichValidation({ required, maxLength, minLength })}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
            ariaLabel={`Enter ${name}`}
          />
        )}

        {type === "string" && !_enum && !multiple && format === "text" && (
          <Textarea
            validation={enrichValidation({ required })}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
            ariaLabel={`Enter ${name}`}
          />
        )}

        {type === "string" && !_enum && !multiple && format === "url" && (
          <InputURL
            validation={enrichValidation({ required, maxLength, minLength })}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
            ariaLabel={`Enter ${name}`}
          />
        )}

        {type === "uuid" && (
          <InputText
            validation={enrichValidation({ required, maxLength, minLength })}
            disabled={disabled || readOnly}
            {...{ register, errors, control, placeholder, name, defaultValue }}
            ariaLabel={`Enter ${name}`}
          />
        )}

        {type === "string" && !_enum && multiple && (
          <SelectCreate
            defaultValue={defaultValue}
            options={defaultValue}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control }}
            ariaLabel={`Select or create ${name}`}
          />
        )}

        {type === "string" && _enum && !multiple && (
          <SelectSingle
            defaultValue={defaultValue.defaultValue}
            options={defaultValue.options}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control }}
            ariaLabel={`Select ${name}`}
          />
        )}

        {type === "string" && _enum && multiple && (
          <SelectMultiple
            defaultValue={defaultValue.defaultValue}
            options={defaultValue.options}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control }}
            ariaLabel={`Select one or more ${name}`}
          />
        )}

        {(type === "boolean" || type === "bool") && (
          <InputCheckbox
            label="True"
            validation={enrichValidation({ required })}
            defaultChecked={defaultValue}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name }}
          />
        )}

        {(type === "integer" || type === "int") && (
          <InputNumber
            validation={enrichValidation({ required, maxLength, minLength })}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, defaultValue }}
            ariaLabel={`Enter ${name}`}
          />
        )}

        {type === "number" && (
          <InputFloat
            validation={enrichValidation({ required, maxLength, minLength })}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, defaultValue }}
            ariaLabel={`Enter ${name}`}
          />
        )}

        {type === "date" && (
          <InputDate
            validation={enrichValidation({ required })}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, control, defaultValue }}
          />
        )}

        {type === "datetime" && (
          <InputDate
            validation={enrichValidation({ required })}
            disabled={disabled || readOnly}
            showTimeSelect
            {...{ register, errors, placeholder, name, control, defaultValue }}
          />
        )}

        {type === "array" && <>Properties of type array are not yet supported.</>}
        {/* {type === "array" && (
          <>
            <CreateKeyValue
              disabled={disabled || readOnly}
              {...{ register, errors, control, placeholder, name, defaultValue }}
            />
          </>
        )} */}

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
              object,
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
  object,
}) => {
  const queryClient = useQueryClient();
  const _useObject = useObject();
  const property = schema?.properties[name];

  const getAllFromList = _useObject.getAllFromList(`${property?._list}&_limit=500`);

  const objectValues = object && (object[name] as any);

  const [defaultValue, setDefaultValue] = React.useState<any>(null);

  React.useEffect(() => {
    if (!getAllFromList.isSuccess) return;

    let selected;

    if (!multiple) {
      selected = getAllFromList.data.find((item) => item._id === property.value);
    }

    if (multiple) {
      if (!schema.properties[name].value && !_.isEmpty(objectValues)) {
        selected = getAllFromList.data.filter((item) => getIdFromObjectId(objectValues)?.includes(item._id));
      } else {
        selected = getAllFromList.data.filter((item) => property.value?.includes(item._id));
      }
    }

    if (!selected) {
      setDefaultValue({});
      return;
    }

    if (!multiple) {
      setDefaultValue({ label: selected.name, value: selected._id });
    }

    if (multiple) {
      setDefaultValue(selected.map((item: any) => ({ label: item.name, value: item.id })));
    }
  }, [getAllFromList.isSuccess]);

  if (getAllFromList.isLoading || !defaultValue) return <Skeleton height="50px" />;
  if (getAllFromList.isError) return <>Something went wrong...</>;

  if (multiple) {
    return (
      <SelectMultiple
        defaultValue={defaultValue[0]?.label && defaultValue}
        options={
          getAllFromList.data?.map((object) => ({
            label: object._self.name ?? `${object.firstName} ${object.lastName}`,
            value: object._self.id,
          })) ?? []
        }
        disabled={disabled || readOnly}
        {...{ register, errors, placeholder, name, control }}
        validation={enrichValidation({ required })}
        ariaLabel={`Select one or more ${name}`}
      />
    );
  }

  return (
    <SelectSingle
      defaultValue={defaultValue.label && defaultValue}
      options={getAllFromList.data?.map((object) => ({ label: object._self.name, value: object._self.id })) ?? []}
      disabled={disabled || readOnly}
      {...{ register, errors, placeholder, name, control }}
      validation={enrichValidation({ required })}
      ariaLabel={`Select ${name}`}
    />
  );
};
