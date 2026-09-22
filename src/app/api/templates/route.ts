import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import type { SavedTemplate } from '../../../types';

const FILE = path.join(process.cwd(), 'data', 'templates.json');

async function readAll(): Promise<SavedTemplate[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as SavedTemplate[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(list: SavedTemplate[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2) + '\n', 'utf8');
}

export async function GET() {
  const list = await readAll();
  return NextResponse.json(list);
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

  const list = await readAll();
  const idx = list.findIndex((t) => t.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);

  try {
    await writeAll(list);
  } catch (e) {
    // 배포 환경(읽기 전용 FS)에서는 저장 불가 — 로컬에서 저장 후 커밋하세요
    return NextResponse.json(
      {
        error:
          '저장에 실패했습니다. 배포본은 열람 전용이며, 로컬에서 실행해 저장 후 커밋하세요.',
        detail: String(e),
      },
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
  const list = await readAll();
  const next = list.filter((t) => t.id !== id);
  try {
    await writeAll(next);
  } catch (e) {
    return NextResponse.json(
      { error: '삭제에 실패했습니다.', detail: String(e) },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
