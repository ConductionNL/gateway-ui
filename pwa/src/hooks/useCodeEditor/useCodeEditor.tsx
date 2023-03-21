import * as React from "react";
import * as styles from "./CodeEditor.module.css";

/**
 * DO NOT CHANGE ORDER OF FOLLOWING IMPORTS
 */
import "ace-builds/src-noconflict/ace";
import * as beautify from "ace-builds/src-noconflict/ext-beautify";
/**
 * END OF BLOCK
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";

export const useCodeEditor = (defaultCode?: string) => {
  const editorRef = React.useRef<any>();
  const [code, setCode] = React.useState<string>(defaultCode ?? "");

  const beautifyCode = (editorRef: any) => {
    if (!editorRef.current) return;

    beautify.beautify(editorRef.current.editor.session);
  };

  const CodeEditor: JSX.Element = (
    <div className={styles.container}>
      <AceEditor
        mode="json"
        theme="github"
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        onChange={(v) => setCode(v)}
        value={code}
        setOptions={{
          enableBasicAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        width="100%"
        ref={editorRef}
        commands={beautify.commands}
      />

      <a className={styles.beautifyButton} onClick={() => beautifyCode(editorRef)}>
        <FontAwesomeIcon icon={faMagicWandSparkles} />
        Beautify
      </a>
    </div>
  );

  return { CodeEditor, code };
};
