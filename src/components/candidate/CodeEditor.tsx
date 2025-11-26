import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

import { languageOptions } from '../../constants/code-editor.ts';

type CodeEditorProps = {
  initialCode?: string;
  language?: string;
  onChange?: (code: string) => void;
  height?: string;
  readOnly?: boolean;
};

const CodeEditor = ({
  initialCode = '// Напишите ваш код здесь',
  language = 'javascript',
  onChange,
  height = '400px',
  readOnly = false,
}: CodeEditorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-base-300 flex items-center justify-between rounded-t-lg p-2">
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
          disabled={readOnly}
          className="select select-bordered select-sm w-40"
        >
          {languageOptions.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-base-300 rounded-b-lg border border-t-0">
        <Editor
          height={height}
          theme="vs-dark"
          language={currentLanguage}
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            fontFamily: 'JetBrains Mono, monospace',
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            parameterHints: { enabled: false },
            wordBasedSuggestions: 'off',
            tabCompletion: 'off',
            readOnly,
            contextmenu: false,
            copyWithSyntaxHighlighting: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;

