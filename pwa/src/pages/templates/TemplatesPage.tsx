import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { TemplatesTemplate } from "../../templates/templatesTemplate/TemplatesTemplate";

const TemplatesPage: React.FC = () => (
  <DashboardTemplate>
    <TemplatesTemplate />
  </DashboardTemplate>
);

export default TemplatesPage;
