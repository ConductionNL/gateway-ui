import * as React from "react";
import * as styles from "./SecurityGroupFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { SelectCreate } from "@conduction/components/lib/components/formFields";
import { useQueryClient } from "react-query";
import { useSecurityGroup } from "../../../hooks/securityGroup";

interface EditSecurityGroupFormTemplateProps {
  securityGroup: any;
  securityGroupId: string;
}

export const EditSecurityGroupFormTemplate: React.FC<EditSecurityGroupFormTemplateProps> = ({
  securityGroup,
  securityGroupId,
}) => {
  const { t } = useTranslation();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useSecurityGroups = useSecurityGroup(queryClient);
  const createOrEditSecurityGroup = _useSecurityGroups.createOrEdit(securityGroupId);
  const deleteSecurityGroup = _useSecurityGroups.remove();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const handleSetFormValues = (securityGroup: any): void => {
    const basicFields: string[] = ["name", "description", "config"];
    basicFields.forEach((field) => setValue(field, securityGroup[field]));

    setValue(
      "scopes",
      securityGroup["scopes"]?.map((scope: any) => ({ label: scope, value: scope })),
    );
  };

  React.useEffect(() => {
    handleSetFormValues(securityGroup);
  }, []);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      scopes: data.scopes?.map((scope: any) => scope.value),
    };
    createOrEditSecurityGroup.mutate({ payload, id: securityGroupId });
  };

  const handleDelete = () => {
    deleteSecurityGroup.mutate({ id: securityGroupId });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{`Edit ${securityGroup.name}`}</Heading1>

          <div className={styles.buttons}>
            <Button className={clsx(styles.buttonIcon, styles.button)} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)} onClick={handleDelete}>
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
                <InputText {...{ register, errors }} name="config" disabled={loading} />
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

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Scopes")}</FormFieldLabel>
                <SelectCreate options={[]} name="scopes" {...{ register, errors, control }} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};
