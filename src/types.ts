// 비즈엠 알림톡 템플릿 도메인 모델
// obud-api-v2 의 BizmsgService.sendAlimtalk 인터페이스에 대응한다.

export type MessageType = 'AT' | 'AI'; // AT: 기본/아이템리스트형, AI: 이미지형

export type EmphasizeType = 'NONE' | 'TEXT' | 'ITEM_LIST';
// NONE: 기본형, TEXT: 강조표기형(title), ITEM_LIST: 아이템리스트형(header)

export type ButtonType = 'WL' | 'AL' | 'AC' | 'MD';
// WL: 웹링크, AL: 앱링크, AC: 채널추가, MD: 메시지전달

export interface TemplateButton {
  name: string;
  type: ButtonType;
  url_mobile: string; // WL(웹링크)
  url_pc: string; // WL(웹링크)
  scheme_ios: string; // AL(앱링크)
  scheme_android: string; // AL(앱링크)
}

export interface TemplateItem {
  title: string; // 좌측 항목명 (예: 예약, 일정, 인원)
  description: string; // 우측 값
}

export interface Template {
  // 표시용 (코드에는 주석으로만 반영)
  templateName: string;
  category: string;

  // sendAlimtalk 페이로드에 매핑
  profileExpr: string; // profile 에 넣을 코드 표현식 (프로젝트별로 다름)
  tmplId: string; // 템플릿 코드
  messageType: MessageType; // message_type
  phoneVar: string; // phn 에 넣을 변수명 (예: phone, userPhone)
  emphasize: EmphasizeType;
  header: string; // 아이템리스트형 헤더 (상단 굵은 제목)
  title: string; // 강조표기형 타이틀
  itemList: TemplateItem[]; // 아이템리스트형 items.item.list
  itemHighlightTitle: string; // items.itemHighlight.title
  itemHighlightDescription: string; // items.itemHighlight.description
  msg: string; // 템플릿 내용
  additionalContent: string; // 부가정보
  buttons: TemplateButton[];
}

export const BUTTON_TYPE_LABELS: Record<ButtonType, string> = {
  WL: '웹링크 (WL)',
  AL: '앱링크 (AL)',
  AC: '채널추가 (AC)',
  MD: '메시지전달 (MD)',
};

export const EMPHASIZE_LABELS: Record<EmphasizeType, string> = {
  NONE: '선택안함 (기본형)',
  TEXT: '강조표기형',
  ITEM_LIST: '아이템리스트형',
};

export const emptyTemplate: Template = {
  templateName: '',
  category: '',
  profileExpr: 'ENV.BIZMSG.PROFILE_ID',
  tmplId: '',
  messageType: 'AT',
  phoneVar: 'phone',
  emphasize: 'NONE',
  header: '',
  title: '',
  itemList: [],
  itemHighlightTitle: '',
  itemHighlightDescription: '',
  msg: '',
  additionalContent: '',
  buttons: [],
};

// 예시 템플릿 (예약 완료 - 아이템리스트형)
export const sampleTemplate: Template = {
  templateName: '파트너 예약 완료 안내',
  category: '서비스이용',
  profileExpr: 'ENV.BIZMSG.PROFILE_ID',
  tmplId: 'partner_booking20',
  messageType: 'AT',
  phoneVar: 'recipient.phone',
  emphasize: 'ITEM_LIST',
  header: '예약이 완료되었어요',
  title: '',
  itemList: [
    { title: '예약', description: '#{예약명}' },
    { title: '일정', description: '#{일정}' },
    { title: '인원', description: '1명' },
    { title: '예약자', description: '#{예약자명}' },
    { title: '연락처', description: '#{연락처}' },
    { title: '예약수단', description: '#{예약수단}' },
  ],
  itemHighlightTitle: '#{장소명}',
  itemHighlightDescription: '예약한 장소',
  msg: '예약이 완료되었습니다.\n상세 내용을 확인해 주세요.',
  additionalContent: '',
  buttons: [
    {
      name: '예약내역 상세보기',
      type: 'WL',
      url_mobile: 'https://admin.obud.co/place/#{장소ID}/reservation',
      url_pc: 'https://admin.obud.co/place/#{장소ID}/reservation',
      scheme_ios: '',
      scheme_android: '',
    },
  ],
};
