'use client';

import { useEffect, useState } from 'react';
import type { Template, SavedTemplate } from '../types';
import {
  emptyTemplate,
  sampleTemplate,
  TOP_IMAGE_PRESETS,
  THUMBNAIL_PRESETS,
} from '../types';
import { TemplateForm } from '../components/TemplateForm';
import { KakaoPreview } from '../components/KakaoPreview';
import { CodeOutput } from '../components/CodeOutput';
import { LibraryPanel } from '../components/LibraryPanel';

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

  // 라이브러리
  const [saved, setSaved] = useState<SavedTemplate[]>([]);
  const [active, setActive] = useState<SavedTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTopImages(loadList('bizmsg.topImages', TOP_IMAGE_PRESETS));
    setThumbnails(loadList('bizmsg.thumbnails', THUMBNAIL_PRESETS));
    fetch('/api/templates')
      .then((r) => r.json())
      .then((list: SavedTemplate[]) => Array.isArray(list) && setSaved(list))
      .catch(() => {});
  }, []);

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

  const loadEntry = (entry: SavedTemplate) => {
    setActive(entry);
    setTemplate(entry.template);
  };

  const startNew = (base: Template) => {
    setActive(null);
    setTemplate(base);
  };

  const save = async () => {
    if (!template.tmplId.trim()) {
      alert('템플릿 코드(tmplId)를 입력해주세요.');
      return;
    }
    setSaving(true);
    // 폼을 수정했으면 rawCode 는 더 이상 정확하지 않으므로, 로드된 항목을 그대로
    // 저장할 때만 rawCode 를 유지한다.
    const rawCode =
      active && active.template === template ? active.rawCode : undefined;
    const payload: SavedTemplate = {
      id: active?.id ?? '',
      project: active?.project ?? 'custom',
      sourceFile: active?.sourceFile,
      rawCode,
      savedAt: '',
      template,
    };
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? '저장에 실패했습니다.');
        return;
      }
      const entry = data as SavedTemplate;
      setSaved((prev) => {
        const idx = prev.findIndex((t) => t.id === entry.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = entry;
          return next;
        }
        return [...prev, entry];
      });
      setActive(entry);
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/templates?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? '삭제에 실패했습니다.');
        return;
      }
      setSaved((prev) => prev.filter((t) => t.id !== id));
      if (active?.id === id) setActive(null);
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const rawForCode =
    active && active.template === template ? active.rawCode : undefined;

  return (
    <div className="app app--wide">
      <header className="app__header">
        <div>
          <h1>비즈엠 알림톡 코드 생성기</h1>
          <p>
            템플릿을 입력하면 sendAlimtalk 코드와 카카오톡 미리보기가 생성되고,
            라이브러리에 저장할 수 있습니다.
          </p>
        </div>
        <div className="app__header-actions">
          <button type="button" className="btn" onClick={save} disabled={saving}>
            {saving ? '저장 중…' : active ? '저장(덮어쓰기)' : '라이브러리에 저장'}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => startNew(sampleTemplate)}
          >
            예시
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => startNew(emptyTemplate)}
          >
            새로 만들기
          </button>
        </div>
      </header>

      <main className="app__grid app__grid--3">
        <aside className="panel panel--library">
          <LibraryPanel
            items={saved}
            activeId={active?.id ?? null}
            onSelect={loadEntry}
            onDelete={remove}
          />
        </aside>

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
            <CodeOutput template={template} rawCode={rawForCode} />
          </div>
        </section>
      </main>
    </div>
  );
}
