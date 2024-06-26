import * as React from "react";
import * as styles from "./FormStepOptionsSelect.module.css";

import { SelectSingle, InputCheckbox, InputText } from "@conduction/components";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Control, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { useQueryClient } from "react-query";
import { useMapping } from "../../../../../hooks/mapping";
import { useSchema } from "../../../../../hooks/schema";
import { enrichValidation } from "../../../../../services/enrichReactHookFormValidation";
import { TOOLTIP_ID } from "../../../../../layout/Layout";

interface FormStepOptionsSelectProps {
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
  errors: {
    [x: string]: any;
  };
  setValue?: UseFormSetValue<FieldValues>;
  needsDelimiter?: boolean;
}

export const FormStepOptionsSelect: React.FC<FormStepOptionsSelectProps> = ({
  control,
  register,
  errors,
  needsDelimiter,
}) => {
  const queryClient = useQueryClient();

  const getSchemas = useSchema(queryClient).getAll();
  const getMappings = useMapping(queryClient).getAll();

  return (
    <div className={styles.container}>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>
            Schema*{" "}
            <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={"Select the object schema"}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
          </FormFieldLabel>

          {getSchemas.isLoading && <Skeleton height="50px" />}

          {getSchemas.isSuccess && (
            <SelectSingle
              isClearable
              options={getSchemas.data.map((schema) => ({ label: schema.name, value: schema.id }))}
              name="schema"
              validation={enrichValidation({ required: true })}
              {...{ register, errors, control }}
              ariaLabel={"Select a schema"}
            />
          )}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>
            Mapping{" "}
            <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={"Optionally select a mapping"}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
          </FormFieldLabel>

          {getMappings.isLoading && <Skeleton height="50px" />}

          {getMappings.isSuccess && (
            <SelectSingle
              isClearable
              options={getMappings.data.map((mapping) => ({ label: mapping.name, value: mapping.id }))}
              name="mapping"
              {...{ register, errors, control }}
              ariaLabel={"Select a mapping"}
            />
          )}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>
            File has headers{" "}
            <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={"The file has a headers row"}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
          </FormFieldLabel>
          <InputCheckbox name="headers" label="Yes" defaultChecked {...{ register, errors }} />
        </FormFieldInput>
      </FormField>

      {needsDelimiter && (
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>
              Delimiter*{" "}
              <span
                data-tooltip-id={TOOLTIP_ID}
                data-tooltip-content={
                  "Objects are separated by the delimiter, defaults to ','. Only applicable in .csv files."
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </FormFieldLabel>
            <InputText
              name="delimiter"
              defaultValue=","
              {...{ register, errors }}
              validation={enrichValidation({ required: true })}
              ariaLabel={"Enter delimiter"}
            />
          </FormFieldInput>
        </FormField>
      )}
    </div>
  );
};
