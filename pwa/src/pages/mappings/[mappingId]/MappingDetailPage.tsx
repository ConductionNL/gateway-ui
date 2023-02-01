import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { MappingDetailTemplate } from "../../../templates/mappingDetailTemplate/MappingDetailsTemplate";

const MappingDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const mappingId = props.params.mappingId === "new" ? null : props.params.mappingId;

  return (
    <DashboardTemplate>
      {!mappingId && <MappingDetailTemplate />}
      {mappingId && <MappingDetailTemplate {...{ mappingId }} />}
    </DashboardTemplate>
  );
};

export default MappingDetailPage;
