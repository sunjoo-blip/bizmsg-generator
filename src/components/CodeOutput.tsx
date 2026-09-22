import { useState } from 'react';
import type { Template } from '../types';
import { generateCode } from '../lib/generateCode';

interface Props {
  template: Template;
}

export function CodeOutput({ template }: Props) {
  const [copied, setCopied] = useState(false);
  const code = generateCode(template);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code">
      <div className="code__head">
        <span className="code__title">생성된 코드</span>
        <button type="button" className="btn btn--sm" onClick={copy}>
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
      <pre className="code__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
