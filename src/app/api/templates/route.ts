import { NextResponse } from 'next/server';
import type { SavedTemplate } from '../../../types';
import { getAll, upsert, remove } from '../../../lib/store';

export const dynamic = 'force-dynamic'; // 항상 최신 데이터 반환

export async function GET() {
  return NextResponse.json(await getAll());
}

// 저장(업서트) — id 기준. id 없으면 project:tmplId 로 생성
export async function POST(req: Request) {
  const body = (await req.json()) as SavedTemplate;
  if (!body?.template?.tmplId) {
    return NextResponse.json(
      { error: '템플릿 코드(tmplId)가 필요합니다.' },
      { status: 400 },
    );
  }
  const project = body.project || 'custom';
  const id = body.id || `${project}:${body.template.tmplId}`;
  const entry: SavedTemplate = {
    ...body,
    id,
    project,
    savedAt: new Date().toISOString(),
  };

  try {
    await upsert(entry);
  } catch (e) {
    return NextResponse.json(
      { error: '저장에 실패했습니다.', detail: String(e) },
      { status: 500 },
    );
  }
  return NextResponse.json(entry);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
  }
  try {
    await remove(id);
  } catch (e) {
    return NextResponse.json(
      { error: '삭제에 실패했습니다.', detail: String(e) },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
