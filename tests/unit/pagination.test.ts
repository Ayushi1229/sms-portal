import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { paginatedResponse, parsePagination, shouldUsePagination } from '@/lib/api/pagination';

function req(path: string) {
  return new NextRequest(new Request(`http://localhost${path}`));
}

describe('pagination utils', () => {
  it('detects pagination query params', () => {
    expect(shouldUsePagination(req('/api/goals'))).toBe(false);
    expect(shouldUsePagination(req('/api/goals?page=2'))).toBe(true);
    expect(shouldUsePagination(req('/api/goals?paginated=true'))).toBe(true);
  });

  it('parses page and pageSize safely', () => {
    const parsed = parsePagination(req('/api/goals?page=3&pageSize=25'));
    expect(parsed).toEqual({ page: 3, pageSize: 25, skip: 50 });
  });

  it('clamps invalid values to defaults and caps max page size', () => {
    const parsed = parsePagination(req('/api/goals?page=-2&pageSize=1000'));
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(100);
    expect(parsed.skip).toBe(0);
  });

  it('creates a consistent pagination payload', () => {
    const payload = paginatedResponse([{ id: 1 }, { id: 2 }], 12, 2, 5);
    expect(payload.items).toHaveLength(2);
    expect(payload.pagination.totalPages).toBe(3);
    expect(payload.pagination.hasNext).toBe(true);
    expect(payload.pagination.hasPrev).toBe(true);
  });
});
