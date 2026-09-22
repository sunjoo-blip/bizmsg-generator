import { useMemo, useState } from 'react';
import type { SavedTemplate } from '../types';

interface Props {
  items: SavedTemplate[];
  activeId: string | null;
  onSelect: (entry: SavedTemplate) => void;
  onDelete: (id: string) => void;
}

export function LibraryPanel({ items, activeId, onSelect, onDelete }: Props) {
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const filtered = kw
      ? items.filter(
          (t) =>
            t.template.tmplId.toLowerCase().includes(kw) ||
            t.project.toLowerCase().includes(kw),
        )
      : items;
    const byProject: Record<string, SavedTemplate[]> = {};
    for (const t of filtered) (byProject[t.project] ??= []).push(t);
    return Object.entries(byProject).sort(([a], [b]) => a.localeCompare(b));
  }, [items, q]);

  return (
    <div className="library">
      <div className="library__head">
        <span className="panel__label">라이브러리 ({items.length})</span>
      </div>
      <input
        className="library__search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="tmplId · 프로젝트 검색"
      />

      <div className="library__list">
        {groups.length === 0 && (
          <p className="library__empty">저장된 템플릿이 없습니다.</p>
        )}
        {groups.map(([project, list]) => (
          <div key={project} className="library__group">
            <div className="library__group-label">
              {project} · {list.length}
            </div>
            {list.map((t) => (
              <div
                key={t.id}
                className={
                  'library__item' + (t.id === activeId ? ' is-active' : '')
                }
                onClick={() => onSelect(t)}
              >
                <span className="library__tmpl">{t.template.tmplId}</span>
                <button
                  type="button"
                  className="library__del"
                  title="삭제"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`"${t.template.tmplId}" 삭제할까요?`))
                      onDelete(t.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
