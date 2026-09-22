import type { Template } from '../types';

interface Props {
  template: Template;
}

// #{변수} / ${변수} 를 하이라이트 조각으로 분리
function renderWithVars(text: string) {
  const parts = text.split(/(#\{[^}]+\}|\$\{[^}]+\})/g);
  return parts.map((part, i) =>
    /^(#\{|\$\{)/.test(part) ? (
      <span className="var" key={i}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function KakaoPreview({ template }: Props) {
  const {
    emphasize,
    header,
    title,
    itemList,
    itemHighlightTitle,
    itemHighlightDescription,
    msg,
    additionalContent,
    buttons,
    topImageUrl,
    highlightThumbnailUrl,
  } = template;

  const isItemList = emphasize === 'ITEM_LIST';
  const visibleItems = itemList.filter((it) => it.title || it.description);
  const hasHighlight =
    itemHighlightTitle || itemHighlightDescription || highlightThumbnailUrl;

  return (
    <div className="kakao">
      <div className="kakao__sender">
        <span className="kakao__avatar">obud</span>
        <span className="kakao__sendername">오붓(obud)</span>
      </div>

      <div className="kakao__bubble">
        <div className="kakao__badge">알림톡 도착</div>

        {topImageUrl && (
          <img className="kakao__image" src={topImageUrl} alt="" />
        )}

        <div className="kakao__body">
          {isItemList && header && (
            <div className="kakao__header">{header}</div>
          )}
          {emphasize === 'TEXT' && title && (
            <div className="kakao__title">{title}</div>
          )}

          {isItemList && hasHighlight && (
            <div className="kakao__highlight">
              <div className="kakao__highlight-text">
                <div className="kakao__highlight-title">
                  {renderWithVars(itemHighlightTitle)}
                </div>
                {itemHighlightDescription && (
                  <div className="kakao__highlight-desc">
                    {renderWithVars(itemHighlightDescription)}
                  </div>
                )}
              </div>
              {highlightThumbnailUrl && (
                <img
                  className="kakao__thumb"
                  src={highlightThumbnailUrl}
                  alt=""
                />
              )}
            </div>
          )}

          {isItemList && visibleItems.length > 0 && (
            <dl className="kakao__items">
              {visibleItems.map((it, i) => (
                <div className="kakao__item" key={i}>
                  <dt>{it.title}</dt>
                  <dd>{renderWithVars(it.description)}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="kakao__msg">
            {msg ? renderWithVars(msg) : (
              <span className="kakao__placeholder">
                템플릿 내용을 입력하면 여기에 표시됩니다.
              </span>
            )}
          </div>

          {additionalContent && (
            <div className="kakao__additional">
              {renderWithVars(additionalContent)}
            </div>
          )}
        </div>

        {buttons.length > 0 && (
          <div className="kakao__buttons">
            {buttons.slice(0, 5).map((b, i) => (
              <button type="button" className="kakao__btn" key={i} disabled>
                {b.name || '버튼'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
