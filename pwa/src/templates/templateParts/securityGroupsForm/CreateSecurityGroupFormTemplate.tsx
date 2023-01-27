import * as React from "react";
import * as styles from "./SecurityGroupFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { SelectCreate } from "@conduction/components/lib/components/formFields";
import { useQueryClient } from "react-query";
import { useSecurityGroup } from "../../../hooks/securityGroup";
import clsx from "clsx";

interface CreateSecurityGroupFormTemplateProps {
  securityGroupId?: string;
}

export const CreateSecurityGroupFormTemplate: React.FC<CreateSecurityGroupFormTemplateProps> = ({
  securityGroupId,
}) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const _useSecurityGroups = useSecurityGroup(queryClient);
  const createOrEditSecurityGroup = _useSecurityGroups.createOrEdit(securityGroupId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      scopes: data.scopes?.map((scope: any) => scope.value),
    };
    createOrEditSecurityGroup.mutate({ payload, id: securityGroupId });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Security Group")}</Heading1>

          <div className={styles.buttons}>
            <Button className={clsx(styles.buttonIcon, styles.button)} type="submit">
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
                <InputText {...{ register, errors }} name="name" validation={{ required: true }} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Config")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="config" />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Description")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="description" validation={{ required: true }} />
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
