import * as React from "react";
import * as styles from "./CodeEditor.module.css";
import MonacoEditor from "@monaco-editor/react";
import clsx from "clsx";

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language?: "json";
  layoutClassName?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language = "json", layoutClassName }) => {
  return (
    <MonacoEditor
      value={code}
      {...{ language }}
      onChange={(newCode) => setCode(newCode ?? "")}
      className={clsx(styles.container, layoutClassName && styles.layoutClassName)}
    />
  );
};
