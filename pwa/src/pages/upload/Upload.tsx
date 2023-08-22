import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { UploadTemplate } from "../../templates/uploadTemplate/UploadTemplate";

const UploadPage: React.FC = () => (
  <DashboardTemplate>
    <UploadTemplate />
  </DashboardTemplate>
);

export default UploadPage;
