import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { CronjobsDetailTemplate } from "../../../templates/cronjobsDetailTemplate/CronjobsDetailsTemplate";
import { CreateCronjobTemplate } from "../../../templates/templateParts/cronjobsForm/CreateCronjobTemplate";

const CronjobDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const cronjobId = props.params.cronjobId === "new" ? null : props.params.cronjobId;

  return (
    <DashboardTemplate>
      {!cronjobId && <CreateCronjobTemplate />}
      {cronjobId && <CronjobsDetailTemplate cronjobId={props.params.cronjobId} />}
    </DashboardTemplate>
  );
};

export default CronjobDetailPage;
