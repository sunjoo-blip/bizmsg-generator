'use client';

import { useEffect, useState } from 'react';
import type { Template } from '../types';
import {
  emptyTemplate,
  sampleTemplate,
  TOP_IMAGE_PRESETS,
  THUMBNAIL_PRESETS,
} from '../types';
import { TemplateForm } from '../components/TemplateForm';
import { KakaoPreview } from '../components/KakaoPreview';
import { CodeOutput } from '../components/CodeOutput';

// 기본 프리셋 + 사용자가 추가해 저장한 URL 을 합쳐서 로드
function loadList(key: string, presets: string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    const saved: unknown = raw ? JSON.parse(raw) : [];
    const savedArr = Array.isArray(saved) ? (saved as string[]) : [];
    return Array.from(new Set([...presets, ...savedArr]));
  } catch {
    return presets;
  }
}

export default function Page() {
  const [template, setTemplate] = useState<Template>(sampleTemplate);
  const [topImages, setTopImages] = useState<string[]>(TOP_IMAGE_PRESETS);
  const [thumbnails, setThumbnails] = useState<string[]>(THUMBNAIL_PRESETS);

  // localStorage 접근은 클라이언트 마운트 후에만 (SSR 안전)
  useEffect(() => {
    setTopImages(loadList('bizmsg.topImages', TOP_IMAGE_PRESETS));
    setThumbnails(loadList('bizmsg.thumbnails', THUMBNAIL_PRESETS));
  }, []);

  // 프리셋을 제외한 추가분만 저장
  useEffect(() => {
    const extra = topImages.filter((u) => !TOP_IMAGE_PRESETS.includes(u));
    localStorage.setItem('bizmsg.topImages', JSON.stringify(extra));
  }, [topImages]);
  useEffect(() => {
    const extra = thumbnails.filter((u) => !THUMBNAIL_PRESETS.includes(u));
    localStorage.setItem('bizmsg.thumbnails', JSON.stringify(extra));
  }, [thumbnails]);

  const addTopImage = (url: string) =>
    setTopImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  const addThumbnail = (url: string) =>
    setThumbnails((prev) => (prev.includes(url) ? prev : [...prev, url]));

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>비즈엠 알림톡 코드 생성기</h1>
          <p>
            템플릿을 입력하면 sendAlimtalk 코드와 카카오톡 미리보기가 실시간으로
            생성됩니다.
          </p>
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
          <TemplateForm
            value={template}
            onChange={setTemplate}
            topImages={topImages}
            thumbnails={thumbnails}
            onAddTopImage={addTopImage}
            onAddThumbnail={addThumbnail}
          />
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
