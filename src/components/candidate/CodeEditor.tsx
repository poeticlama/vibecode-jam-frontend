import Editor from '@monaco-editor/react';
import { useState } from 'react';

import { languageOptions } from '../../constants/code-editor.ts';

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Напишите ваш код здесь`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', background: '#222', color: '#fff' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: 6,
            borderRadius: 6,
            border: 'none',
            background: '#333',
            color: 'white',
          }}
        >
          {languageOptions.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(v) => setCode(v ? v : '')}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontFamily: 'JetBrains Mono',
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          parameterHints: { enabled: false },
          wordBasedSuggestions: 'off',
          tabCompletion: 'off',
        }}
      />
    </div>
  );
};

export default CodeEditor;
