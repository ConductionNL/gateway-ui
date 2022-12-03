import * as React from "react";
import * as styles from "./ObjectDetailTemplate.module.css";
import {
  Button,
  FormField,
  FormFieldInput,
  FormFieldLabel,
  Tab,
  TabContext,
  TabPanel,
  Tabs,
} from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container, InputText, Textarea } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditObjectFormTemplate } from "../templateParts/objectsFormTemplate/EditObjectFormTemplate";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "../../components/errorMessage/ErrorMessage";
import { validateStringAsJSON } from "../../services/validateJSON";
import { useForm } from "react-hook-form";

interface ObjectDetailTemplateProps {
  objectId: string;
}

export const ObjectDetailTemplate: React.FC<ObjectDetailTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getOne(objectId);

  const getObjectSchema = _useObject.getSchema(objectId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      body: data.body ? JSON.parse(data.body) : [],
    };

    // const proxyTest = _testProxy.mutate({ id: sourceId, payload: payload });
  };

  return (
    <Container layoutClassName={styles.container}>
      {getObject.isError && "Error..."}

      {getObject.isSuccess && <EditObjectFormTemplate object={getObject.data} {...{ objectId }} />}

      {getObject.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Logs")} value={0} />
            <Tab className={styles.tab} label={t("sync")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && <span>Logs</span>}
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="1">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && (
              <Button
                className={clsx(styles.buttonIcon, styles.testConnectionButton)}
                // disabled={isLoading.alert}
                type="submit"
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
                {t("Test connection")}
              </Button>
            )}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};
