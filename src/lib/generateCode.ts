import type { Template } from '../types';

// 비즈엠 템플릿 변수는 #{변수} 표기. 생성 코드에서는 JS 템플릿 리터럴 ${변수} 로 변환한다.
export function toTemplateLiteral(text: string): string {
  return text.replace(/#\{([^}]+)\}/g, '${$1}');
}

// 코드 문자열용 작은따옴표 이스케이프
function q(text: string): string {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

// 변수(#{})가 포함될 수 있는 값은 백틱 리터럴로. 없으면 작은따옴표로.
function lit(text: string): string {
  return /#\{[^}]+\}/.test(text) ? `\`${toTemplateLiteral(text)}\`` : q(text);
}

const IND = '  '; // 2-space indent

function buttonBlock(
  key: string,
  btn: Template['buttons'][number],
  base: string,
): string {
  const lines = [`${base}${key}: {`];
  lines.push(`${base}${IND}name: ${lit(btn.name)},`);
  lines.push(`${base}${IND}type: ${q(btn.type)},`);
  if (btn.type === 'WL') {
    lines.push(`${base}${IND}url_mobile: ${lit(btn.url_mobile)},`);
    lines.push(`${base}${IND}url_pc: ${lit(btn.url_pc)},`);
  } else if (btn.type === 'AL') {
    lines.push(`${base}${IND}scheme_ios: ${lit(btn.scheme_ios)},`);
    lines.push(`${base}${IND}scheme_android: ${lit(btn.scheme_android)},`);
  }
  lines.push(`${base}},`);
  return lines.join('\n');
}

export function generateCode(t: Template): string {
  const base = IND.repeat(3); // await ... 안쪽 오브젝트 들여쓰기 (서비스 메서드 내부 기준)
  const lines: string[] = [];

  lines.push(`${IND.repeat(2)}await this.bizmsgService.sendAlimtalk({`);
  lines.push(`${base}message_type: ${q(t.messageType)},`);
  lines.push(`${base}phn: ${t.phoneVar || 'phone'},`);
  lines.push(`${base}profile: ${t.profileExpr || 'ENV.BIZMSG.PROFILE_ID'},`);
  lines.push(`${base}tmplId: ${q(t.tmplId)},`);

  // 강조 유형별 필드
  if (t.emphasize === 'ITEM_LIST' && t.header) {
    lines.push(`${base}header: ${q(t.header)},`);
  }
  if (t.emphasize === 'TEXT' && t.title) {
    lines.push(`${base}title: ${q(t.title)},`);
  }

  // msg — 멀티라인 백틱 리터럴
  const msgLiteral = toTemplateLiteral(t.msg);
  lines.push(`${base}msg: \`${msgLiteral}\`,`);

  if (t.additionalContent) {
    lines.push(
      `${base}additional_content: ${q(toTemplateLiteral(t.additionalContent))},`,
    );
  }

  // 아이템리스트형 items { item.list, itemHighlight }
  if (t.emphasize === 'ITEM_LIST') {
    const list = t.itemList.filter((it) => it.title || it.description);
    const hasHighlight = t.itemHighlightTitle || t.itemHighlightDescription;
    if (list.length > 0 || hasHighlight) {
      lines.push(`${base}items: {`);
      if (list.length > 0) {
        lines.push(`${base}${IND}item: {`);
        lines.push(`${base}${IND}${IND}list: [`);
        list.forEach((it) => {
          lines.push(
            `${base}${IND}${IND}${IND}{ title: ${q(it.title)}, description: ${lit(it.description)} },`,
          );
        });
        lines.push(`${base}${IND}${IND}],`);
        lines.push(`${base}${IND}},`);
      }
      if (hasHighlight) {
        lines.push(`${base}${IND}itemHighlight: {`);
        lines.push(`${base}${IND}${IND}title: ${lit(t.itemHighlightTitle)},`);
        lines.push(
          `${base}${IND}${IND}description: ${lit(t.itemHighlightDescription)},`,
        );
        lines.push(`${base}${IND}},`);
      }
      lines.push(`${base}},`);
    }
  }

  // 버튼 1~5
  t.buttons.slice(0, 5).forEach((btn, i) => {
    lines.push(buttonBlock(`button${i + 1}`, btn, base));
  });

  lines.push(`${IND.repeat(2)}});`);
  return lines.join('\n');
}
