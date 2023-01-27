import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useSource } from "../../../hooks/source";
import { useQueryClient } from "react-query";
import { InputFloat, InputNumber } from "@conduction/components/lib/components/formFields/input";
import { CreateKeyValue, IKeyValue } from "@conduction/components/lib/components/formFields";
import { ReactTooltip } from "@conduction/components/lib/components/toolTip/ToolTip";
import { SourcesAuthFormTemplate } from "./SourcesAuthFormTemplate";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import ToggleButton from "../../../components/toggleButton/ToggleButton";

interface CreateSourceFormTemplateProps {
  sourceId?: string;
}

export const CreateSourceFormTemplate: React.FC<CreateSourceFormTemplateProps> = ({ sourceId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
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
  const createOrEditSource = _useSources.createOrEdit(sourceId);

  const authSelectOptions = [
    { label: "No Auth", value: "none" },
    { label: "API Key", value: "apikey" },
    { label: "JWT", value: "jwt" },
    { label: "Username and Password", value: "username-password" },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchAuth = watch("auth");
  const watchHeaders = watch("headers");
  const watchQuery = watch("query");

  React.useEffect(() => {
    setLoading(createOrEditSource.isLoading);
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

    createOrEditSource.mutate({ payload, id: sourceId });
  };

  React.useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Source")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>
          </div>
        </section>

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
                      disabled={loading}
                    />
                    {errors["name"] && <ErrorMessage message={errors["name"].message} />}
                  </FormFieldInput>
                </FormField>
              </div>
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Description")}</FormFieldLabel>
                  <Textarea {...{ register, errors }} name="description" disabled={loading} />
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </FormFieldInput>
                </FormField>

                {selectedAuth && <SourcesAuthFormTemplate {...{ selectedAuth, register, errors }} />}
              </div>
            </div>
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            <CreateKeyValue name="query" disabled={loading} defaultValue={query} {...{ register, errors, control }} />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
            <CreateKeyValue
              disabled={loading}
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
                    <InputFloat disabled={loading} {...{ register, errors }} name="connect_timeout" />
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
                  <InputCheckbox name="debug" disabled={loading} label="True" {...{ register, errors }} />
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
                    disabled={loading}
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
                      <Textarea disabled={loading} name="decode_content_str" {...{ register, errors }} />
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
                    disabled={loading}
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
                      <InputNumber disabled={loading} name="delay" {...{ register, errors }} />
                    )}
                    {advancedSwitch.delay === "float" && (
                      <InputFloat disabled={loading} name="delay" {...{ register, errors }} />
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
                    disabled={loading}
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
                      <InputNumber disabled={loading} name="expect_int" {...{ register, errors }} />
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
                    <InputText disabled={loading} {...{ register, errors }} name="force_ip_resolve" />
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
                    disabled={loading}
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
                        <InputCheckbox disabled={loading} name="verify_bool" label="True" {...{ register, errors }} />
                      </span>
                    )}
                    {advancedSwitch.verify === "string" && (
                      <InputText disabled={loading} name="verify_str" {...{ register, errors }} />
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
                    <InputText disabled={loading} {...{ register, errors }} name="version" />
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
                    <InputFloat disabled={loading} {...{ register, errors }} name="read_timeout" />
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
                  <Textarea disabled={loading} {...{ register, errors }} name="proxy" />
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
                    disabled={loading}
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
                          disabled={loading}
                          name="idn_conversion_bool"
                          label="True"
                          {...{ register, errors }}
                        />
                      </span>
                    )}
                    {advancedSwitch.idnConversion === "int" && (
                      <InputNumber disabled={loading} name="idn_conversion_int" {...{ register, errors }} />
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
                  <InputCheckbox disabled={loading} name="https_errors" label="True" {...{ register, errors }} />
                </FormField>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </form>

      <ReactTooltip className={styles.tooltip} />
    </div>
  );
};
