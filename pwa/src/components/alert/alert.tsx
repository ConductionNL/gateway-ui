import * as React from "react";
import { AlertContext } from "../../context/alert";
import { Alert } from "@gemeente-denhaag/components-react";

const AlertComponent = () => {
  const [alert, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    alert.type === "success" && setTimeout(() => setAlert({ active: false }), 5000);
  }, [alert]);

  if (alert) {
    let title = "";
    if (alert.type === "error") {
      title = "Oops something went wrong";
    }

    if (alert.type === "success") {
      title = "Success";
    }

    return (
      <div>
        {alert.active && (
          <Alert
            text={`${alert.message ?? ""} ${alert.body && `| ${alert.body}`}`}
            title={title}
            variant={alert.type ?? "info"}
            close={() => setAlert({ active: false })}
          />
        )}
      </div>
    );
  }

  return <></>;
};

export default AlertComponent;
