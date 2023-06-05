import * as React from "react";
import * as styles from "./TemplateFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle, Textarea } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useTemplate } from "../../../hooks/template";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { useOrganization } from "../../../hooks/organization";
import Skeleton from "react-loading-skeleton";
import { SelectMultiple } from "@conduction/components/lib/components/formFields";
import { useSchema } from "../../../hooks/schema";
import { CodeEditor } from "../../../components/codeEditor/CodeEditor";

export const formId: string = "template-form";

interface TemplateFormTemplateProps {
  template?: any;
}

export const TemplateFormTemplate: React.FC<TemplateFormTemplateProps> = ({ template }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [templateContentFieldValue, setTemplateContentFieldValue] = React.useState<string>("");

  const queryClient = useQueryClient();

  const _useTemplate = useTemplate(queryClient);
  const createOrEditTemplate = _useTemplate.createOrEdit();

  const _useOrganization = useOrganization(queryClient);
  const getOrganizations = _useOrganization.getAll();

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();
  const refSchemas = getSchemas.isSuccess && getSchemas.data?.filter((schema) => schema.reference);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    setIsLoading({ templateForm: createOrEditTemplate.isLoading });
  }, [createOrEditTemplate.isLoading]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      organization: data.organization && `/admin/organisations/${data.organization.value}`,
      supportedSchemas: data.supportedSchemas.map((schema: any) => schema.value),
      content: templateContentFieldValue,
    };

    createOrEditTemplate.mutate({ payload, id: template?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["name", "description"];
    basicFields.forEach((field) => setValue(field, template[field]));

    setValue("organization", { label: template?.organization.name, value: template?.organization.id });

    setTemplateContentFieldValue(template.content);
  };

  const getSelectedSchemaByRef = (schema: any) => {
    const refSchema = refSchemas && refSchemas.find((refSchema: any) => refSchema.reference === schema);

    return { label: refSchema.name, value: refSchema.reference };
  };

  const handleSetSupportedSchemasFormValues = (): void => {
    setValue(
      "supportedSchemas",
      template.supportedSchemas?.map((schema: any) => getSelectedSchemaByRef(schema)),
    );
  };

  React.useEffect(() => {
    template && handleSetFormValues();
    template && getSchemas.isSuccess && handleSetSupportedSchemasFormValues();
  }, [template, getSchemas.isSuccess]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
        <div className={styles.tabContainer}>
          <TabContext value={currentTab.toString()}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue: number) => {
                setCurrentTab(newValue);
              }}
              variant="scrollable"
            >
              <Tab className={styles.tab} label={t("General")} value={0} />
            </Tabs>

            <TabPanel className={styles.tabPanel} value="0">
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Name")}</FormFieldLabel>
                      <InputText
                        {...{ register, errors }}
                        name="name"
                        validation={enrichValidation({ required: true, maxLength: 225 })}
                        disabled={isLoading.templateForm}
                      />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Organization")}</FormFieldLabel>

                      {getOrganizations.isLoading && <Skeleton height="50px" />}
                      {getOrganizations.isSuccess && (
                        <SelectSingle
                          options={getOrganizations.data.map((organization: any) => ({
                            label: organization.name,
                            value: organization.id,
                          }))}
                          name="organization"
                          {...{ register, errors, control }}
                          disabled={isLoading.templateForm}
                          validation={enrichValidation({ required: true })}
                        />
                      )}
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Supported Schemas")}</FormFieldLabel>

                      {getSchemas.isLoading && <Skeleton height="50px" />}
                      {getSchemas.isSuccess && refSchemas && (
                        <SelectMultiple
                          options={refSchemas.map((schema: any) => ({
                            label: schema.name,
                            value: schema.reference,
                          }))}
                          name="supportedSchemas"
                          {...{ register, errors, control }}
                          disabled={isLoading.templateForm}
                        />
                      )}
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Description")}</FormFieldLabel>
                      <Textarea {...{ register, errors }} name="description" disabled={isLoading.templateForm} />
                    </FormFieldInput>
                  </FormField>
                </div>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Content")}</FormFieldLabel>
                    <CodeEditor
                      code={templateContentFieldValue}
                      setCode={setTemplateContentFieldValue}
                      readOnly={isLoading.templateForm}
                      language="html"
                    />
                  </FormFieldInput>
                </FormField>
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </form>
    </div>
  );
};
