import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../callback/$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('accessToken');
    if (!token) throw redirect(302, `/_/ratelimit`)

    const res = await fetch('https://api.github.com/user', { headers: { 'Authorization': `Bearer ${token}` } })

    throw redirect(302, `/${(await res.json()).login}`)
}