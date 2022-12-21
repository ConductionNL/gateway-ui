import * as React from "react";
import * as styles from "./UserGroupFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface EditUserGroupFormTemplateProps {
  userGroup: any;
  userGroupId: string;
}

export const EditUserGroupFormTemplate: React.FC<EditUserGroupFormTemplateProps> = ({ userGroup, userGroupId }) => {
  const { t } = useTranslation();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handleSetFormValues = (userGroup: any): void => {
    const basicFields: string[] = ["name", "description", "config"];
    basicFields.forEach((field) => setValue(field, userGroup[field]));
  };

  React.useEffect(() => {
    handleSetFormValues(userGroup);
  }, []);

  return (
    <div className={styles.container}>
      <form>
        <section className={styles.section}>
          <Heading1>{t("Edit User Group")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>
        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
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
                <FormFieldLabel>{t("Config")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="config" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Description")}</FormFieldLabel>
                <Textarea
                  {...{ register, errors }}
                  name="description"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField></FormField>

            <FormField>
              <FormFieldInput>
                <InputCheckbox
                  {...{ register, errors }}
                  label={t("Scope 1")}
                  name="scope1"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <InputCheckbox
                  {...{ register, errors }}
                  label={t("Scope 2")}
                  name="scope2"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <InputCheckbox
                  {...{ register, errors }}
                  label={t("Scope 3")}
                  name="scope3"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <InputCheckbox
                  {...{ register, errors }}
                  label={t("Scope 4")}
                  name="scope4"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};
