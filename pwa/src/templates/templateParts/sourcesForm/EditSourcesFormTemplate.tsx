import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1, Switch, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputNumber, InputText, SelectSingle, Tag, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faFloppyDisk,
  faInfoCircle,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useSource } from "../../../hooks/source";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { translateDate } from "../../../services/dateFormat";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { ReactTooltip } from "@conduction/components/lib/components/toolTip/ToolTip";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import { InputFloat } from "@conduction/components/lib/components/formFields/input";
import { SourcesAuthFormTemplate } from "./SourcesAuthFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";
import { getStatusColor, getStatusIcon } from "../../../services/getStatusColorAndIcon";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";

interface SourcesFormTemplateProps {
  source: any;
  sourceId: string;
}

export const SourcesFormTemplate: React.FC<SourcesFormTemplateProps> = ({ source, sourceId }) => {
  const { t, i18n } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [selectedAuth, setSelectedAuth] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
  const [headers, setHeaders] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useSources = useSource(queryClient);
  const createOrEditSource = _useSources.createOrEdit(sourceId);
  const deleteSource = _useSources.remove();

  const dashboardCard = getDashboardCard(source.name);

  const typeSelectOptions = [
    { label: "JSON", value: "json" },
    { label: "SML", value: "xml" },
    { label: "SOAP", value: "soap" },
    { label: "FTP", value: "ftp" },
    { label: "SFTP", value: "sftp" },
  ];

  const authSelectOptions = [
    { label: "API Key", value: "apikey" },
    { label: "JWT", value: "jwt" },
    { label: "Username and Password", value: "username-password" },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const watchAuth = watch("auth");
  const watchHeaders = watch("headers");
  const watchQuery = watch("query");

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
        decode_content: data.decode_content,
        delay: data.delay,
        expect: data.expect,
        force_ip_resolve: data.force_ip_resolve,
        verify: data.verify,
        version: data.version,
        read_timeout: data.read_timeout,
        proxy: data.proxy,
        idn_conversion: data.idn_conversion,
        https_errors: data.https_errors,
      },
    };

    createOrEditSource.mutate({ payload, id: sourceId });
    queryClient.setQueryData(["sources", sourceId], payload);
  };

  const handleDelete = (id: string): void => {
    deleteSource.mutateAsync({ id: id });
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(source.name, "Source", "Gateway", sourceId, dashboardCard?.id);
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
      }
    }

    setHeaders(source.headers);
    setQuery(source.query);
  };

  React.useEffect(() => {
    handleSetFormValues(source);
  }, []);

  React.useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Source")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button
              className={styles.buttonIcon}
              onClick={addOrRemoveFromDashboard}
              disabled={isLoading.addDashboardCard}
            >
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.deleteButton)} onClick={() => handleDelete(source.id)}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
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
                <FormField>
                  <FormFieldLabel>{t("Status")}</FormFieldLabel>
                  <div className={clsx(styles[getStatusColor(source.status ?? "no known status")])}>
                    <Tag
                      icon={<FontAwesomeIcon icon={getStatusIcon(source.status ?? "no known status")} />}
                      label={source.status?.toString() ?? "no known status"}
                    />
                  </div>
                </FormField>
                <FormField>
                  <FormFieldInput className={styles.flex}>
                    <FormFieldLabel>{t("Created")}</FormFieldLabel>
                    <Tag label={translateDate(i18n.language, source.dateCreated) ?? "-"} />
                  </FormFieldInput>
                </FormField>
                <FormField>
                  <FormFieldInput className={styles.flex}>
                    <FormFieldLabel>{t("Modified")}</FormFieldLabel>
                    <Tag label={translateDate(i18n.language, source.dateModified) ?? "-"} />
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
                    {/* @ts-ignore */}
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
            {/* @ts-ignore */}
            <CreateKeyValue name="query" defaultValue={query} {...{ register, errors, control }} />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
            {/* @ts-ignore */}
            <CreateKeyValue name="headers" defaultValue={headers} {...{ register, errors, control }} />
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
                    <InputFloat {...{ register, errors }} name="connect_timeout" disabled={loading} />
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
                  <InputCheckbox name="debug" label="True" {...{ register, errors }} />
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
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="decode_content" label="True" {...{ register, errors }} />
                    <InputNumber name="decode_content" {...{ register, errors }} />
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
                  <div className={styles.expectFormField}>
                    <InputNumber name="delay" {...{ register, errors }} />
                    <InputFloat name="delay" {...{ register, errors }} />
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
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="expect" label="True" {...{ register, errors }} />
                    <InputNumber name="expect" {...{ register, errors }} />
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
                    <InputText {...{ register, errors }} name="force_ip_resolve" />
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
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="verify" label="True" {...{ register, errors }} />
                    <InputText name="verify" {...{ register, errors }} />
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
                    <InputText {...{ register, errors }} name="version" />
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
                    <InputFloat {...{ register, errors }} name="read_timeout" />
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
                  <Textarea {...{ register, errors }} name="proxy" />
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
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="idn_conversion" label="True" {...{ register, errors }} />
                    <InputNumber name="idn_conversion" {...{ register, errors }} />
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
                  <InputCheckbox name="https_errors" label="True" {...{ register, errors }} />
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
