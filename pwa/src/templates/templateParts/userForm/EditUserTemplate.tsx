import * as React from "react";
import * as styles from "./EditUserTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../../hooks/user";
import { UserFormTemplate, formId } from "./UserFormTemplate";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useTranslation } from "react-i18next";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { TabsContext } from "../../../context/tabs";
import { Container } from "@conduction/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { navigate } from "gatsby";
import { IsLoadingContext } from "../../../context/isLoading";
import { useLog } from "../../../hooks/log";
import { LogsTableTemplate } from "../logsTable/LogsTableTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

interface EditUserTemplateProps {
  userId: string;
}

export const EditUserTemplate: React.FC<EditUserTemplateProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const getUser = _useUsers.getOne(userId);
  const deleteUser = _useUsers.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("user", userId, currentLogsPage);

  const dashboardCard = getDashboardCard(getUser.data?.id);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getUser.data.name, "user", "User", getUser.data.id, dashboardCard?.id);
  };

  const handleDeleteUser = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this user?");

    confirmDeletion && deleteUser.mutate({ id: userId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, userForm: dashboardLoading || deleteUser.isLoading });
  }, [deleteUser.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      <FormHeaderTemplate
        title={getUser.data?.id ? `Edit ${getUser.data.name}` : "Edit User"}
        {...{ formId }}
        disabled={isLoading.userForm}
        handleDelete={handleDeleteUser}
        handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
      />

      {getUser.isSuccess && <UserFormTemplate user={getUser.data} />}

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
              {getLogs.isLoading && <Skeleton height="200px" />}

              {getLogs.isSuccess && (
                <LogsTableTemplate
                  logs={getLogs.data.results}
                  pagination={{
                    totalPages: getLogs.data.pages,
                    currentPage: currentLogsPage,
                    changePage: setCurrentLogsPage,
                  }}
                />
              )}
            </TabPanel>
          </TabContext>
        </div>
      )}

      {getUser.isLoading && <Skeleton height={200} />}
    </Container>
  );
};
