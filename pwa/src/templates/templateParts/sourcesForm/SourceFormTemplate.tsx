import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useSource } from "../../../hooks/source";
import { useQueryClient } from "react-query";
import { InputFloat, InputNumber } from "@conduction/components/lib/components/formFields/input";
import { CreateKeyValue, IKeyValue } from "@conduction/components/lib/components/formFields";
import { SourcesAuthFormTemplate } from "./SourcesAuthFormTemplate";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import ToggleButton from "../../../components/toggleButton/ToggleButton";
import { useIsLoadingContext } from "../../../context/isLoading";
import { translateDate } from "../../../services/dateFormat";
import { getStatusTag } from "../../../services/getStatusTag";
import { StatusTag } from "../../../components/statusTag/StatusTag";

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

  const [advancedSwitch, setAdvancedSwitch] = React.useState({
    decodeContent: "string" as "string" | "boolean",
    delay: "int" as "int" | "float",
    expect: "int" as "int" | "boolean",
    verify: "string" as "string" | "boolean",
    idnConversion: "int" as "int" | "boolean",
  });

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
    if (!watchHeaders) return;

    const newHeaders = watchHeaders?.map((item: any) => ({ key: item.key, value: item.value }));

    watchHeaders !== headers && setHeaders(newHeaders);
  }, [watchHeaders]);

  React.useEffect(() => {
    if (!watchQuery) return;

    const newQuery = watchQuery?.map((item: any) => ({ key: item.key, value: item.value }));

    watchQuery !== query && setQuery(newQuery);
  }, [watchQuery]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      type: data.type && data.type.value,
      auth: data.auth && data.auth.value,
      configuration: {
        connect_timeout: data.connect_timeout,
        debug: data.debug,
        decode_content: advancedSwitch.decodeContent === "string" ? data.decode_content_str : data.decode_content_bool,
        delay: data.delay,
        expect: advancedSwitch.expect === "int" ? data.expect_int : data.expect_bool,
        force_ip_resolve: data.force_ip_resolve,
        verify: advancedSwitch.verify === "string" ? data.verify_str : data.verify_bool,
        version: data.version,
        read_timeout: data.read_timeout,
        proxy: data.proxy,
        idn_conversion: advancedSwitch.idnConversion === "int" ? data.idn_conversion_int : data.idn_conversion_bool,
        https_errors: data.https_errors,
      },
    };

    createOrEditSource.mutate({ payload, id: source?.id });

    source?.id && queryClient.setQueryData(["sources", source.id], payload); // optimistic update query data
  };

  const setupAdvancedSwitch = () => {
    const newAdvancedSwitch = { ...advancedSwitch };

    for (const [key, value] of Object.entries(source.configuration)) {
      if (key === "decode_content") {
        if (typeof value === "string") newAdvancedSwitch.decodeContent = "string";
        if (typeof value === "boolean") newAdvancedSwitch.decodeContent = "boolean";
        continue;
      }
      if (key === "delay") {
        if (Number.isInteger(value)) newAdvancedSwitch.delay = "int";
        else newAdvancedSwitch.delay = "float";
        continue;
      }
      if (key === "expect") {
        if (typeof value === "number") newAdvancedSwitch.expect = "int";
        if (typeof value === "boolean") newAdvancedSwitch.expect = "boolean";
        continue;
      }
      if (key === "verify") {
        if (typeof value === "string") newAdvancedSwitch.verify = "string";
        if (typeof value === "boolean") newAdvancedSwitch.verify = "boolean";
        continue;
      }
      if (key === "idn_conversion") {
        if (typeof value === "number") newAdvancedSwitch.idnConversion = "int";
        if (typeof value === "boolean") newAdvancedSwitch.idnConversion = "boolean";
      }
    }

    setAdvancedSwitch(newAdvancedSwitch);
  };

  const handleSetFormValues = (source: any): void => {
    const basicFields: string[] = [
      "name",
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
      "jwt",
      "connect_timeout",
    ];
    basicFields.forEach((field) => setValue(field, source[field]));

    setValue(
      "type",
      typeSelectOptions.find((option) => source.type === option.value),
    );

    setValue(
      "auth",
      authSelectOptions.find((option) => source.auth === option.value),
    );

    if (source.configuration) {
      for (const [key, value] of Object.entries(source.configuration)) {
        const _value = value as any;

        setValue(key, source.configuration[key]);

        if (typeof _value === "object") {
          source.configuration[key] && setValue(key, JSON.stringify(source.configuration[key]));
        }

        if (key === "decode_content" && typeof _value === "string") setValue("decode_content_str", _value);
        if (key === "decode_content" && typeof _value === "boolean") setValue("decode_content_bool", _value);
        if (key === "expect" && typeof _value === "number") setValue("expect_int", _value);
        if (key === "expect" && typeof _value === "boolean") setValue("expect_bool", _value);
        if (key === "verify" && typeof _value === "string") setValue("verify_str", _value);
        if (key === "verify" && typeof _value === "boolean") setValue("verify_bool", _value);
        if (key === "idn_conversion" && typeof _value === "number") setValue("idn_conversion_int", _value);
        if (key === "idn_conversion" && typeof _value === "boolean") setValue("idn_conversion_bool", _value);
      }

      setupAdvancedSwitch();
    }

    if (Array.isArray(source.headers) || source.headers === undefined) {
      setHeaders(source.headers);
    } else {
      const newHeaders = Object.entries(source.headers).map(([key, value]) => ({ key, value: value as string }));
      setHeaders(newHeaders);
    }

    if (Array.isArray(source.query) || source.query === undefined) {
      setQuery(source.query);
    } else {
      const newQuery = Object.entries(source.query).map(([key, value]) => ({ key, value: value as string }));
      setQuery(newQuery);
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
                      validation={{ required: true, maxLength: 225 }}
                      disabled={isLoading.sourceForm}
                    />
                    {errors["name"] && <ErrorMessage message={errors["name"].message} />}
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
                      validation={{ required: true, maxLength: 225 }}
                      disabled={isLoading.sourceForm}
                    />
                    {errors["location"] && <ErrorMessage message={errors["location"].message} />}
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("authType")}</FormFieldLabel>
                    <SelectSingle
                      {...{ register, errors, control }}
                      name="auth"
                      options={authSelectOptions}
                      validation={{ required: true }}
                      disabled={isLoading.sourceForm}
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
            <div className={styles.gridContainer}>
              <div className={styles.grid}>
                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Connect timeout")}</FormFieldLabel>
                      <a
                        className={styles.infoButton}
                        onClick={() => {
                          open("https://docs.guzzlephp.org/en/stable/request-options.html#connect-timeout");
                        }}
                        data-tip={
                          "Float describing the number of seconds to wait while trying to connect to a server. Use 0 to wait indefinitely (the default behavior)."
                        }
                      >
                        <FontAwesomeIcon
                          data-tip={
                            "Float describing the number of seconds to wait while trying to connect to a server. Use 0 to wait indefinitely (the default behavior)."
                          }
                          icon={faInfoCircle}
                        />
                      </a>
                    </div>
                    <InputFloat disabled={isLoading.sourceForm} {...{ register, errors }} name="connect_timeout" />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Debug")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#debug");
                      }}
                      data-tip={
                        "Set to true or set to a PHP stream returned by fopen() to enable debug output with the handler used to send a request. For example, when using cURL to transfer requests, cURL's verbose of CURLOPT_VERBOSE will be emitted. When using the PHP stream wrapper, stream wrapper notifications will be emitted. If set to true, the output is written to PHP's STDOUT. If a PHP stream is provided, output is written to the stream."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Set to true or set to a PHP stream returned by fopen() to enable debug output with the handler used to send a request. For example, when using cURL to transfer requests, cURL's verbose of CURLOPT_VERBOSE will be emitted. When using the PHP stream wrapper, stream wrapper notifications will be emitted. If set to true, the output is written to PHP's STDOUT. If a PHP stream is provided, output is written to the stream."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <InputCheckbox name="debug" disabled={isLoading.sourceForm} label="True" {...{ register, errors }} />
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Decode content")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#decode-content");
                      }}
                      data-tip={
                        "Specify whether or not Content-Encoding responses (gzip, deflate, etc.) are automatically decoded."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Specify whether or not Content-Encoding responses (gzip, deflate, etc.) are automatically decoded."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <ToggleButton
                    disabled={isLoading.sourceForm}
                    layoutClassName={styles.toggleButton}
                    startLabel="string"
                    endLabel="boolean"
                    onChange={() =>
                      setAdvancedSwitch({
                        ...advancedSwitch,
                        decodeContent: advancedSwitch.decodeContent === "string" ? "boolean" : "string",
                      })
                    }
                  />
                  <div className={styles.expectFormField}>
                    {advancedSwitch.decodeContent === "string" && (
                      <Textarea disabled={isLoading.sourceForm} name="decode_content_str" {...{ register, errors }} />
                    )}
                    {advancedSwitch.decodeContent === "boolean" && (
                      <span className={styles.checkboxInput}>
                        <InputCheckbox name="decode_content_bool" label="True" {...{ register, errors }} />
                      </span>
                    )}
                  </div>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Delay")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#delay");
                      }}
                      data-tip={"The number of milliseconds to delay before sending the request."}
                    >
                      <FontAwesomeIcon
                        data-tip={"The number of milliseconds to delay before sending the request."}
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <ToggleButton
                    disabled={isLoading.sourceForm}
                    layoutClassName={styles.toggleButton}
                    startLabel="int"
                    endLabel="float"
                    onChange={() =>
                      setAdvancedSwitch({
                        ...advancedSwitch,
                        delay: advancedSwitch.delay === "int" ? "float" : "int",
                      })
                    }
                  />
                  <div className={styles.expectFormField}>
                    {advancedSwitch.delay === "int" && (
                      <InputNumber disabled={isLoading.sourceForm} name="delay" {...{ register, errors }} />
                    )}
                    {advancedSwitch.delay === "float" && (
                      <InputFloat disabled={isLoading.sourceForm} name="delay" {...{ register, errors }} />
                    )}
                  </div>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Expect")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#expect");
                      }}
                      data-tip={'Controls the behavior of the "Expect: 100-Continue" header.'}
                    >
                      <FontAwesomeIcon
                        data-tip={'Controls the behavior of the "Expect: 100-Continue" header.'}
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <ToggleButton
                    disabled={isLoading.sourceForm}
                    layoutClassName={styles.toggleButton}
                    startLabel="int"
                    endLabel="boolean"
                    onChange={() =>
                      setAdvancedSwitch({
                        ...advancedSwitch,
                        expect: advancedSwitch.expect === "int" ? "boolean" : "int",
                      })
                    }
                  />
                  <div className={styles.expectFormField}>
                    {advancedSwitch.expect === "boolean" && (
                      <span className={styles.checkboxInput}>
                        <InputCheckbox name="expect_bool" label="True" {...{ register, errors }} />
                      </span>
                    )}
                    {advancedSwitch.expect === "int" && (
                      <InputNumber disabled={isLoading.sourceForm} name="expect_int" {...{ register, errors }} />
                    )}
                  </div>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Force ip resolve")}</FormFieldLabel>
                      <a
                        className={styles.infoButton}
                        onClick={() => {
                          open("https://docs.guzzlephp.org/en/stable/request-options.html#force-ip-resolve");
                        }}
                        data-tip={`Set to "v4" if you want the HTTP handlers to use only ipv4 protocol or "v6" for ipv6 protocol.`}
                      >
                        <FontAwesomeIcon
                          data-tip={`Set to "v4" if you want the HTTP handlers to use only ipv4 protocol or "v6" for ipv6 protocol.`}
                          icon={faInfoCircle}
                        />
                      </a>
                    </div>
                    <InputText disabled={isLoading.sourceForm} {...{ register, errors }} name="force_ip_resolve" />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Verify")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#verify");
                      }}
                      data-tip={
                        "Describes the SSL certificate verification behavior of a request. \n Set to true to enable SSL certificate verification and use the default CA bundle provided by operating system.\nSet to false to disable certificate verification (this is insecure!). \n Set to a string to provide the path to a CA bundle to enable verification using a custom certificate."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Describes the SSL certificate verification behavior of a request. \n Set to true to enable SSL certificate verification and use the default CA bundle provided by operating system.\nSet to false to disable certificate verification (this is insecure!). \n Set to a string to provide the path to a CA bundle to enable verification using a custom certificate."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <ToggleButton
                    disabled={isLoading.sourceForm}
                    layoutClassName={styles.toggleButton}
                    startLabel="string"
                    endLabel="boolean"
                    onChange={() =>
                      setAdvancedSwitch({
                        ...advancedSwitch,
                        verify: advancedSwitch.verify === "string" ? "boolean" : "string",
                      })
                    }
                  />
                  <div className={styles.expectFormField}>
                    {advancedSwitch.verify === "boolean" && (
                      <span className={styles.checkboxInput}>
                        <InputCheckbox
                          disabled={isLoading.sourceForm}
                          name="verify_bool"
                          label="True"
                          {...{ register, errors }}
                        />
                      </span>
                    )}
                    {advancedSwitch.verify === "string" && (
                      <InputText disabled={isLoading.sourceForm} name="verify_str" {...{ register, errors }} />
                    )}
                  </div>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Version")}</FormFieldLabel>
                      <a
                        className={styles.infoButton}
                        onClick={() => {
                          open("https://docs.guzzlephp.org/en/stable/request-options.html#version");
                        }}
                        data-tip={"Protocol version to use with the request."}
                      >
                        <FontAwesomeIcon data-tip={"Protocol version to use with the request."} icon={faInfoCircle} />
                      </a>
                    </div>
                    <InputText disabled={isLoading.sourceForm} {...{ register, errors }} name="version" />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Read timeout")}</FormFieldLabel>
                      <a
                        className={styles.infoButton}
                        onClick={() => {
                          open("https://docs.guzzlephp.org/en/stable/request-options.html#read-timeout");
                        }}
                        data-tip={"Float describing the timeout to use when reading a streamed body"}
                      >
                        <FontAwesomeIcon
                          data-tip={"Float describing the timeout to use when reading a streamed body"}
                          icon={faInfoCircle}
                        />
                      </a>
                    </div>
                    <InputFloat disabled={isLoading.sourceForm} {...{ register, errors }} name="read_timeout" />
                  </FormFieldInput>
                </FormField>
              </div>

              <FormField>
                <FormFieldInput>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Proxy")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#proxy");
                      }}
                      data-tip={
                        "Pass a string to specify an HTTP proxy, or an array to specify different proxies for different protocols."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Pass a string to specify an HTTP proxy, or an array to specify different proxies for different protocols."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <Textarea disabled={isLoading.sourceForm} {...{ register, errors }} name="proxy" />
                </FormFieldInput>
              </FormField>

              <div className={styles.grid}>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Idn conversion")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#idn-conversion");
                      }}
                      data-tip={
                        "Internationalized Domain Name (IDN) support (enabled by default if intl extension is available)."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Internationalized Domain Name (IDN) support (enabled by default if intl extension is available)."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <ToggleButton
                    disabled={isLoading.sourceForm}
                    layoutClassName={styles.toggleButton}
                    startLabel="int"
                    endLabel="boolean"
                    onChange={() =>
                      setAdvancedSwitch({
                        ...advancedSwitch,
                        idnConversion: advancedSwitch.idnConversion === "int" ? "boolean" : "int",
                      })
                    }
                  />
                  <div className={styles.expectFormField}>
                    {advancedSwitch.idnConversion === "boolean" && (
                      <span className={styles.checkboxInput}>
                        <InputCheckbox
                          disabled={isLoading.sourceForm}
                          name="idn_conversion_bool"
                          label="True"
                          {...{ register, errors }}
                        />
                      </span>
                    )}
                    {advancedSwitch.idnConversion === "int" && (
                      <InputNumber
                        disabled={isLoading.sourceForm}
                        name="idn_conversion_int"
                        {...{ register, errors }}
                      />
                    )}
                  </div>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Http errors")}</FormFieldLabel>
                    <a
                      className={styles.infoButton}
                      onClick={() => {
                        open("https://docs.guzzlephp.org/en/stable/request-options.html#http-errors");
                      }}
                      data-tip={
                        "Set to false to disable throwing exceptions on an HTTP protocol errors (i.e., 4xx and 5xx responses). Exceptions are thrown by default when HTTP protocol errors are encountered."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Set to false to disable throwing exceptions on an HTTP protocol errors (i.e., 4xx and 5xx responses). Exceptions are thrown by default when HTTP protocol errors are encountered."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <InputCheckbox
                    disabled={isLoading.sourceForm}
                    name="https_errors"
                    label="True"
                    {...{ register, errors }}
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

const typeSelectOptions = [
  { label: "JSON", value: "json" },
  { label: "SML", value: "xml" },
  { label: "SOAP", value: "soap" },
  { label: "FTP", value: "ftp" },
  { label: "SFTP", value: "sftp" },
];

const authSelectOptions = [
  { label: "No Auth", value: "none" },
  { label: "API Key", value: "apikey" },
  { label: "JWT", value: "jwt" },
  { label: "Username and Password", value: "username-password" },
];
