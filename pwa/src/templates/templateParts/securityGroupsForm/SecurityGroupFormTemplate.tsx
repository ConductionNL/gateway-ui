import * as React from "react";
import * as styles from "./SecurityGroupFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { SelectCreate } from "@conduction/components/lib/components/formFields";
import { useQueryClient } from "react-query";
import { useSecurityGroup } from "../../../hooks/securityGroup";
import { IsLoadingContext } from "../../../context/isLoading";

interface SecurityGroupFormTemplateProps {
  securityGroup?: any;
}

export const formId: string = "security-group-form";

export const SecurityGroupFormTemplate: React.FC<SecurityGroupFormTemplateProps> = ({ securityGroup }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = useQueryClient();
  const _useSecurityGroups = useSecurityGroup(queryClient);
  const createOrEditSecurityGroup = _useSecurityGroups.createOrEdit(securityGroup?.id);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      scopes: data.scopes?.map((scope: any) => scope.value),
    };
    createOrEditSecurityGroup.mutate({ payload, id: securityGroup?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["name", "description", "config"];
    basicFields.forEach((field) => setValue(field, securityGroup[field]));

    setValue(
      "scopes",
      securityGroup["scopes"]?.map((scope: any) => ({ label: scope, value: scope })),
    );
  };

  React.useEffect(() => {
    securityGroup && handleSetFormValues();
  }, [securityGroup]);

  React.useEffect(() => {
    setIsLoading({ ...isLoading, securityGroupForm: createOrEditSecurityGroup.isLoading });
  }, [createOrEditSecurityGroup.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={{ required: true }}
                disabled={isLoading.securityGroupForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Config")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="config" disabled={isLoading.securityGroupForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="description"
                validation={{ required: true }}
                disabled={isLoading.securityGroupForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Scopes")}</FormFieldLabel>
              <SelectCreate
                options={[]}
                name="scopes"
                {...{ register, errors, control }}
                disabled={isLoading.securityGroupForm}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};
