import { useState } from 'react';
import type { Template } from './types';
import { emptyTemplate, sampleTemplate } from './types';
import { TemplateForm } from './components/TemplateForm';
import { KakaoPreview } from './components/KakaoPreview';
import { CodeOutput } from './components/CodeOutput';
import './App.css';

export default function App() {
  const [template, setTemplate] = useState<Template>(sampleTemplate);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>비즈엠 알림톡 코드 생성기</h1>
          <p>템플릿을 입력하면 sendAlimtalk 코드와 카카오톡 미리보기가 실시간으로 생성됩니다.</p>
        </div>
        <div className="app__header-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setTemplate(sampleTemplate)}
          >
            예시 불러오기
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setTemplate(emptyTemplate)}
          >
            비우기
          </button>
        </div>
      </header>

      <main className="app__grid">
        <section className="panel panel--form">
          <TemplateForm value={template} onChange={setTemplate} />
        </section>

        <section className="panel panel--preview">
          <div className="preview-sticky">
            <h2 className="panel__label">카카오톡 미리보기</h2>
            <KakaoPreview template={template} />
            <CodeOutput template={template} />
          </div>
        </section>
      </main>
    </div>
  );
}
