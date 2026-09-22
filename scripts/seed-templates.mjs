// obud-api-v2 / onstudio-api 의 sendAlimtalk 호출부를 스캔해
// data/templates.json 을 한 번에 시딩하는 1회성 스크립트.
//   실행: node scripts/seed-templates.mjs
import { Project, Node } from 'ts-morph';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'data', 'templates.json');

const REPOS = [
  { name: 'obud', root: '/Users/sunju/Repos/obud-api-v2' },
  { name: 'onstudio', root: '/Users/sunju/Repos/onstudio-api' },
];

// 노드 → 미리보기용 문자열. 문자열/템플릿리터럴은 cooked 값, 그 외 표현식은 원문.
function nodeText(node) {
  if (!node) return '';
  if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
    return node.getLiteralValue();
  }
  if (Node.isTemplateExpression(node)) {
    let out = node.getHead().getLiteralText();
    for (const span of node.getTemplateSpans()) {
      out += '${' + span.getExpression().getText() + '}';
      out += span.getLiteral().getLiteralText();
    }
    return out;
  }
  return node.getText();
}

function prop(obj, name) {
  const p = obj.getProperty(name);
  if (!p) return undefined;
  if (Node.isPropertyAssignment(p)) return p.getInitializer();
  if (Node.isShorthandPropertyAssignment(p)) return p.getNameNode();
  return undefined;
}

function parseButtons(obj) {
  const buttons = [];
  for (let i = 1; i <= 5; i++) {
    const b = prop(obj, `button${i}`);
    if (!b || !Node.isObjectLiteralExpression(b)) continue;
    buttons.push({
      name: nodeText(prop(b, 'name')),
      type: nodeText(prop(b, 'type')) || 'WL',
      url_mobile: nodeText(prop(b, 'url_mobile')),
      url_pc: nodeText(prop(b, 'url_pc')),
      scheme_ios: nodeText(prop(b, 'scheme_ios')),
      scheme_android: nodeText(prop(b, 'scheme_android')),
    });
  }
  return buttons;
}

function parseItems(obj) {
  const result = {
    itemList: [],
    itemHighlightTitle: '',
    itemHighlightDescription: '',
  };
  const items = prop(obj, 'items');
  if (!items || !Node.isObjectLiteralExpression(items)) return result;

  const item = prop(items, 'item');
  if (item && Node.isObjectLiteralExpression(item)) {
    const list = prop(item, 'list');
    if (list && Node.isArrayLiteralExpression(list)) {
      for (const el of list.getElements()) {
        if (Node.isObjectLiteralExpression(el)) {
          result.itemList.push({
            title: nodeText(prop(el, 'title')),
            description: nodeText(prop(el, 'description')),
          });
        }
      }
    }
  }
  const hl = prop(items, 'itemHighlight');
  if (hl && Node.isObjectLiteralExpression(hl)) {
    result.itemHighlightTitle = nodeText(prop(hl, 'title'));
    result.itemHighlightDescription = nodeText(prop(hl, 'description'));
  }
  return result;
}

function toTemplate(obj) {
  const header = nodeText(prop(obj, 'header'));
  const title = nodeText(prop(obj, 'title'));
  const { itemList, itemHighlightTitle, itemHighlightDescription } =
    parseItems(obj);

  const isItemList =
    !!header || itemList.length > 0 || !!itemHighlightTitle;
  const emphasize = isItemList ? 'ITEM_LIST' : title ? 'TEXT' : 'NONE';

  const messageType = nodeText(prop(obj, 'message_type')) === 'AI' ? 'AI' : 'AT';

  return {
    category: '',
    profileExpr: nodeText(prop(obj, 'profile')) || 'ENV.BIZMSG.PROFILE_ID',
    tmplId: nodeText(prop(obj, 'tmplId')),
    messageType,
    phoneVar: nodeText(prop(obj, 'phn')) || 'phone',
    emphasize,
    header,
    title,
    itemList,
    itemHighlightTitle,
    itemHighlightDescription,
    msg: nodeText(prop(obj, 'msg')),
    additionalContent: nodeText(prop(obj, 'additional_content')),
    buttons: parseButtons(obj),
    topImageUrl: '',
    highlightThumbnailUrl: '',
  };
}

async function run() {
  const entries = [];

  for (const repo of REPOS) {
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
      compilerOptions: { allowJs: false, noEmit: true },
    });
    project.addSourceFilesAtPaths(`${repo.root}/src/**/*.ts`);

    let count = 0;
    for (const sf of project.getSourceFiles()) {
      sf.forEachDescendant((node) => {
        if (!Node.isCallExpression(node)) return;
        const callee = node.getExpression().getText();
        if (!callee.endsWith('sendAlimtalk')) return;
        const arg = node.getArguments()[0];
        if (!arg || !Node.isObjectLiteralExpression(arg)) return;

        const template = toTemplate(arg);
        if (!template.tmplId) return; // tmplId 없는 호출은 스킵

        const rel = path.relative(repo.root, sf.getFilePath());
        entries.push({
          id: `${repo.name}:${template.tmplId}`,
          project: repo.name,
          sourceFile: rel,
          rawCode: node.getText(),
          savedAt: new Date().toISOString(),
          template,
        });
        count++;
      });
    }
    console.log(`  ${repo.name}: ${count} templates`);
  }

  // id 중복 제거 (같은 tmplId 여러 호출부 → 마지막 것 유지)
  const byId = new Map();
  for (const e of entries) byId.set(e.id, e);
  const list = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(list, null, 2) + '\n', 'utf8');
  console.log(`\n✓ ${list.length} templates → ${path.relative(process.cwd(), OUT)}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
