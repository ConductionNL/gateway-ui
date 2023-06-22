import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { CreateTemplateTemplate } from "../../../templates/templateParts/templatesForm/CreateTemplateTemplate";
import { TemplateDetailsTemplate } from "../../../templates/templateDetailTemplate/TemplateDetailsTemplate";

const TemplateDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const templateId = props.params.templateId === "new" ? null : props.params.templateId;

  return (
    <DashboardTemplate>
      {!templateId && <CreateTemplateTemplate />}
      {templateId && <TemplateDetailsTemplate templateId={props.params.templateId} />}
    </DashboardTemplate>
  );
};

export default TemplateDetailPage;
