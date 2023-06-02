import * as React from "react";
import * as styles from "./TemplateFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Divider, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputNumber, InputText, Textarea, SelectSingle } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useAction } from "../../../hooks/action";
import { useCronjob } from "../../../hooks/cronjob";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import Skeleton from "react-loading-skeleton";
import { validateStringAsJSON } from "../../../services/validateJSON";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

export const formId: string = "template-form";

interface TemplateFormTemplateProps {
  template?: any;
}

export const TemplateFormTemplate: React.FC<TemplateFormTemplateProps> = ({ template }) => {
  const { t } = useTranslation();
  // const { setIsLoading, isLoading } = useIsLoadingContext();

  // const [listensAndThrows, setListensAndThrows] = React.useState<any[]>([]);
  // const [selectedHanlderSchema, setSelectedHanlderSchema] = React.useState<any>(null);
  // const [actionHandlerSchema, setActionHandlerSchema] = React.useState<any>(action?.actionHandlerConfiguration);
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  // const queryClient = useQueryClient();

  // const _useAction = useAction(queryClient);
  // const createOrEditAction = _useAction.createOrEdit();
  // const getAllHandlers = _useAction.getAllHandlers();

  // const _useCronjob = useCronjob(queryClient);
  // const getCronjobs = _useCronjob.getAll();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // const watchClass = watch("class");

  // React.useEffect(() => {
  //   setIsLoading({ actionForm: createOrEditAction.isLoading });
  // }, [createOrEditAction.isLoading]);

  // React.useEffect(() => {
  //   if (!watchClass || !getAllHandlers.data) return;

  //   const selectedHandler = getAllHandlers.data.find((handler) => handler.class === watchClass.value);

  //   setSelectedHanlderSchema(selectedHandler.configuration);
  // }, [watchClass, getAllHandlers.isSuccess]);

  // React.useEffect(() => {
  //   if (!getCronjobs.data) return;

  //   const cronjobs = getCronjobs.data.map((cronjob) => ({ label: cronjob.name, value: cronjob.name }));

  //   setListensAndThrows([...cronjobs, ...predefinedSubscriberEvents]);
  // }, [getCronjobs.isSuccess]);

  const onSubmit = (data: any): void => {
    console.log("Template", data);
    // const payload = {
    //   ...data,
    //   listens: data.listens?.map((listener: any) => listener.value),
    //   throws: data.throws?.map((_throw: any) => _throw.value),
    //   class: data.class.value,
    //   conditions: data.conditions ? JSON.parse(data.conditions) : [],
    //   configuration: {},
    // };

    // for (const [key, _] of Object.entries(selectedHanlderSchema.properties)) {
    //   payload.configuration[key] = data[key];
    //   delete payload[key];
    // }

    // createOrEditAction.mutate({ payload, id: action?.id });

    // action && queryClient.setQueryData(["actions", action.id], payload);
  };

  // const handleSetFormValues = (): void => {
  //   const basicFields: string[] = ["name", "description", "priority", "async", "isLockable", "isEnabled"];
  //   basicFields.forEach((field) => setValue(field, action[field]));

  //   setValue("conditions", JSON.stringify(action["conditions"]));

  //   setValue("class", { label: action.class, value: action.class });

  //   setValue(
  //     "listens",
  //     action["listens"].map((listen: any) => ({ label: listen, value: listen })),
  //   );

  //   setValue(
  //     "throws",
  //     action["throws"].map((_throw: any) => ({ label: _throw, value: _throw })),
  //   );

  //   if (actionHandlerSchema?.properties) {
  //     for (const [key, value] of Object.entries(actionHandlerSchema.properties)) {
  //       const _value = value as any;

  //       setValue(key, action.configuration[key]);

  //       if (_value.type === "object") {
  //         action.configuration[key] && setValue(key, JSON.stringify(action.configuration[key]));
  //       }

  //       setActionHandlerSchema((schema: any) => ({
  //         ...schema,
  //         properties: { ...schema.properties, [key]: { ..._value, value: action.configuration[key] } },
  //       }));
  //     }
  //   }
  // };

  // React.useEffect(() => {
  //   action && handleSetFormValues();
  // }, [action]);

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
              <Tab className={styles.tab} label={t("Advanced")} value={1} />
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
                        // disabled={isLoading.actionForm}
                      />
                    </FormFieldInput>
                  </FormField>
                </div>
              </div>
            </TabPanel>

            <TabPanel className={styles.tabPanel} value="1">
              <div className={styles.gridContainer}>
                <div className={styles.grid}></div>
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </form>
    </div>
  );
};
