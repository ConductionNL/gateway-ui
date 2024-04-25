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
import { CreateKeyValue, IKeyValue, InputNumber } from "@conduction/components/lib/components/formFields";
import { SourcesAuthFormTemplate } from "./SourcesAuthFormTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";
import { translateDate } from "../../../services/dateFormat";
import { getStatusTag } from "../../../services/getStatusTag";
import { StatusTag } from "../../../components/statusTag/StatusTag";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { advancedFormKeysToRemove } from "./SourceFormAdvancedTemplate";
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

  const { AdvancedSwitch, advancedSwitchState, set } = useAdvancedSwitch(
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
      authorizationPassthroughMethod: data.authorizationPassthroughMethod.value ?? "Authorization",
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
        delay: advancedSwitchState.delay === "int" ? data.delay_int : data.delay_float,
        expect: advancedSwitchState.expect === "int" ? data.expect_int : data.expect_bool,
        verify: advancedSwitchState.verify === "string" ? data.verify_str : data.verify_bool,
        decode_content:
          advancedSwitchState.decodeContent === "string" ? data.decode_content_str : data.decode_content_bool,
        proxy: data.proxy,
      },
      loggingConfig: {
        callBody: data.callBody,
        callContentType: data.callContentType,
        callQuery: data.callQuery,
        callUrl: data.callUrl,
        maxCharCountBody: data.maxCharCountBody,
        maxCharCountErrorBody: data.maxCharCountErrorBody,
        responseBody: data.responseBody,
        responseContentType: data.responseContentType,
        responseStatusCode: data.responseStatusCode,
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
      "reference",
      "version",
      "name",
      "isEnabled",
      "status",
      "description",
      "location",
      "accept",
      "authorizationHeader",
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

    const loggingConfigFields: string[] = [
      "callBody",
      "callContentType",
      "callQuery",
      "callUrl",
      "maxCharCountBody",
      "maxCharCountErrorBody",
      "responseBody",
      "responseContentType",
      "responseStatusCode",
    ];
    loggingConfigFields.forEach((field) => setValue(field, source["loggingConfig"]?.field));

    setValue(
      "auth",
      authSelectOptions.find((option) => source.auth === option.value),
    );

    setValue(
      "authorizationPassthroughMethod",
      authorizationPassthroughMethodSelectOptions.find(
        (option) => source.authorizationPassthroughMethod === option.value,
      ),
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

        if ((key === "delay" && Number.isInteger(_value)) || null || undefined) {
          setValue("delay_int", _value);
          set.delay("int");
        }
        if (key === "delay" && !Number.isInteger(_value)) {
          setValue("delay_float", _value);
          set.delay("float");
        }
      }
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
            <Tab className={styles.tab} label={t("Logging config")} value={4} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <div className={styles.gridContainer}>
              {source && (
                <div className={styles.statusContainer}>
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
                </div>
              )}
              <div className={styles.grid}>
                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Reference")}</FormFieldLabel>
                    <InputText
                      {...{ register, errors }}
                      name="reference"
                      disabled={isLoading.sourceForm}
                      ariaLabel={t("Enter reference")}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Version")}</FormFieldLabel>
                    <InputText
                      {...{ register, errors }}
                      name="version"
                      disabled={isLoading.sourceForm}
                      defaultValue={source?.version ?? "0.0.0"}
                      ariaLabel={t("Enter version")}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Name")}</FormFieldLabel>
                    <InputText
                      {...{ register, errors }}
                      name="name"
                      validation={enrichValidation({ required: true, maxLength: 225 })}
                      disabled={isLoading.sourceForm}
                      ariaLabel={t("Enter name")}
                    />
                  </FormFieldInput>
                </FormField>
              </div>
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Description")}</FormFieldLabel>
                  <Textarea
                    {...{ register, errors }}
                    name="description"
                    disabled={isLoading.sourceForm}
                    ariaLabel={t("Enter description")}
                  />
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
                      ariaLabel={t("Enter location")}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Authorization header")}</FormFieldLabel>
                    <InputText
                      {...{ register, errors }}
                      name="authorizationHeader"
                      disabled={isLoading.sourceForm}
                      defaultValue={"Authorization"}
                      ariaLabel={t("Enter authorization header")}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Authorization passthrough method")}</FormFieldLabel>
                    <SelectSingle
                      {...{ register, errors, control }}
                      name="authorizationPassthroughMethod"
                      options={authorizationPassthroughMethodSelectOptions}
                      disabled={isLoading.sourceForm}
                      defaultValue={authorizationPassthroughMethodSelectOptions.find(
                        (option) => option.value === "header",
                      )}
                      ariaLabel={t("Select authorization passthrough method")}
                    />
                  </FormFieldInput>
                </FormField>

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

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("authType")}</FormFieldLabel>
                    <SelectSingle
                      {...{ register, errors, control }}
                      name="auth"
                      options={authSelectOptions}
                      disabled={isLoading.sourceForm}
                      defaultValue={authSelectOptions.find((option) => option.value === "none")}
                      ariaLabel={t("Select authType")}
                    />
                  </FormFieldInput>
                </FormField>

                {selectedAuth && <SourcesAuthFormTemplate {...{ selectedAuth, register, errors }} />}
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

          <TabPanel className={styles.tabPanel} value="4">
            <div className={styles.gridContainer}>
              <p className={styles.infoParagraph}>
                {t("Here you can configure what you want to log for requests that are made to this source.")}
              </p>
              <div className={styles.grid}>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Call body")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="callBody"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.callBody ?? true}
                    label="True"
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Call content type")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="callContentType"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.callContentType ?? true}
                    label="True"
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Call query")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="callQuery"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.callQuery ?? true}
                    label="True"
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Call url")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="callUrl"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.callUrl ?? true}
                    label="True"
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Max character count body")}</FormFieldLabel>
                  </div>
                  <InputNumber
                    {...{ register, errors, control }}
                    name="maxCharCountBody"
                    disabled={isLoading.sourceForm}
                    defaultValue={source?.loggingConfig?.maxCharCountBody ?? "500"}
                    ariaLabel={t("Enter max character count body")}
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Max character count error body")}</FormFieldLabel>
                  </div>
                  <InputNumber
                    {...{ register, errors, control }}
                    name="maxCharCountErrorBody"
                    disabled={isLoading.sourceForm}
                    defaultValue={source?.loggingConfig?.maxCharCountErrorBody ?? "2000"}
                    ariaLabel={t("Enter max character count error body")}
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Response body")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="responseBody"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.responseBody ?? true}
                    label="True"
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Response content type")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="responseContentType"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.responseContentType ?? true}
                    label="True"
                  />
                </FormField>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Response status code")}</FormFieldLabel>
                  </div>
                  <InputCheckbox
                    {...{ register, errors, control }}
                    name="responseStatusCode"
                    disabled={isLoading.sourceForm}
                    defaultChecked={source?.loggingConfig?.responseStatusCode ?? true}
                    label="True"
                  />
                </FormField>
              </div>
            </div>
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

const authorizationPassthroughMethodSelectOptions = [
  { label: "header", value: "header" },
  { label: "query", value: "query" },
  { label: "form_params", value: "form_params" },
  { label: "json", value: "json" },
];

const convertArrayToObject = (array: IKeyValue[]): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const obj of array) {
    result[obj.key] = obj.value;
  }

  return result;
};
