import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../../hooks/user";
import { UserFormTemplate } from "./UserFormTemplate";
import { useOrganization } from "../../../hooks/organization";
import { Heading1 } from "@gemeente-denhaag/typography";
import Button from "@gemeente-denhaag/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useTranslation } from "react-i18next";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { TabsContext } from "../../../context/tabs";
import { Container } from "@conduction/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { navigate } from "gatsby";

interface EditUserFormTemplateProps {
  userId: string;
}

export const EditUserFormTemplate: React.FC<EditUserFormTemplateProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);

  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const getUser = _useUsers.getOne(userId);

  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getAll();

  const dashboardCard = getDashboardCard(getUser.data?.id);

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(getUser.data.name, "user", "User", getUser.data.id, dashboardCard?.id);
  };

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{getUser.data?.id ? `Edit ${getUser.data.name}` : "Edit User"}</Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" form="UserForm">
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>

          <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
            <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
            {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
          </Button>
        </div>
      </section>

      {getUser.isSuccess && <UserFormTemplate user={getUser.data} {...{ getOrganization }} />}

      {getUser.isSuccess && (
        <div className={styles.tabContainer}>
          <TabContext value={currentTab.userDetailTabs.toString()}>
            <Tabs
              value={currentTab.userDetailTabs}
              onChange={(_, newValue: number) => {
                setCurrentTab({ ...currentTab, userDetailTabs: newValue });
              }}
              variant="scrollable"
            >
              <Tab className={styles.tab} label={t("Security Groups")} value={0} />
              <Tab className={styles.tab} label={t("Scopes")} value={1} />
              <Tab className={styles.tab} label={t("Logs")} value={2} />
            </Tabs>

            <TabPanel className={styles.tabPanel} value="0">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>{t("Name")}</TableHeader>
                    <TableHeader>{t("Description")}</TableHeader>
                    <TableHeader>{t("Config")}</TableHeader>
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getUser.data.securityGroups &&
                    getUser.data.securityGroups.map((userGroup: any) => (
                      <TableRow
                        className={styles.tableRow}
                        onClick={() => navigate(`/settings/securitygroups/${userGroup.id}`)}
                        key={userGroup.id}
                      >
                        <TableCell>{userGroup.name}</TableCell>
                        <TableCell>{userGroup.description ?? "-"}</TableCell>
                        <TableCell>{userGroup.config ?? "-"}</TableCell>
                        <TableCell onClick={() => navigate(`/settings/securitygroups/${userGroup.id}`)}>
                          <Link icon={<ArrowRightIcon />} iconAlign="start">
                            {t("Details")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!getUser.data.securityGroups?.length && (
                    <TableRow>
                      <TableCell>{t("No securityGroups found")}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getUser.data.scopes &&
                    getUser.data.scopes.map((scope: any) => (
                      <TableRow className={styles.tableRow} key={scope.id}>
                        <TableCell>{scope.name}</TableCell>
                      </TableRow>
                    ))}
                  {!getUser.data.scopes?.length && (
                    <TableRow>
                      <TableCell>{t("No scopes found")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabPanel>
            <TabPanel className={styles.tabPanel} value="2">
              Logs are not yet supported.
            </TabPanel>
          </TabContext>
        </div>
      )}

      {getUser.isLoading && <Skeleton height={200} />}
    </Container>
  );
};
