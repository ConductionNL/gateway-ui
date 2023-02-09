import * as React from "react";
import * as styles from "./LogsDetailTemplate.module.css";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import Skeleton from "react-loading-skeleton";
import { useApplication } from "../../hooks/application";
import { navigate } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFilter, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useEndpoint } from "../../hooks/endpoint";
import { useSchema } from "../../hooks/schema";
import { useCronjob } from "../../hooks/cronjob";
import { useAction } from "../../hooks/action";
import { useUser } from "../../hooks/user";
import { useOrganization } from "../../hooks/organization";
import clsx from "clsx";
import _ from "lodash";
import { useLog } from "../../hooks/log";
import { LogFiltersContext } from "../../context/logs";

interface LogsDetailTemplateProps {
  logId: string;
}

export const LogsDetailTemplate: React.FC<LogsDetailTemplateProps> = ({ logId }) => {
  const { t } = useTranslation();
  const [__, setLogFilters] = React.useContext(LogFiltersContext);

  const queryClient = new QueryClient();

  const getLog = useLog(queryClient).getOne(logId);
  const getApplication = useApplication(queryClient).getOne(getLog.data?.context?.application);
  const getEndpoint = useEndpoint(queryClient).getOne(getLog.data?.context?.endpoint);
  const getSchema = useSchema(queryClient).getOne(getLog.data?.context?.schema);
  const getCronjob = useCronjob(queryClient).getOne(getLog.data?.context?.cronjob);
  const getAction = useAction(queryClient).getOne(getLog.data?.context?.action);
  const getUser = useUser(queryClient).getOne(getLog.data?.context?.user);
  const getOrganization = useOrganization(queryClient).getOne(getLog.data?.context?.organization);

  const handleSetChannelFilter = (
    channel: "endpoint" | "schema" | "cronjob" | "action" | "user" | "organization" | "application",
    value: string,
  ) => {
    setLogFilters({ context: { [channel]: value } });

    navigate("/logs");
  };

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs detail page")}</Heading1>

      {getLog.isLoading && <Skeleton height="200px" />}
      {getLog.isError && <>Something went wrong...</>}

      {getLog.isSuccess && (
        <>
          <Alert
            title={getLog.data.level_name}
            variant="info"
            text={getLog.data.message}
            className={clsx(styles[_.camelCase(`${getLog.data.level_name} level`)])}
            supportIcon={<FontAwesomeIcon icon={faInfoCircle} />}
          ></Alert>

          <div className={styles.contextContainer}>
            <Heading1>Context</Heading1>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader></TableHeader>
                  <TableHeader>Name or id</TableHeader>
                  <TableHeader>Filter on channel</TableHeader>
                  <TableHeader>Details</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableHeader>Host</TableHeader>
                  <TableCell>{getLog.data.context?.host !== "" ? getLog.data.context?.host : "-"}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>IP</TableHeader>
                  <TableCell>{getLog.data.context?.ip !== "" ? getLog.data.context?.ip : "-"}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Session</TableHeader>
                  <TableCell>{getLog.data.context?.session !== "" ? getLog.data.context?.session : "-"}</TableCell>

                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>

                <TableRow>
                  <TableHeader>Process</TableHeader>
                  <TableCell>{getLog.data.context?.process !== "" ? getLog.data.context?.process : "-"}</TableCell>

                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Endpoint</TableHeader>
                  {getLog.data.context?.endpoint ? (
                    getEndpoint.isSuccess && (
                      <TableCell>{getEndpoint.data.name ?? getLog.data.context?.endpoint}</TableCell>
                    )
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getEndpoint.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getEndpoint.data?.id}
                      onClick={() => handleSetChannelFilter("endpoint", getEndpoint.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.endpoint}
                      onClick={() => navigate(`/endpoints/${getLog.data.context?.endpoint}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Schema</TableHeader>
                  {getLog.data.context?.schema ? (
                    getSchema.isSuccess && <TableCell>{getSchema.data.name ?? getLog.data.context?.schema}</TableCell>
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getSchema.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getEndpoint.data?.id}
                      onClick={() => handleSetChannelFilter("schema", getEndpoint.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.schema}
                      onClick={() => navigate(`/schemas/${getLog.data.context?.schema}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Cronjob</TableHeader>
                  {getLog.data.context?.cronjob ? (
                    getCronjob.isSuccess && (
                      <TableCell>{getCronjob.data.name ?? getLog.data.context?.cronjob}</TableCell>
                    )
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getCronjob.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getCronjob.data?.id}
                      onClick={() => handleSetChannelFilter("cronjob", getCronjob.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.cronjob}
                      onClick={() => navigate(`/cronjobs/${getLog.data.context?.cronjob}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Action</TableHeader>
                  {getLog.data.context?.action ? (
                    getAction.isSuccess && <TableCell>{getAction.data.name ?? getLog.data.context?.action}</TableCell>
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getAction.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getAction.data?.id}
                      onClick={() => handleSetChannelFilter("action", getAction.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.action}
                      onClick={() => navigate(`/actions/${getLog.data.context?.action}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Mapping</TableHeader>
                  {getLog.data.context?.mapping ? (
                    <TableCell>{getLog.data.context?.mapping}</TableCell>
                  ) : (
                    <TableCell>-</TableCell>
                  )}

                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>User</TableHeader>
                  {getLog.data.context?.user ? (
                    getUser.isSuccess && <TableCell>{getUser.data.name ?? getLog.data.context?.user}</TableCell>
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getUser.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getUser.data?.id}
                      onClick={() => handleSetChannelFilter("user", getUser.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.user}
                      onClick={() => navigate(`/settings/users/${getLog.data.context?.user}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Organization</TableHeader>
                  {getLog.data.context?.organization ? (
                    getOrganization.isSuccess && (
                      <TableCell>{getOrganization.data.name ?? getLog.data.context?.organization}</TableCell>
                    )
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getOrganization.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getOrganization.data?.id}
                      onClick={() => handleSetChannelFilter("organization", getOrganization.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.organization}
                      onClick={() => navigate(`/settings/organizations/${getLog.data.context?.organization}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Application</TableHeader>
                  {getLog.data.context?.application ? (
                    getApplication.isSuccess && (
                      <TableCell>{getApplication.data.name ?? getLog.data.context?.application}</TableCell>
                    )
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getApplication.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      disabled={!getApplication.data?.id}
                      onClick={() => handleSetChannelFilter("application", getApplication.data.id)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                      {t("Set filter")}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={!getLog.data.context?.application}
                      onClick={() => navigate(`/settings/applications/${getLog.data.context?.application}`)}
                      className={styles.buttonIcon}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Details")}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className={styles.extraContainer}>
            <Heading1>Extra</Heading1>
            <pre>{JSON.stringify(getLog.data.extra, undefined, 2)}</pre>
          </div>
        </>
      )}
    </Container>
  );
};
