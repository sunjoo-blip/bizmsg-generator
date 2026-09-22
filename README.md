# 비즈엠 알림톡 코드 생성기

BizM 알림톡 템플릿을 입력하면 **`sendAlimtalk` 코드**와 **카카오톡 미리보기**를 실시간으로 만들어주고,
자주 쓰는 템플릿을 **라이브러리에 저장**해두는 사내 도구입니다.

- 프레임워크: Next.js 16 (App Router)
- 저장소: `data/templates.json` (레포 커밋 → git 으로 팀 공유, DB 없음)

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
```

## 라이브러리 저장 방식

- 앱의 **저장** 버튼 → `POST /api/templates` → `data/templates.json` 에 기록됩니다.
- 저장 후 **git 커밋**하면 팀 전체에 공유되고 버전 관리됩니다.
- 배포본(Vercel 등)은 파일시스템이 읽기 전용이라 **열람 전용**입니다. 저장은 로컬 실행에서 하세요.
- 나중에 배포 사이트에서 바로 저장하고 싶어지면 `src/app/api/templates/route.ts` 의
  파일 입출력만 DB(Supabase/Vercel Postgres 등)로 교체하면 됩니다.

## 초기 시딩 (obud-api-v2 / onstudio-api)

두 API 레포의 `sendAlimtalk(...)` 호출부를 스캔해 `data/templates.json` 을 한 번에 채웁니다.

```bash
node scripts/seed-templates.mjs
```

- 경로는 `scripts/seed-templates.mjs` 상단 `REPOS` 에서 조정하세요.
- 코드의 `${expr}` / 함수 호출은 미리보기 정확도가 떨어질 수 있어, 시딩된 항목은
  **원본 코드(원본 코드 탭)** 를 함께 보여줍니다. 폼을 수정하면 생성 코드로 전환됩니다.
- 이 스크립트는 1회성 보조 도구입니다. 이후 신규 알림톡은 앱에서 입력·저장하세요.

## 구조

```
src/
  app/
    page.tsx              생성기 + 라이브러리 (client)
    layout.tsx
    globals.css
    api/templates/route.ts  GET / POST / DELETE (data/templates.json)
  components/             TemplateForm · KakaoPreview · CodeOutput · LibraryPanel · ImagePickerModal
  lib/generateCode.ts     Template → sendAlimtalk 코드
  types.ts                Template · SavedTemplate · 이미지 프리셋
data/templates.json       저장된 템플릿 (커밋 대상)
scripts/seed-templates.mjs  1회성 시딩 파서 (ts-morph)
```
