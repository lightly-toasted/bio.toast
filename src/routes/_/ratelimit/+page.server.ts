import { getAuthUrl } from '$lib/authorize';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../callback/$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    if (cookies.get('accessToken')) throw redirect(302, getAuthUrl(url.searchParams.get('state')))
    return { status: 429 }
};