import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { OrganizationForm, formId } from "./OrganizationForm";
import { useQueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import Skeleton from "react-loading-skeleton";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useTranslation } from "react-i18next";
import { useCurrentTabContext } from "../../../context/tabs";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { translateDate } from "../../../services/dateFormat";
import { useLog } from "../../../hooks/log";
import { LogsTableTemplate } from "../logsTable/LogsTableTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CHANNEL_LOG_LIMIT } from "../../../apiService/resources/log";

interface CreateOrganizationTemplateProps {
  organizationId: string;
}

export const EditOrganizationTemplate: React.FC<CreateOrganizationTemplateProps> = ({ organizationId }) => {
  const { t, i18n } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const { currentTabs, setCurrentTabs } = useCurrentTabContext();

  const queryClient = useQueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getOne(organizationId);
  const deleteOrganization = _useOrganizations.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("organization", organizationId, currentLogsPage);

  const dashboardCard = getDashboardCard(organizationId);

  React.useEffect(() => {
    setIsLoading({ organizationForm: dashboardLoading });
  }, [dashboardLoading]);

  const toggleFromDashboard = () => {
    toggleDashboardCard(
      getOrganization.data.name,
      "organization",
      "Organization",
      getOrganization.data.id,
      dashboardCard?.id,
    );
  };

  const handleDeleteOrganization = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this organization?");

    confirmDeletion && deleteOrganization.mutate({ id: organizationId });
  };

  return (
    <Container layoutClassName={styles.container}>
      {getOrganization.isSuccess && (
        <>
          <FormHeaderTemplate
            title={getOrganization.data?.id ? `Edit ${getOrganization.data.name}` : "Create Organization"}
            {...{ formId }}
            disabled={isLoading.organizationForm}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
            handleDelete={handleDeleteOrganization}

          />

          <OrganizationForm organization={getOrganization.data} />

          <div className={styles.tabContainer}>
            <TabContext value={currentTabs.organizationDetailTabs.toString()}>
              <Tabs
                value={currentTabs.organizationDetailTabs}
                onChange={(_, newValue: number) => {
                  setCurrentTabs({ ...currentTabs, organizationDetailTabs: newValue });
                }}
                variant="scrollable"
              >
                <Tab className={styles.tab} label={t("Applications")} value={0} />

                <Tab className={styles.tab} label={t("Users")} value={1} />

                <Tab className={styles.tab} label={t("Logs")} value={2} />
              </Tabs>

              <TabPanel className={styles.tabPanel} value="0">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>{t("Name")}</TableHeader>
                      <TableHeader>{t("Description")}</TableHeader>
                      <TableHeader>{t("DateCreated")}</TableHeader>
                      <TableHeader>{t("DateModified")}</TableHeader>
                      <TableHeader></TableHeader>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {getOrganization.data.applications &&
                      getOrganization.data.applications.map((application: any) => (
                        <TableRow
                          onClick={() => navigate(`/settings/applications/${application.id}`)}
                          key={application.id}
                        >
                          <TableCell>{application.name}</TableCell>
                          <TableCell>{application.description ?? "-"}</TableCell>
                          <TableCell>{translateDate(i18n.language, application.dateCreated)}</TableCell>
                          <TableCell>{translateDate(i18n.language, application.dateModified)}</TableCell>
                          <TableCell onClick={() => navigate(`/settings/applications/${application.id}`)}>
                            <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                              {t("Details")}
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}

                    {!getOrganization.data.applications.length && (
                      <TableRow>
                        <TableCell>{t("No applications found")}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabPanel>

              <TabPanel className={styles.tabPanel} value="1">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>{t("Name")}</TableHeader>
                      <TableHeader>{t("User groups")}</TableHeader>
                      <TableHeader>{t("Date created")}</TableHeader>
                      <TableHeader>{t("Date modified")}</TableHeader>
                      <TableHeader></TableHeader>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {getOrganization.data.users.map((user: any) => (
                      <TableRow onClick={() => navigate(`/settings/users/${user.id}`)} key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.securityGroups?.length ?? "-"}</TableCell>
                        <TableCell>{translateDate(i18n.language, user.dateCreated) ?? "-"}</TableCell>
                        <TableCell>{translateDate(i18n.language, user.dateModified) ?? "-"}</TableCell>
                        <TableCell onClick={() => navigate(`/settings/users/${user.id}`)}>
                          <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                            {t("Details")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}

                    {!getOrganization.data.users.length && (
                      <TableRow>
                        <TableCell>No users found</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabPanel>

              <TabPanel className={styles.tabPanel} value="2">
                {getLogs.isLoading && <Skeleton height="200px" />}

                {getLogs.isSuccess && (
                  <LogsTableTemplate
                    logs={getLogs.data.results}
                    pagination={{
                      data: {
                        count: getLogs.data.results.length,
                        offset: CHANNEL_LOG_LIMIT * (currentLogsPage - 1),
                        pages: getLogs.data.pages,
                        total: getLogs.data.total,
                      },
                      currentPage: currentLogsPage,
                      setCurrentPage: setCurrentLogsPage,
                    }}
                  />
                )}
              </TabPanel>
            </TabContext>
          </div>
        </>
      )}

      {getOrganization.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};
