# 비즈엠 알림톡 코드 생성기

BizM 알림톡 템플릿을 입력하면 **`sendAlimtalk` 코드**와 **카카오톡 미리보기**를 실시간으로 만들어주고,
자주 쓰는 템플릿을 **라이브러리에 저장**해두는 사내 도구입니다.

- 프레임워크: Next.js 16 (App Router)
- 저장소: **Redis** (`REDIS_URL`). env 가 없으면 로컬 `data/templates.json` 파일로 폴백.

## 개발

```bash
npm install
vercel env pull .env.local   # REDIS_URL 등 환경변수 가져오기 (선택)
npm run dev                  # http://localhost:3000
```

## 라이브러리 저장 방식

- 앱의 **저장** 버튼 → `POST /api/templates` → 저장소에 업서트됩니다.
- **`REDIS_URL` 이 설정돼 있으면 Redis 사용** → 배포본에서 저장해도 팀 전체에 즉시 반영됩니다.
- `REDIS_URL` 이 없으면 로컬 `data/templates.json` 파일에 저장(개발 폴백)됩니다.
- `data/templates.json` 은 **최초 시딩 소스**입니다. Redis 가 비어있을 때 이 파일의 내용으로
  한 번 채워지고, 이후 실데이터는 Redis 에 쌓입니다.
- 저장소 구현: `src/lib/store.ts` (백엔드 교체 지점).

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
