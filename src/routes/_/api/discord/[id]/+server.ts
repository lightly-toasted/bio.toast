import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch, params }) => {
  const apiBaseURL = url.searchParams.get('baseUrl') || 'https://api.lanyard.rest/v1';
  return await fetch(`${apiBaseURL}/users/${params.id}`);
};