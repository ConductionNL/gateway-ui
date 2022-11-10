import * as React from "react";
import * as styles from "./PropertyFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputNumber, InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useAttribute } from "../../../hooks/attribute";
import { navigate } from "gatsby";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";

interface CreatePropertyFormTemplateProps {
  schemaId: string;
  propertyId?: string;
}

export const CreatePropertyFormTemplate: React.FC<CreatePropertyFormTemplateProps> = ({ schemaId, propertyId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useAttribute = useAttribute(queryClient);
  const createOrEditAttribute = _useAttribute.createOrEdit(schemaId, propertyId);

  const typeSelectOptions = [
    { label: "String", value: "string" },
    { label: "Integer", value: "integer" },
    { label: "Boolean", value: "boolean" },
    { label: "Float", value: "float" },
    { label: "Number", value: "number" },
    { label: "Datetime", value: "datetime" },
    { label: "Date", value: "date" },
    { label: "File", value: "file" },
    { label: "Object", value: "object" },
    { label: "Array", value: "array" },
  ];

  const formatSelectOptions = [
    { label: "CountryCode", value: "countryCode" },
    { label: "Bsn", value: "bsn" },
    { label: "Url", value: "url" },
    { label: "Uri", value: "uri" },
    { label: "Uuid", value: "uuid" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Json", value: "json" },
    { label: "Dutch_pc4", value: "dutch_pc4" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    if (parseInt(data.minLength) > parseInt(data.maxLength))
      return setFormError(t("The minLength is bigger than the maxLength"));

    const payload = {
      ...data,
      type: data.type && data.type.value,
      format: data.format && data.format.value,
      minLength: parseInt(data.minLength),
      maxLength: parseInt(data.maxLength),
      entity: `/admin/entities/${schemaId}`,
    };
    createOrEditAttribute.mutate({ payload, id: propertyId });
  };

  return (
    <div className={styles.container}>
      <div onClick={() => navigate(`/schemas/${schemaId}`)}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to schema")}
        </Link>
      </div>

      {formError && (
        <Alert
          text={formError}
          title={t("Oops, something went wrong")}
          variant="error"
          close={() => setFormError("")}
        />
      )}

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <Heading1>{t("Create Property")}</Heading1>

            <div className={styles.buttons}>
              <Button className={styles.buttonIcon} type="submit" disabled={loading}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>
            </div>
          </section>
          <div className={styles.gridContainer}>
            <div className={styles.grid}>
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Name")}</FormFieldLabel>
                  <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Type")}</FormFieldLabel>
                  {/* @ts-ignore */}
                  <SelectSingle
                    {...{ register, errors, control }}
                    name="type"
                    options={typeSelectOptions}
                    disabled={loading}
                  />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("extend")}</FormFieldLabel>
                  <InputCheckbox {...{ register, errors }} label="on" name="extend" />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("include")}</FormFieldLabel>
                  <InputCheckbox {...{ register, errors }} label="on" name="include" />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("minLength")}</FormFieldLabel>
                  <InputNumber {...{ register, errors }} name="minLength" disabled={loading} />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("maxLength")}</FormFieldLabel>
                  <InputNumber {...{ register, errors }} name="maxLength" disabled={loading} />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Format")}</FormFieldLabel>
                  {/* @ts-ignore */}
                  <SelectSingle
                    {...{ register, errors, control }}
                    name="format"
                    options={formatSelectOptions}
                    disabled={loading}
                  />
                </FormFieldInput>
              </FormField>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
