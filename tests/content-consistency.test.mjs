import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function source(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function markdownUnder(directory) {
  const visit = (relativeDirectory) =>
    readdirSync(path.join(root, relativeDirectory), {withFileTypes: true}).flatMap(
      (entry) => {
        const relativePath = path.join(relativeDirectory, entry.name);
        if (entry.isDirectory()) return visit(relativePath);
        return /\.(?:md|mdx)$/.test(entry.name) ? [relativePath] : [];
      },
    );
  return visit(directory);
}

const handbook = markdownUnder('docs')
  .map((relativePath) => source(relativePath))
  .join('\n');

test('operations handbook does not restore superseded platform claims', () => {
  const staleClaims = [
    /公司总群/,
    /倒计时设置\s*\|\s*`\/admin\/countdown`/,
    /`\/admin\/approvals`/,
    /还能把消息一键转成任务/,
    /只保留约?\s*300\s*条/,
    /预留了切换到 S3 \/ MinIO 的适配层/,
    /仅在你明确\s*`?@ai`?\s*时(?:调用|运行)/,
  ];

  for (const pattern of staleClaims) assert.doesNotMatch(handbook, pattern);

  assert.match(handbook, /当前版本没有 `\/admin\/countdown` 页面/);
  assert.match(handbook, /仓库尚未包含 S3 \/ MinIO 适配器/);
  assert.match(handbook, /环境参与[\s\S]{0,80}不能调用工具/);
});

test('project detail URLs resolve to checked-in blog posts', () => {
  const projects = source('src/data/projects.ts');
  const urls = [...projects.matchAll(/detailUrl:\s*'\/blog\/([^']+)'/g)].map(
    (match) => match[1],
  );
  const slugs = new Set(
    readdirSync(path.join(root, 'blog'))
      .filter((name) => /\.(?:md|mdx)$/.test(name))
      .map((name) => name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.(?:md|mdx)$/, '')),
  );

  assert.ok(urls.length > 0, 'expected at least one project detail URL');
  for (const slug of urls) {
    assert.ok(slugs.has(slug), `missing blog post for /blog/${slug}`);
  }
});

test('public copy omits unverified placeholders and uses the canonical domain', () => {
  const english = source('README.md');
  const chinese = source('README.zh-Hans.md');
  const siteData = source('src/data/site.ts');

  for (const readme of [english, chinese]) {
    assert.match(readme, /https:\/\/butian\.club/);
    assert.doesNotMatch(readme, /https?:\/\/butian-club\.github\.io(?:[/?#\s)]|$)/);
  }
  assert.doesNotMatch(siteData, /TODO/);
});

test('maintenance commands and cited result years stay aligned with repository content', () => {
  const english = source('README.md');
  const chinese = source('README.zh-Hans.md');
  const siteData = source('src/data/site.ts');

  for (const readme of [english, chinese]) assert.match(readme, /npm test/);
  assert.match(siteData, /2023-2025 GFSSM/);
});
