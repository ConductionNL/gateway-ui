import * as React from "react";
import * as styles from "./LogsDetailTemplate.module.css";
import { Alert, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import Skeleton from "react-loading-skeleton";
import { useApplication } from "../../hooks/application";
import { navigate } from "gatsby";
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
import { useLogFiltersContext } from "../../context/logs";
import { Button } from "../../components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMapping } from "../../hooks/mapping";
import { useObject } from "../../hooks/object";

interface LogsDetailTemplateProps {
  logId: string;
}

export const LogsDetailTemplate: React.FC<LogsDetailTemplateProps> = ({ logId }) => {
  const { t } = useTranslation();
  const { setLogFilters } = useLogFiltersContext();

  const queryClient = useQueryClient();

  const getLog = useLog(queryClient).getOne(logId);
  const getApplication = useApplication(queryClient).getOne(getLog.data?.context?.application);
  const getEndpoint = useEndpoint(queryClient).getOne(getLog.data?.context?.endpoint);
  const getSchema = useSchema(queryClient).getOne(getLog.data?.context?.schema);
  const getCronjob = useCronjob(queryClient).getOne(getLog.data?.context?.cronjob);
  const getAction = useAction(queryClient).getOne(getLog.data?.context?.action);
  const getUser = useUser(queryClient).getOne(getLog.data?.context?.user);
  const getOrganization = useOrganization(queryClient).getOne(getLog.data?.context?.organization);
  const getMapping = useMapping(queryClient).getOne(getLog.data?.context?.mapping);
  const getObject = useObject().getOne(getLog.data?.context?.object);

  const handleSetContextFilter = (
    context:
      | "session"
      | "process"
      | "endpoint"
      | "schema"
      | "cronjob"
      | "action"
      | "user"
      | "organization"
      | "application"
      | "mapping"
      | "object",
    value: string,
  ) => {
    setLogFilters({
      context: { [context]: value },
      "_order[datetime]": "asc",
      "datetime[before]": "",
      "datetime[after]": "",
    });

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
                  <TableHeader>Filter on context</TableHeader>
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

                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getLog.data.context?.session}
                      onClick={() => handleSetContextFilter("session", getLog.data.context?.session)}
                    />
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>

                <TableRow>
                  <TableHeader>Process</TableHeader>
                  <TableCell>{getLog.data.context?.process !== "" ? getLog.data.context?.process : "-"}</TableCell>

                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getLog.data.context?.process}
                      onClick={() => handleSetContextFilter("process", getLog.data.context?.process)}
                    />
                  </TableCell>
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getEndpoint.data?.id}
                      onClick={() => handleSetContextFilter("endpoint", getEndpoint.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.endpoint}
                      onClick={() => navigate(`/endpoints/${getLog.data.context?.endpoint}`)}
                    />
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getEndpoint.data?.id}
                      onClick={() => handleSetContextFilter("schema", getEndpoint.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.schema}
                      onClick={() => navigate(`/schemas/${getLog.data.context?.schema}`)}
                    />
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getCronjob.data?.id}
                      onClick={() => handleSetContextFilter("cronjob", getCronjob.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.cronjob}
                      onClick={() => navigate(`/cronjobs/${getLog.data.context?.cronjob}`)}
                    />
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getAction.data?.id}
                      onClick={() => handleSetContextFilter("action", getAction.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.action}
                      onClick={() => navigate(`/actions/${getLog.data.context?.action}`)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Mapping</TableHeader>
                  {getLog.data.context?.mapping ? (
                    getMapping.isSuccess && (
                      <TableCell>{getMapping.data.name ?? getLog.data.context?.mapping}</TableCell>
                    )
                  ) : (
                    <TableCell>-</TableCell>
                  )}

                  {getMapping.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getMapping.data?.id}
                      onClick={() => handleSetContextFilter("mapping", getMapping.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.mapping}
                      onClick={() => navigate(`/mappings/${getLog.data.context?.mapping}`)}
                    />
                  </TableCell>
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getUser.data?.id}
                      onClick={() => handleSetContextFilter("user", getUser.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.user}
                      onClick={() => navigate(`/settings/users/${getLog.data.context?.user}`)}
                    />
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getOrganization.data?.id}
                      onClick={() => handleSetContextFilter("organization", getOrganization.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.organization}
                      onClick={() => navigate(`/settings/organizations/${getLog.data.context?.organization}`)}
                    />
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
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getApplication.data?.id}
                      onClick={() => handleSetContextFilter("application", getApplication.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.application}
                      onClick={() => navigate(`/settings/applications/${getLog.data.context?.application}`)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHeader>Object</TableHeader>
                  {getLog.data.context?.object ? (
                    getObject.isSuccess && (
                      <TableCell>{getObject.data.titel ?? getLog.data.context?.object}</TableCell>
                    )
                  ) : (
                    <TableCell>-</TableCell>
                  )}
                  {getObject.isLoading && (
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Set filter")}
                      icon={faFilter}
                      disabled={!getObject.data?.id}
                      onClick={() => handleSetContextFilter("object", getObject.data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Details")}
                      icon={faArrowRight}
                      disabled={!getLog.data.context?.object}
                      onClick={() => navigate(`/objects/${getLog.data.context?.object}`)}
                    />
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
