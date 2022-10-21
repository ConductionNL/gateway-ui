import * as React from "react";
import * as styles from "./SchemesFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useScheme } from "../../../hooks/scheme";

interface CreateSchemesFormTemplateProps {
  schemeId?: string;
}

export const CreateSchemesFormTemplate: React.FC<CreateSchemesFormTemplateProps> = ({ schemeId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useScheme = useScheme(queryClient);
  const createOrEditScheme = _useScheme.createOrEdit(schemeId);

  const functionSelectOptions = [
    { label: "No Function", value: "noFunction" },
    { label: "Organization", value: "organization" },
    { label: "Person", value: "person" },
    { label: "User", value: "user" },
    { label: "User Group", value: "userGroup" },
    { label: "Processing Log", value: "processingLog" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditScheme.mutate({ payload: data, id: schemeId });
  };

  return (
    <>
      <form>
        <section className={styles.section}>
          <Heading1>{t("Create Scheme")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />

              {t("Save")}
            </Button>
          </div>
        </section>
        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
        <div className={styles.container}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Name")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Description")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="description" disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Function")}</FormFieldLabel>
                <SelectSingle
                  name="function"
                  options={functionSelectOptions}
                  {...{ control, errors }}
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Schema")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="schema" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </>
  );
};
