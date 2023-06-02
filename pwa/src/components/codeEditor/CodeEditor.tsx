import * as React from "react";
import * as styles from "./CodeEditor.module.css";
import MonacoEditor from "@monaco-editor/react";
import clsx from "clsx";

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language?: "json" | "xml";
  layoutClassName?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, layoutClassName, readOnly }) => {
  return (
    <MonacoEditor
      value={code}
      {...{ language }}
      onChange={(newCode) => setCode(newCode ?? "")}
      className={clsx(styles.container, layoutClassName && layoutClassName)}
      options={{ readOnly }}
    />
  );
};
