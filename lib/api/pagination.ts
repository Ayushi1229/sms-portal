import { NextRequest } from 'next/server';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
}

export function shouldUsePagination(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url);
  return (
    searchParams.has('page') ||
    searchParams.has('pageSize') ||
    searchParams.get('paginated') === 'true'
  );
}

export function parsePagination(request: NextRequest): PaginationParams {
  const { searchParams } = new URL(request.url);
  const pageRaw = Number(searchParams.get('page') || DEFAULT_PAGE);
  const pageSizeRaw = Number(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : DEFAULT_PAGE;
  const pageSize =
    Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
      ? Math.min(Math.floor(pageSizeRaw), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
  };
}

export function paginatedResponse<T>(items: T[], total: number, page: number, pageSize: number) {
  return {
    items,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      hasNext: page * pageSize < total,
      hasPrev: page > 1,
    },
  };
}