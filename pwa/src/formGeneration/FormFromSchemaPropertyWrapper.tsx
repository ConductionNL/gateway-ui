import * as React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { ErrorMessage } from "../components/errorMessage/ErrorMessage";

interface FormFromSchemaPropertyWrapperProps {
  children: React.ReactNode;
  name: string;
  errors: { [x: string]: any };
  readOnly?: boolean;
  description?: string;
}

export const FormFromSchemaPropertyWrapper: React.FC<FormFromSchemaPropertyWrapperProps> = ({
  children,
  name,
  errors,
  readOnly,
  description,
}) => {
  return (
    <FormField>
      <FormFieldInput>
        <div>
          <FormFieldLabel>
            {name} {readOnly && <>(read only)</>}
          </FormFieldLabel>

          {description && (
            <p data-tip={description}>
              <FontAwesomeIcon data-tip={description} icon={faInfoCircle} />
            </p>
          )}
        </div>

        {children}
      </FormFieldInput>

      {errors[name] && <ErrorMessage message={errors[name].message} />}
    </FormField>
  );
};
