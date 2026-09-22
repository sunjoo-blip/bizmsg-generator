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
  // 아래 두 이미지는 미리보기 전용 (코드 미포함)
  topImageUrl: string; // 상단 이미지 (전체폭 배너)
  highlightThumbnailUrl: string; // 아이템 하이라이트 썸네일 (하이라이트 우측 작은 이미지)
}

// 상단 이미지 프리셋 (전체폭 배너, img_l)
export const TOP_IMAGE_PRESETS: string[] = [
  'https://mud-kage.kakao.com/dn/bcbfDe/btsN0y1lAWE/Jb5VmcFzAHhJtxoqbClz31/img_l.jpg',
  'https://mud-kage.kakao.com/dn/Zhywc/btsN0lukezG/Ypn1N8OcmkFlPlOYO5O350/img_l.jpg',
  'https://mud-kage.kakao.com/dn/dy2ZtH/btsNZ4l3PiM/vuxACv2kMcKIqMkqFdZ1k1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/sLyvr/btsNZfaKv19/3g6FzvQp6GDc8zbFAHiGv0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/cmkp8v/btsNZfIzePG/YtlNIkP7FYB5XnNkrrBapK/img_l.jpg',
  'https://mud-kage.kakao.com/dn/dt6eNh/btsN0wWJ2p7/sH24A0IJFklMW4zYdB0kAK/img_l.jpg',
  'https://mud-kage.kakao.com/dn/Rwx7V/btsN0hyLI6b/o75DCkVcEZTnfinPodMSf0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/cwLhnY/btsOZzyjt9u/kBJ2kV0wuL0xbKkaKQBLh1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/k9GUK/btsO7oQF4lS/1orAvHHeT4T10VjakmumW1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/0KyqO/btsO5lBzgoe/YoLztEB66HD5COVkdKMNGK/img_l.jpg',
  'https://mud-kage.kakao.com/dn/jcL8P/btsO6cw5bcS/aeW2XkB5XXCiTeb6ILSXVk/img_l.jpg',
  'https://mud-kage.kakao.com/dn/bmZnHv/btsPsdvP5JX/cgXECIAIo7n5eq8pCk6gJ1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/bLuUxt/btsPrQHHuqD/jNJw8CMnJ0SRElmoX9hdoK/img_l.jpg',
  'https://mud-kage.kakao.com/dn/mFzm8/dJMcagjDnLx/pgkU9hP0nV3Me7dExd7TH1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/fRDti/dJMcaf6bJp4/uU0fF5gS0z6IeCxjQGJIBk/img_l.jpg',
  'https://mud-kage.kakao.com/dn/gJQu4/dJMcaivd29R/9a8TY7Ur1Mp5YDNwodt5Lk/img_l.jpg',
  'https://mud-kage.kakao.com/dn/yoKG4/dJMcagdAnUO/DzfyXjkQJygMAny1Dj7rR0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/7R3A2/dJMcaiWIK8x/CkRZ9DUAk6Z7KKhwIHujp0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/CINWB/dJMcajakleh/nloM1fe8grPowWt0Bzyz3k/img_l.jpg',
  'https://mud-kage.kakao.com/dn/8egun/dJMcadnIFWX/W4ktNteUgYxKHZxe5Fyrx1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/zcoTH/dJMcadB4bis/RREVn6p3AFWQ0u8TnlBwa0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/dDbGRp/dJMcaa7ckn3/FR0BQ8xKP2orDwnzABA4uk/img_l.jpg',
  'https://mud-kage.kakao.com/dn/klLt9/dJMcaiRQF2F/vlvSp3Q1EUIezYv22zGPM1/img_l.jpg',
  'https://mud-kage.kakao.com/dn/ybvLW/dJMcaiShjOU/h2pKNenAR3ErjFzqXtIK2k/img_l.jpg',
  'https://mud-kage.kakao.com/dn/SYTR2/dJMcahsk3lG/oCBdsjRSNHbvEYsML8jWwK/img_l.jpg',
  'https://mud-kage.kakao.com/dn/cyuAyE/dJMcagGYMd4/F8ZeTERspy5V1gmeIINjq0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/knocz/dJMcadjaGpZ/fLOytsK2GYMPdUKJLz6zHK/img_l.jpg',
  'https://mud-kage.kakao.com/dn/dfpJeG/dJMcagGYMhL/SnyDL57EL0VKwmO1nlhbPk/img_l.jpg',
  'https://mud-kage.kakao.com/dn/bf7dUB/dJMcagGYMja/VTlYo2zvAhOHLkbNbUerz0/img_l.jpg',
  'https://mud-kage.kakao.com/dn/vs1ut/dJMcabllMbh/I3VVXE7KGoMYDvKhcrQ71K/img_l.jpg',
  'https://mud-kage.kakao.com/dn/bbmFYB/dJMcahsl9WJ/wdCowIiQO0TzMXiSGZPm41/img_l.jpg',
  'https://mud-kage.kakao.com/dn/eibklt/dJMcagNUnUn/ab1o0h59PxnxI21JGPkNTk/img_l.jpg',
  'https://mud-kage.kakao.com/dn/b58tMo/dJMcaaz6JVy/WnkAEjVGqlK4RxDvRtKF0K/img_l.jpg',
];

// 아이템 하이라이트 썸네일 프리셋 (작은 정사각 이미지, img_s)
export const THUMBNAIL_PRESETS: string[] = [
  'https://mud-kage.kakao.com/dn/i3Emw/btsN0u6Md9e/XuCeN8xCCYchzTCqznBAgk/img_s.jpg',
  'https://mud-kage.kakao.com/dn/Do80S/btsN0fvegQ6/JHAp14dPSgtohv8b8KTiVk/img_s.jpg',
  'https://mud-kage.kakao.com/dn/hhh9C/btsNZZMSGrU/hp54NKp0gXezWsUfKZhiOK/img_s.jpg',
  'https://mud-kage.kakao.com/dn/bTbzjj/btsNZ0dSfqd/qRtqmNKUkkLQzTHbzZV4rK/img_s.jpg',
  'https://mud-kage.kakao.com/dn/iWZRU/btsNZyaXXYm/HKccechYv8kUWlXNaWAuD0/img_s.jpg',
  'https://mud-kage.kakao.com/dn/hbxwq/btsN089Jen2/UPzEVjo6JK0HxXmO2ftA1K/img_s.jpg',
];

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
  topImageUrl: '',
  highlightThumbnailUrl: '',
};

// 예시 템플릿 (예약 완료 - 아이템리스트형)
export const sampleTemplate: Template = {
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
  topImageUrl: '',
  highlightThumbnailUrl: THUMBNAIL_PRESETS[0],
};
