import { faCheck, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

export const getStatusColor = (value: any): any => {
  if (value === "200") {
    return "statusOk";
  }
  if (value === true) {
    return "statusOk";
  }
  if (value === "No calls have been made yet to this source") {
    return;
  }
  if (value === "no known status") {
    return;
  } else {
    return "statusFailed";
  }
};

export const getStatusIcon = (value: any): any => {
  if (value === "200") {
    return faCheck;
  }
  if (value === true) {
    return faCheck;
  }
  if (value === "No calls have been made yet to this source") {
    return faTriangleExclamation;
  }
  if (value === "no known status") {
    return faTriangleExclamation;
  } else {
    return faXmark;
  }
};
