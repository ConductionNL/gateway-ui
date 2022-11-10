import * as React from "react";
import * as styles from "./SchemaFormTemplate.module.css";
import * as _ from "lodash";
import clsx from "clsx";
import { InputCheckbox, InputText } from "@conduction/components";
import { FormField, FormFieldInput, FormFieldLabel, Heading2, Paragraph } from "@gemeente-denhaag/components-react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { CreateKeyValue, InputNumber } from "@conduction/components/lib/components/formFields";
import { mapGatewaySchemaToInputValues } from "../../../services/mapGatewaySchemaToInputValues";
import { InputDate } from "@conduction/components";
import { InputDateTime, InputFloat } from "@conduction/components/lib/components/formFields/input";
import { ReactTooltip } from "@conduction/components/lib/components/toolTip/ToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  SelectCreate,
  SelectMultiple,
  SelectSingle,
} from "@conduction/components/lib/components/formFields/select/select";

export type SchemaInputType = "string" | "boolean" | "array" | "integer" | "date" | "number" | "object" | "datetime";

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
        readOnly: value.readOnly,
        required: schema?.required.includes(key),
        defaultValue: mapGatewaySchemaToInputValues(value),
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
          ({ name, type, placeholder, description, defaultValue, _enum, multiple, readOnly }, idx) => (
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
                defaultValue,
                _enum,
                multiple,
              }}
            />
          ),
        )}
      </div>

      <div className={clsx(styles.complexFormContainer, styles.formContainer)}>
        {complexProperties.map(({ name, type, placeholder, description, defaultValue, readOnly }, idx) => (
          <FormFieldGroup
            key={idx}
            required={schema.required.includes(name)}
            {...{ register, errors, control, disabled, name, type, placeholder, description, defaultValue, readOnly }}
          />
        ))}
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
  defaultValue?: any;
  _enum?: any;
  multiple?: boolean;
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
  readOnly,
  defaultValue,
  _enum,
  multiple,
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

        {type === "string" && !_enum && !multiple && (
          <InputText
            validation={{ required }}
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

        {type === "integer" && (
          <InputNumber
            validation={{ required }}
            disabled={disabled || readOnly}
            {...{ register, errors, placeholder, name, defaultValue }}
          />
        )}

        {type === "number" && (
          <InputFloat
            validation={{ required }}
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
          <div className="denhaag-textfield">
            <input
              className="denhaag-textfield__input"
              type="text"
              disabled
              placeholder="Updating objects is not yet supported."
            />
          </div>
        )}
      </FormFieldInput>
    </FormField>
  );
};
