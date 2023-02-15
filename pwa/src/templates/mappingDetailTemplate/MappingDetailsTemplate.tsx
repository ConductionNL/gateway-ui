import * as React from "react";
import * as styles from "./MappingDetailsTemplate.module.css";
import { Container, Textarea } from "@conduction/components";
import { MappingFormTemplate, formId } from "../templateParts/mappingForm/MappingFormTemplate";
import { useMapping } from "../../hooks/mapping";
import { useQueryClient } from "react-query";
import { useIsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import Skeleton from "react-loading-skeleton";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useCurrentTabContext } from "../../context/tabs";
import { useTranslation } from "react-i18next";
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
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "../../components/errorMessage/ErrorMessage";
import { validateStringAsJSON } from "../../services/validateJSON";

interface MappingDetailsTemplateProps {
  mappingId: string;
}

export const MappingDetailTemplate: React.FC<MappingDetailsTemplateProps> = ({ mappingId }) => {
  const { t } = useTranslation();

  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = useQueryClient();
  const getMapping = useMapping(queryClient).getOne(mappingId);
  const deleteMapping = useMapping(queryClient).remove();
  const testSimpleMapping = useMapping(queryClient).testSimpleMapping(mappingId);

  const dashboardCard = getDashboardCard(mappingId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleFromDashboard = () => {
    toggleDashboardCard(getMapping.data.name, "mapping", "Mapping", mappingId, dashboardCard?.id);
  };

  const handleDelete = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this mapping?");

    confirmDeletion && deleteMapping.mutate({ id: mappingId });
  };

  const onSubmitTest = (data: any) => {
    const jsonData = data.input ? JSON.parse(data.input) : [];

    const payload = {
      ...jsonData,
    };

    testSimpleMapping.mutate({ payload: payload, id: mappingId });
  };

  React.useEffect(() => {
    setIsLoading({
      ...isLoading,
      mappingForm: deleteMapping.isLoading || testSimpleMapping.isLoading || dashboardLoading,
    });
  }, [deleteMapping.isLoading, testSimpleMapping.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getMapping.isLoading && <Skeleton height="200px" />}
      {getMapping.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getMapping.data.name}`}
            {...{ formId }}
            disabled={isLoading.mappingForm}
            handleDelete={handleDelete}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          />

          <div className={styles.tabContainer}>
            <TabContext value={currentTabs.mappingDetailTabs.toString()}>
              <Tabs
                value={currentTabs.mappingDetailTabs}
                onChange={(_, newValue: number) => {
                  setCurrentTabs({ ...currentTabs, mappingDetailTabs: newValue });
                }}
                variant="scrollable"
              >
                <Tab className={styles.tab} label={t("General")} value={0} />
                <Tab className={styles.tab} label={t("Test Mappings")} value={1} />
              </Tabs>

              <TabPanel className={styles.tabPanel} value="0">
                <MappingFormTemplate mapping={getMapping.data} />
              </TabPanel>

              <TabPanel className={styles.tabPanel} value="1">
                <form onSubmit={handleSubmit(onSubmitTest)}>
                  <Button
                    className={clsx(styles.buttonIcon, styles.testConnectionButton)}
                    disabled={isLoading.mappingForm}
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faArrowsRotate} />
                    {t("Test simple mapping")}
                  </Button>

                  <div className={styles.content}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Input")}</FormFieldLabel>
                        <Textarea
                          {...{ register, errors }}
                          name="input"
                          validation={{ validate: validateStringAsJSON }}
                          disabled={isLoading.mappingForm}
                        />
                        {errors["input"] && <ErrorMessage message={errors["input"].message} />}
                      </FormFieldInput>
                    </FormField>
                    <FormField>
                      <FormFieldLabel>{t("Output")}</FormFieldLabel>
                      <pre>{JSON.stringify(testSimpleMapping.data, null, 2)}</pre>
                    </FormField>
                  </div>
                </form>
              </TabPanel>
            </TabContext>
          </div>
        </>
      )}
    </Container>
  );
};
