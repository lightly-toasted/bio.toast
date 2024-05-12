import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public';

export const getAuthUrl = (state: string | null) => {
  return `https://github.com/login/oauth/authorize?client_id=${PUBLIC_CLIENT_ID}&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URI)}${state ? `&state=${state}` : ''}`;
}
