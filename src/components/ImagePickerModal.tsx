import { useState } from 'react';

interface Props {
  open: boolean;
  title: string;
  images: string[];
  selected: string;
  onSelect: (url: string) => void;
  onAddUrl: (url: string) => void;
  onClose: () => void;
}

export function ImagePickerModal({
  open,
  title,
  images,
  selected,
  onSelect,
  onAddUrl,
  onClose,
}: Props) {
  const [url, setUrl] = useState('');

  if (!open) return null;

  const add = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onAddUrl(trimmed);
    onSelect(trimmed);
    setUrl('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">{title}</span>
          <button type="button" className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal__addurl">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="이미지 URL 추가 (https://...)"
          />
          <button type="button" className="btn btn--sm" onClick={add}>
            추가
          </button>
        </div>

        <div className="modal__grid">
          {images.map((img) => (
            <button
              type="button"
              key={img}
              className={
                'gallery-item' + (selected === img ? ' is-active' : '')
              }
              onClick={() => {
                onSelect(img);
                onClose();
              }}
              title={img}
            >
              <img src={img} alt="" loading="lazy" />
            </button>
          ))}
          {images.length === 0 && (
            <p className="modal__empty">등록된 이미지가 없어요. URL을 추가해보세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
