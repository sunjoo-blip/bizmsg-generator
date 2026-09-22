import { useState } from 'react';
import type {
  Template,
  TemplateButton,
  TemplateItem,
  ButtonType,
  EmphasizeType,
  MessageType,
} from '../types';
import { BUTTON_TYPE_LABELS, EMPHASIZE_LABELS } from '../types';
import { ImagePickerModal } from './ImagePickerModal';

interface Props {
  value: Template;
  onChange: (next: Template) => void;
  topImages: string[];
  thumbnails: string[];
  onAddTopImage: (url: string) => void;
  onAddThumbnail: (url: string) => void;
}

const MAX_MSG = 1000;

export function TemplateForm({
  value,
  onChange,
  topImages,
  thumbnails,
  onAddTopImage,
  onAddThumbnail,
}: Props) {
  const patch = (p: Partial<Template>) => onChange({ ...value, ...p });
  const [picker, setPicker] = useState<null | 'top' | 'thumb'>(null);

  const patchButton = (i: number, p: Partial<TemplateButton>) => {
    const buttons = value.buttons.map((b, idx) =>
      idx === i ? { ...b, ...p } : b,
    );
    patch({ buttons });
  };

  const addButton = () => {
    if (value.buttons.length >= 5) return;
    patch({
      buttons: [
        ...value.buttons,
        {
          name: '',
          type: 'WL',
          url_mobile: '',
          url_pc: '',
          scheme_ios: '',
          scheme_android: '',
        },
      ],
    });
  };

  const removeButton = (i: number) =>
    patch({ buttons: value.buttons.filter((_, idx) => idx !== i) });

  const patchItem = (i: number, p: Partial<TemplateItem>) => {
    const itemList = value.itemList.map((it, idx) =>
      idx === i ? { ...it, ...p } : it,
    );
    patch({ itemList });
  };

  const addItem = () =>
    patch({ itemList: [...value.itemList, { title: '', description: '' }] });

  const removeItem = (i: number) =>
    patch({ itemList: value.itemList.filter((_, idx) => idx !== i) });

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <h2 className="form__title">템플릿 등록</h2>

      <Row label="발신프로필" required hint="profile 에 넣을 코드 표현식">
        <input
          value={value.profileExpr}
          onChange={(e) => patch({ profileExpr: e.target.value })}
          placeholder="ENV.BIZMSG.PROFILE_ID"
        />
      </Row>

      <Row label="받는사람 변수" hint="phn 에 들어갈 변수명 (발송 코드용)">
        <input
          value={value.phoneVar}
          onChange={(e) => patch({ phoneVar: e.target.value })}
          placeholder="phone"
        />
      </Row>

      <Row label="템플릿 코드" required hint="비즈엠에 등록한 tmplId">
        <input
          value={value.tmplId}
          onChange={(e) => patch({ tmplId: e.target.value })}
          placeholder="reservation-report-answer"
        />
      </Row>

      <Row label="템플릿 메시지 유형" required>
        <select
          value={value.messageType}
          onChange={(e) =>
            patch({ messageType: e.target.value as MessageType })
          }
        >
          <option value="AT">기본형 (AT)</option>
          <option value="AI">이미지형 (AI)</option>
        </select>
      </Row>

      <Row label="상단 이미지" hint="전체폭 배너 · 미리보기 전용 (코드 미포함)">
        <ImageSelect
          value={value.topImageUrl}
          onPick={() => setPicker('top')}
          onClear={() => patch({ topImageUrl: '' })}
        />
      </Row>

      <Row label="템플릿 강조 유형" required>
        <select
          value={value.emphasize}
          onChange={(e) =>
            patch({ emphasize: e.target.value as EmphasizeType })
          }
        >
          {(Object.keys(EMPHASIZE_LABELS) as EmphasizeType[]).map((k) => (
            <option key={k} value={k}>
              {EMPHASIZE_LABELS[k]}
            </option>
          ))}
        </select>
      </Row>

      {value.emphasize === 'TEXT' && (
        <Row label="강조 타이틀" hint="title">
          <input
            value={value.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="30,000원 결제 완료"
          />
        </Row>
      )}

      {value.emphasize === 'ITEM_LIST' && (
        <>
          <Row label="템플릿 헤더" hint="상단 굵은 제목 (header)">
            <input
              value={value.header}
              onChange={(e) => patch({ header: e.target.value })}
              placeholder="예약이 완료되었어요"
            />
          </Row>

          <Row label="아이템 하이라이트 타이틀" hint="items.itemHighlight.title">
            <input
              value={value.itemHighlightTitle}
              onChange={(e) => patch({ itemHighlightTitle: e.target.value })}
              placeholder="#{장소명}"
            />
          </Row>
          <Row
            label="아이템 하이라이트 설명"
            hint="items.itemHighlight.description"
          >
            <input
              value={value.itemHighlightDescription}
              onChange={(e) =>
                patch({ itemHighlightDescription: e.target.value })
              }
              placeholder="예약한 장소"
            />
          </Row>
          <Row label="하이라이트 썸네일" hint="우측 작은 이미지 · 미리보기 전용">
            <ImageSelect
              value={value.highlightThumbnailUrl}
              onPick={() => setPicker('thumb')}
              onClear={() => patch({ highlightThumbnailUrl: '' })}
            />
          </Row>

          <div className="items-section">
            <div className="buttons-section__head">
              <span className="row__label">
                아이템 리스트 ({value.itemList.length})
              </span>
              <button
                type="button"
                className="btn btn--sm"
                onClick={addItem}
              >
                + 항목 추가
              </button>
            </div>
            <p className="row__hint" style={{ marginTop: -2 }}>
              items.item.list · 좌측 아이템명 / 우측 아이템 내용
            </p>

            {value.itemList.map((it, i) => (
              <div className="item-row" key={i}>
                <input
                  className="item-row__title"
                  value={it.title}
                  onChange={(e) => patchItem(i, { title: e.target.value })}
                  placeholder="예약"
                />
                <input
                  className="item-row__desc"
                  value={it.description}
                  onChange={(e) =>
                    patchItem(i, { description: e.target.value })
                  }
                  placeholder="#{예약명}"
                />
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeItem(i)}
                  aria-label="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <Row
        label="템플릿 내용"
        required
        hint="변수는 #{변수명} 으로 작성하세요"
      >
        <textarea
          rows={7}
          value={value.msg}
          maxLength={MAX_MSG}
          onChange={(e) => patch({ msg: e.target.value })}
          placeholder="#{이름}님, 신고하신 #{장소} 예약 건에 답변이 등록되었어요."
        />
        <div className="counter">
          {value.msg.length} / {MAX_MSG}
        </div>
      </Row>

      <Row label="부가정보" hint="additional_content · 공백포함 최대 34자">
        <textarea
          rows={2}
          value={value.additionalContent}
          onChange={(e) => patch({ additionalContent: e.target.value })}
          placeholder="추가 문의는 앱 고객센터를 이용해주세요."
        />
      </Row>

      <div className="buttons-section">
        <div className="buttons-section__head">
          <span className="row__label">버튼 ({value.buttons.length}/5)</span>
          <button
            type="button"
            className="btn btn--sm"
            onClick={addButton}
            disabled={value.buttons.length >= 5}
          >
            + 버튼 추가
          </button>
        </div>

        {value.buttons.map((btn, i) => (
          <div className="button-card" key={i}>
            <div className="button-card__head">
              <strong>button{i + 1}</strong>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => removeButton(i)}
              >
                삭제
              </button>
            </div>
            <div className="button-card__grid">
              <label>
                <span>버튼명</span>
                <input
                  value={btn.name}
                  onChange={(e) => patchButton(i, { name: e.target.value })}
                  placeholder="답변 확인하기"
                />
              </label>
              <label>
                <span>타입</span>
                <select
                  value={btn.type}
                  onChange={(e) =>
                    patchButton(i, { type: e.target.value as ButtonType })
                  }
                >
                  {(Object.keys(BUTTON_TYPE_LABELS) as ButtonType[]).map((k) => (
                    <option key={k} value={k}>
                      {BUTTON_TYPE_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>
              {btn.type === 'WL' && (
                <>
                  <label>
                    <span>Mobile URL</span>
                    <input
                      value={btn.url_mobile}
                      onChange={(e) =>
                        patchButton(i, { url_mobile: e.target.value })
                      }
                      placeholder="https://www.obud.co/my"
                    />
                  </label>
                  <label>
                    <span>PC URL</span>
                    <input
                      value={btn.url_pc}
                      onChange={(e) =>
                        patchButton(i, { url_pc: e.target.value })
                      }
                      placeholder="https://www.obud.co/my"
                    />
                  </label>
                </>
              )}
              {btn.type === 'AL' && (
                <>
                  <label>
                    <span>iOS Scheme</span>
                    <input
                      value={btn.scheme_ios}
                      onChange={(e) =>
                        patchButton(i, { scheme_ios: e.target.value })
                      }
                      placeholder="onstudioadminapp://places/#{placeId}"
                    />
                  </label>
                  <label>
                    <span>Android Scheme</span>
                    <input
                      value={btn.scheme_android}
                      onChange={(e) =>
                        patchButton(i, { scheme_android: e.target.value })
                      }
                      placeholder="onstudioadminapp://places/#{placeId}"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ImagePickerModal
        open={picker !== null}
        title={picker === 'top' ? '상단 이미지 선택' : '하이라이트 썸네일 선택'}
        images={picker === 'top' ? topImages : thumbnails}
        selected={
          picker === 'top' ? value.topImageUrl : value.highlightThumbnailUrl
        }
        onSelect={(url) =>
          patch(
            picker === 'top'
              ? { topImageUrl: url }
              : { highlightThumbnailUrl: url },
          )
        }
        onAddUrl={picker === 'top' ? onAddTopImage : onAddThumbnail}
        onClose={() => setPicker(null)}
      />
    </form>
  );
}

function ImageSelect({
  value,
  onPick,
  onClear,
}: {
  value: string;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="img-select">
      {value ? (
        <img className="img-select__preview" src={value} alt="" />
      ) : (
        <span className="img-select__empty">선택된 이미지가 없습니다.</span>
      )}
      <div className="img-select__actions">
        <button type="button" className="btn btn--sm" onClick={onPick}>
          이미지 선택
        </button>
        {value && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={onClear}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="row">
      <div className="row__labelbox">
        <span className="row__label">
          {label}
          {required && <em className="row__req">*</em>}
        </span>
        {hint && <span className="row__hint">{hint}</span>}
      </div>
      <div className="row__control">{children}</div>
    </div>
  );
}
