import * as React from "react";
import { DashboardTemplate } from "../templates/dashboard/DashboardTemplate";
import { SettingsTemplate } from "../templates/settings/SettingsTemplate";

const SettingsPage: React.FC = () => (
  <DashboardTemplate>
    <SettingsTemplate />
  </DashboardTemplate>
);

export default SettingsPage;
