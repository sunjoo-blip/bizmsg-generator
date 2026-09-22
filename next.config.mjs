import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이 프로젝트 폴더를 Turbopack 루트로 고정 (상위 yarn.lock 오탐 방지)
  turbopack: {
    root: __dirname,
  },
  // Next 가 AGENTS.md / CLAUDE.md 를 자동 생성하지 않도록
  agentRules: false,
  images: {
    // 카카오 이미지 미리보기는 일반 <img> 로 로드하므로 next/image 최적화 미사용
    unoptimized: true,
  },
};

export default nextConfig;
