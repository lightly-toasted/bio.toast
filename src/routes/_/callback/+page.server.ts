import { PUBLIC_CLIENT_ID } from '$env/static/public';
import { CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../callback/$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    if (!code) return { status: 400, body: 'Invalid request' };

    const accessTokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: PUBLIC_CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
        }),
    });

    const accessTokenData = await accessTokenResponse.json();
    if (accessTokenData.error) return accessTokenResponse

    const token = accessTokenData.access_token
    cookies.set('accessToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        path: '/'
    })

    throw redirect(302, '/_/self')
}