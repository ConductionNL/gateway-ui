import { navigate } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SettingsTemplate } from "../../../templates/settings/SettingsTemplate";

const Index: React.FC = () => {
  navigate("/settings");

  return (
    <DashboardTemplate>
      <SettingsTemplate />
    </DashboardTemplate>
  );
};

export default Index;
