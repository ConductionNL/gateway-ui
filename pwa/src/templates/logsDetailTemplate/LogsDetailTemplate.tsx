import * as React from "react";
import * as styles from "./LogsDetailTemplate.module.css";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import Skeleton from "react-loading-skeleton";
import { monolog } from "../../data/monolog";
import { useApplication } from "../../hooks/application";
import { navigate } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEndpoint } from "../../hooks/endpoint";
import { useSchema } from "../../hooks/schema";
import { useCronjob } from "../../hooks/cronjob";
import { useAction } from "../../hooks/action";
import { useUser } from "../../hooks/user";
import { useOrganization } from "../../hooks/organization";
import clsx from "clsx";
import _ from "lodash";

interface LogsDetailTemplateProps {
  logId: string;
}

export const LogsDetailTemplate: React.FC<LogsDetailTemplateProps> = ({ logId }) => {
  const { t } = useTranslation();
  const log = monolog;

  const queryClient = new QueryClient();

  const _useApplication = useApplication(queryClient);
  const getApplication = _useApplication.getOne(log.context.application);

  const _useEndpoint = useEndpoint(queryClient);
  const getEndpoint = _useEndpoint.getOne(log.context.endpoint);

  const _useSchema = useSchema(queryClient);
  const getSchema = _useSchema.getOne(log.context.schema);

  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(log.context.cronjob);

  const _useAction = useAction(queryClient);
  const getAction = _useAction.getOne(log.context.action);

  const _useUser = useUser(queryClient);
  const getUser = _useUser.getOne(log.context.user);

  const _useOrganization = useOrganization(queryClient);
  const getOrganization = _useOrganization.getOne(log.context.organization);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs detail page")}</Heading1>

      <Alert
        title={log.level_name}
        variant="info"
        text={log.message}
        className={clsx(styles[_.camelCase(`${log.level_name} level`)])}
      ></Alert>

      <div className={styles.contextContainer}>
        <Heading1>Context</Heading1>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader></TableHeader>
              <TableHeader>Name or Id</TableHeader>
              <TableHeader>filterLink</TableHeader>
              <TableHeader>DetailPage</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableHeader>host</TableHeader>
              <TableCell>{log.context.host ?? "-"}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>ip</TableHeader>
              <TableCell>{log.context.ip ?? "-"}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>session</TableHeader>
              <TableCell>{log.context.session !== "" ? log.context.session : "-"}</TableCell>

              <TableCell>
                <Button
                  disabled={!log.context.session}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.session}
                  onClick={() => navigate(`/settings/sessions/${log.context.session}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHeader>process</TableHeader>
              <TableCell>{log.context.process !== "" ? log.context.process : "-"}</TableCell>

              <TableCell>
                <Button
                  disabled={!log.context.process}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.process}
                  onClick={() => navigate(`/settings/processs/${log.context.process}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>endpoint</TableHeader>
              {log.context.endpoint ? (
                getEndpoint.isSuccess && <TableCell>{getEndpoint.data.name ?? log.context.endpoint}</TableCell>
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
                  disabled={!log.context.endpoint}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.endpoint}
                  onClick={() => navigate(`/endpoints/${log.context.endpoint}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>schema</TableHeader>
              {log.context.schema ? (
                getSchema.isSuccess && <TableCell>{getSchema.data.name ?? log.context.schema}</TableCell>
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
                  disabled={!log.context.schema}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.schema}
                  onClick={() => navigate(`/schemas/${log.context.schema}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>cronjob</TableHeader>
              {log.context.cronjob ? (
                getCronjob.isSuccess && <TableCell>{getCronjob.data.name ?? log.context.cronjob}</TableCell>
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
                  disabled={!log.context.cronjob}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.cronjob}
                  onClick={() => navigate(`/cronjobs/${log.context.cronjob}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>action</TableHeader>
              {log.context.action ? (
                getAction.isSuccess && <TableCell>{getAction.data.name ?? log.context.action}</TableCell>
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
                  disabled={!log.context.action}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.action}
                  onClick={() => navigate(`/actions/${log.context.action}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>mapping</TableHeader>
              {log.context.mapping ? <TableCell>{log.context.mapping}</TableCell> : <TableCell>-</TableCell>}

              <TableCell>
                <Button
                  disabled={!log.context.mapping}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.mapping}
                  onClick={() => navigate(`/mappings/${log.context.mapping}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>user</TableHeader>
              {log.context.user ? (
                getUser.isSuccess && <TableCell>{getUser.data.name ?? log.context.user}</TableCell>
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
                  disabled={!log.context.user}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.user}
                  onClick={() => navigate(`/settings/users/${log.context.user}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>organization</TableHeader>
              {log.context.organization ? (
                getOrganization.isSuccess && (
                  <TableCell>{getOrganization.data.name ?? log.context.organization}</TableCell>
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
                  disabled={!log.context.organization}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.organization}
                  onClick={() => navigate(`/settings/organizations/${log.context.organization}`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Details")}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHeader>application</TableHeader>
              {log.context.application ? (
                getApplication.isSuccess && <TableCell>{getApplication.data.name ?? log.context.application}</TableCell>
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
                  disabled={!log.context.application}
                  onClick={() => navigate(`/logs/test`)}
                  className={styles.buttonIcon}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Filters")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={!log.context.application}
                  onClick={() => navigate(`/settings/applications/${log.context.application}`)}
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
        <pre>{JSON.stringify(log.extra, undefined, 2)}</pre>
      </div>
    </Container>
  );
};
