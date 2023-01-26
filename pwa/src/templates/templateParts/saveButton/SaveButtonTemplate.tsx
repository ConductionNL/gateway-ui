import * as React from "react";

export type TAfterSuccessfulFormSubmit = "save" | "saveAndClose" | "saveAndCreateNew";

interface SaveButtonTemplateProps {
  setAfterSuccessfulFormSubmit: React.Dispatch<React.SetStateAction<TAfterSuccessfulFormSubmit>>;
}

export const SaveButtonTemplate: React.FC<SaveButtonTemplateProps> = ({ setAfterSuccessfulFormSubmit }) => {
  return (
    <>
      <button onClick={() => setAfterSuccessfulFormSubmit("save")}>On save</button>
      <button onClick={() => setAfterSuccessfulFormSubmit("saveAndClose")}>On save and close</button>
      <button onClick={() => setAfterSuccessfulFormSubmit("saveAndCreateNew")}>On save and create new</button>
    </>
  );
};
