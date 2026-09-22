import { useEffect, useState } from 'react';
import type { Template } from '../types';
import { generateCode } from '../lib/generateCode';

interface Props {
  template: Template;
  rawCode?: string; // 시딩된 항목의 원본 sendAlimtalk 코드
}

export function CodeOutput({ template, rawCode }: Props) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'gen' | 'raw'>(rawCode ? 'raw' : 'gen');

  // 새 항목을 불러오면(rawCode 변경) 기본 탭을 다시 결정
  useEffect(() => {
    setTab(rawCode ? 'raw' : 'gen');
  }, [rawCode]);

  const code = tab === 'raw' && rawCode ? rawCode : generateCode(template);

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
        {rawCode ? (
          <div className="code__tabs">
            <button
              type="button"
              className={'code__tab' + (tab === 'raw' ? ' is-active' : '')}
              onClick={() => setTab('raw')}
            >
              원본 코드
            </button>
            <button
              type="button"
              className={'code__tab' + (tab === 'gen' ? ' is-active' : '')}
              onClick={() => setTab('gen')}
            >
              생성 코드
            </button>
          </div>
        ) : (
          <span className="code__title">생성된 코드</span>
        )}
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
