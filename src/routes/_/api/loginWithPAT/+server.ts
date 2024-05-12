import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const data = await request.json();
    const token = data.token;

    if (!token) return new Response(JSON.stringify({
        success: false,
        message: 'No token provided.'
    }));

    const res = await fetch('https://api.github.com/user', { headers: { 'Authorization': `Bearer ${token}` } })
    if (!res.ok) return new Response(JSON.stringify({
        success: false,
        message: 'Invalid token.'
    })); 

    cookies.set('accessToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        path: '/'
    })

    return new Response(JSON.stringify({
        success: true,
        message: (await res.json()).login
    }));
}