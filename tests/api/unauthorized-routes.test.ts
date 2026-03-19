import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { GET as assignmentsGET } from '@/app/api/assignments/route';
import { GET as sessionsGET } from '@/app/api/sessions/route';
import { GET as feedbackGET } from '@/app/api/feedback/route';
import { GET as goalsGET } from '@/app/api/goals/route';
import { GET as filesGET } from '@/app/api/files/route';
import { DELETE as fileDelete } from '@/app/api/files/[id]/route';

function makeRequest(path: string, method = 'GET') {
  return new NextRequest(new Request(`http://localhost${path}`, { method }));
}

describe('API unauthorized access checks', () => {
  it('rejects unauthenticated access for core list APIs', async () => {
    const responses = await Promise.all([
      assignmentsGET(makeRequest('/api/assignments')),
      sessionsGET(makeRequest('/api/sessions')),
      feedbackGET(makeRequest('/api/feedback')),
      goalsGET(makeRequest('/api/goals')),
      filesGET(makeRequest('/api/files')),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
    }
  });

  it('rejects unauthenticated delete on files API', async () => {
    const response = await fileDelete(makeRequest('/api/files/abc', 'DELETE'), {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(response.status).toBe(401);
  });
});
