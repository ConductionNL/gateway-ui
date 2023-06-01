import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import _ from "lodash";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, SelectSingle, Textarea } from "@conduction/components";
import { useSource } from "../../../hooks/source";
import { useQueryClient } from "react-query";
import { CreateKeyValue, IKeyValue } from "@conduction/components/lib/components/formFields";
import { SourcesAuthFormTemplate } from "./SourcesAuthFormTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";
import { translateDate } from "../../../services/dateFormat";
import { getStatusTag } from "../../../services/getStatusTag";
import { StatusTag } from "../../../components/statusTag/StatusTag";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { advancedFormKeysToRemove } from "./SourceFormAdvancedTemplate";
import { useAdvancedSwitchContext } from "../../../context/advancedSwitch";
import { useAdvancedSwitch } from "../../../hooks/useAdvancedSwitch";

interface SourceTemplateProps {
  source?: any;
}

export const formId: string = "source-form";

export const SourceFormTemplate: React.FC<SourceTemplateProps> = ({ source }) => {
  const { t, i18n } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [selectedAuth, setSelectedAuth] = React.useState<any>(null);
  const [headers, setHeaders] = React.useState<IKeyValue[]>([]);
  const [query, setQuery] = React.useState<IKeyValue[]>([]);

  // const { advancedSwitch, setupAdvancedSwitch } = useAdvancedSwitchContext();

  const queryClient = useQueryClient();
  const _useSources = useSource(queryClient);
  const createOrEditSource = _useSources.createOrEdit(source?.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const { AdvancedSwitch, advancedSwitchState, setupAdvancedSwitch, set } = useAdvancedSwitch(
    isLoading.sourceForm ?? false,
    register,
    errors,
  );

  const watchAuth = watch("auth");
  const watchHeaders = watch("headers");
  const watchQuery = watch("query");

  React.useEffect(() => {
    setIsLoading({ sourceForm: createOrEditSource.isLoading });
  }, [createOrEditSource.isLoading]);

  React.useEffect(() => {
    if (!watchAuth) return;

    const selectedAuth = authSelectOptions.find((authOption) => authOption.value === watchAuth.value);

    setSelectedAuth(selectedAuth?.value);
  }, [watchAuth]);

  React.useEffect(() => {
    if (!watchHeaders || !Array.isArray(watchHeaders)) return;

    const newHeaders = watchHeaders?.map((item: any) => ({ key: item.key, value: item.value }));

    watchHeaders !== headers && setHeaders(newHeaders);
  }, [watchHeaders]);

  React.useEffect(() => {
    if (!watchQuery || !Array.isArray(watchQuery)) return;

    const newQuery = watchQuery?.map((item: any) => ({ key: item.key, value: item.value }));

    watchQuery !== query && setQuery(newQuery);
  }, [watchQuery]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      auth: data.auth && data.auth.value,
      configuration: {
        headers: _.isEqual(source?.configuration.headers, data.headers)
          ? data.headers
          : convertArrayToObject(data.headers),
        query: _.isEqual(source?.configuration.query, data.query) ? data.query : convertArrayToObject(data.query),
        debug: data.debug,
        https_errors: data.https_errors,
        connect_timeout: data.connect_timeout,
        force_ip_resolve: data.force_ip_resolve,
        version: data.version,
        read_timeout: data.read_timeout,
        idn_conversion:
          advancedSwitchState.idnConversion === "int" ? data.idn_conversion_int : data.idn_conversion_bool,
        delay: data.delay,
        expect: advancedSwitchState.expect === "int" ? data.expect_int : data.expect_bool,
        verify: advancedSwitchState.verify === "string" ? data.verify_str : data.verify_bool,
        decode_content:
          advancedSwitchState.decodeContent === "string" ? data.decode_content_str : data.decode_content_bool,
        proxy: data.proxy,
      },
    };

    Object.keys(payload)
      .filter((key) => advancedFormKeysToRemove.includes(key))
      .forEach((key) => {
        delete payload[key];
      }); // removing all the keys that we are already sending in payload.configuration

    createOrEditSource.mutate({ payload, id: source?.id });

    source?.id && queryClient.setQueryData(["sources", source.id], payload); // optimistic update query data
  };

  const handleSetFormValues = (_source: any): void => {
    const source = {
      ..._source,
      configuration: {
        ..._source.configuration,
        headers: _source.configuration.headers ?? _source.headers ?? [],
        query: _source.configuration.query ?? _source.query ?? [],
      },
    };

    const basicFields: string[] = [
      "name",
      "isEnabled",
      "status",
      "description",
      "location",
      "accept",
      "dateCreated",
      "dateModified",
      "documentation",
      "username",
      "password",
      "apikey",
      "jwtId",
      "secret",
      "jwt",
    ];
    basicFields.forEach((field) => setValue(field, source[field]));

    setValue(
      "auth",
      authSelectOptions.find((option) => source.auth === option.value),
    );

    if (source.configuration) {
      for (const [key, value] of Object.entries(source.configuration)) {
        const _value = value as any;

        setValue(key, source.configuration[key]);

        ["headers", "query"].forEach((item) => {
          let data: any = [];

          if (Array.isArray(source.configuration[item]) || source.configuration[item] === undefined) {
            data = source.configuration[item];
          } else {
            data = Object.entries(source.configuration[item]).map(([key, value]) => ({
              key,
              value,
            }));
          }

          if (item === "headers") setHeaders(data);
          if (item === "query") setQuery(data);
        });

        if (key === "decode_content" && typeof _value === "string") {
          setValue("decode_content_str", _value);
          set.decodeContent("string");
        }
        if (key === "decode_content" && typeof _value === "boolean") {
          setValue("decode_content_bool", _value);
          set.decodeContent("boolean");
        }

        if (key === "expect" && typeof _value === "number") {
          setValue("expect_int", _value);
          set.expect("int");
        }
        if (key === "expect" && typeof _value === "boolean") {
          setValue("expect_bool", _value);
          set.expect("boolean");
        }

        if (key === "verify" && typeof _value === "string") {
          setValue("verify_str", _value);
          set.verify("string");
        }
        if (key === "verify" && typeof _value === "boolean") {
          setValue("verify_bool", _value);
          set.verify("boolean");
        }

        if (key === "idn_conversion" && typeof _value === "number") {
          setValue("idn_conversion_int", _value);
          set.idnConversion("int");
        }
        if (key === "idn_conversion" && typeof _value === "boolean") {
          setValue("idn_conversion_bool", _value);
          set.idnConversion("boolean");
        }

        // if (Number.isInteger(value)) newAdvancedSwitch.delay = "int";
        // else newAdvancedSwitch.delay = "float";
        if (key === "delay" && Number.isInteger(value)) {
          set.delay("int");
        } else {
          set.delay("float");
        }
      }

      // setupAdvancedSwitch(source.configuration);
    }
  };

  React.useEffect(() => {
    source && handleSetFormValues(source);
  }, [source]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("General")} value={0} />
            <Tab className={styles.tab} label={t("Query")} value={1} />
            <Tab className={styles.tab} label={t("Header")} value={2} />
            <Tab className={styles.tab} label={t("Advanced")} value={3} />
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
                      disabled={isLoading.sourceForm}
                    />
                  </FormFieldInput>
                </FormField>

                {source && (
                  <>
                    <FormField>
                      <FormFieldLabel>{t("Status")}</FormFieldLabel>

                      <div>{getStatusTag(source.status)}</div>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Created")}</FormFieldLabel>
                        <StatusTag label={translateDate(i18n.language, source.dateCreated) ?? "-"} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Modified")}</FormFieldLabel>
                        <StatusTag label={translateDate(i18n.language, source.dateModified) ?? "-"} />
                      </FormFieldInput>
                    </FormField>
                  </>
                )}
              </div>
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Description")}</FormFieldLabel>
                  <Textarea {...{ register, errors }} name="description" disabled={isLoading.sourceForm} />
                </FormFieldInput>
              </FormField>

              <div className={styles.grid}>
                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Location")}</FormFieldLabel>
                    <InputText
                      {...{ register, errors }}
                      name="location"
                      validation={enrichValidation({ required: true, maxLength: 225 })}
                      disabled={isLoading.sourceForm}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("authType")}</FormFieldLabel>
                    <SelectSingle
                      {...{ register, errors, control }}
                      name="auth"
                      options={authSelectOptions}
                      validation={enrichValidation({ required: true })}
                      disabled={isLoading.sourceForm}
                    />
                  </FormFieldInput>
                </FormField>

                {selectedAuth && <SourcesAuthFormTemplate {...{ selectedAuth, register, errors }} />}

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("isEnabled")}</FormFieldLabel>
                    <InputCheckbox
                      disabled={isLoading.sourceForm}
                      {...{ register, errors }}
                      label="on"
                      name="isEnabled"
                    />
                  </FormFieldInput>
                </FormField>
              </div>
            </div>
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            <CreateKeyValue
              name="query"
              disabled={isLoading.sourceForm}
              defaultValue={query}
              {...{ register, errors, control }}
            />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
            <CreateKeyValue
              disabled={isLoading.sourceForm}
              name="headers"
              defaultValue={headers}
              {...{ register, errors, control }}
            />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="3">
            <AdvancedSwitch />
          </TabPanel>
        </TabContext>
      </form>
    </div>
  );
};

const authSelectOptions = [
  { label: "No Auth", value: "none" },
  { label: "API Key", value: "apikey" },
  { label: "JWT-HS256", value: "jwt-HS256" },
  { label: "Username and Password", value: "username-password" },
  { label: "VrijBRP-JWT", value: "vrijbrp-jwt" },
  { label: "Pink-JWT", value: "pink-jwt" },
];

const convertArrayToObject = (array: IKeyValue[]): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const obj of array) {
    result[obj.key] = obj.value;
  }

  return result;
};
