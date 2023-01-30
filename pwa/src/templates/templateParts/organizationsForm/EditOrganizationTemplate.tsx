import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { OrganizationForm } from "./OrganizationForm";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import Skeleton from "react-loading-skeleton";
import { Button, Heading1, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useTranslation } from "react-i18next";
import { TabsContext } from "../../../context/tabs";
import { navigate } from "gatsby";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { translateDate } from "../../../services/dateFormat";
import clsx from "clsx";

interface CreateOrganizationTemplateProps {
  organizationId: string;
}

export const EditOrganizationTemplate: React.FC<CreateOrganizationTemplateProps> = ({ organizationId }) => {
  const { t, i18n } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getOne(organizationId);

  const dashboardCard = getDashboardCard(organizationId);

  React.useEffect(() => {
    setLoading(dashboardLoading);
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

  return (
    <Container layoutClassName={styles.container}>
      {getOrganization.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>
              {getOrganization.data?.id ? `Edit ${getOrganization.data.name}` : "Create Organization"}
            </Heading1>

            <div className={styles.buttons}>
              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                type="submit"
                form="OrganisationForm"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button className={styles.buttonIcon} onClick={toggleFromDashboard} disabled={loading}>
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>
            </div>
          </section>

          <OrganizationForm organization={getOrganization.data} />

          <div className={styles.tabContainer}>
            <TabContext value={currentTab.organizationDetailTabs.toString()}>
              <Tabs
                value={currentTab.organizationDetailTabs}
                onChange={(_, newValue: number) => {
                  setCurrentTab({ ...currentTab, organizationDetailTabs: newValue });
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
                          className={styles.tableRow}
                          onClick={() => navigate(`/settings/applications/${application.id}`)}
                          key={application.id}
                        >
                          <TableCell>{application.name}</TableCell>
                          <TableCell>{application.description ?? "-"}</TableCell>
                          <TableCell>{translateDate(i18n.language, application.dateCreated)}</TableCell>
                          <TableCell>{translateDate(i18n.language, application.dateModified)}</TableCell>
                          <TableCell onClick={() => navigate(`/settings/applications/${application.id}`)}>
                            <Link icon={<ArrowRightIcon />} iconAlign="start">
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
                      <TableRow
                        className={styles.tableRow}
                        onClick={() => navigate(`/settings/users/${user.id}`)}
                        key={user.id}
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.securityGroups?.length ?? "-"}</TableCell>
                        <TableCell>{translateDate(i18n.language, user.dateCreated) ?? "-"}</TableCell>
                        <TableCell>{translateDate(i18n.language, user.dateModified) ?? "-"}</TableCell>
                        <TableCell onClick={() => navigate(`/settings/users/${user.id}`)}>
                          <Link icon={<ArrowRightIcon />} iconAlign="start">
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
              <TabPanel className={styles.tabPanel} value="2   ">
                Logs are not yet supported.
              </TabPanel>
            </TabContext>
          </div>
        </>
      )}

      {getOrganization.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};
