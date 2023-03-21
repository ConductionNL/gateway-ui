import * as React from "react";

import "ace-builds/src-noconflict/ace"; //IMPORTANT! This import needs to come BEFORE the beautify import, otherwise the beautify import will break!
import * as beautify from "ace-builds/src-noconflict/ext-beautify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";

export const useCodeEditor = () => {
  const beautifyEditorCode = (editorRef: any) => {
    beautify.beautify(editorRef.current.editor.session);
  };

  interface BeautifyCodeButtonProps {
    editorRef: any;
    label?: string;
    icon?: IconDefinition;
    layoutClassName?: string;
  }

  const BeautifyCodeButton: React.FC<BeautifyCodeButtonProps> = ({ editorRef, label, icon, layoutClassName }) => (
    <>
      {console.log("editor", editorRef)}
      <a onClick={() => beautifyEditorCode(editorRef)} className={layoutClassName && layoutClassName}>
        {icon && <FontAwesomeIcon {...{ icon }} />}
        {label ? label : "Beautify"}
      </a>
    </>
  );

  interface CodeEditorProps {
    editorRef: any;
    code?: string;
  }

  // const [code, setCode] = React.useState<string>("");

  const CodeEditor: React.FC<CodeEditorProps> = ({ editorRef }) => {
    const [code, setCode] = React.useState<string>("");

    return (
      <AceEditor
        mode="json"
        theme="github"
        onChange={(value) => setCode(value)}
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        width="100%"
        ref={editorRef}
        commands={beautify.commands}
      />
    );
  };
  return { CodeEditor, BeautifyCodeButton };
};
