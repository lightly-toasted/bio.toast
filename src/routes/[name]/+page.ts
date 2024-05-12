import type { Load } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';

function decodeBase64(encodedString: string) {
  const binaryString = atob(encodedString);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8');
  const result = decoder.decode(bytes);
  return result;
}

export const load: Load = async ({ url, params, fetch, parent }) => {
  const preview = url.searchParams.get('preview')?.split('|');
  let styles;
  let config;
  
  if (preview) { 
    styles = decodeBase64(preview[0])
    config = JSON.parse(decodeBase64(preview[1]))
  } else {
    const repoURL = `https://raw.githubusercontent.com/${params.name}/my-bio.toast/main`

    const stylesResponse = await fetch(`${repoURL}/styles.css`)
    styles = stylesResponse.ok ? await stylesResponse.text() : 'classless.css';

    const configResponse = await fetch(`${repoURL}/bio.toast.json`)
    config = configResponse.ok ? await configResponse.json() : {};
  }

  const { token } = await parent();
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

  const githubUsername = config.github?.username || params.name
  const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}`, { headers })
  if (githubResponse.status === 403) throw redirect(303, `/_/ratelimit?state=${params.name}`)
  if (!githubResponse.ok) throw error(404, `User ${params.name} not found.`)
  const github = await githubResponse.json()

  const reposResponse = await fetch(github.repos_url)
  const reposList = reposResponse.ok ? await reposResponse.json() : null
  const repos = {
    count: github.public_repos,
    list: reposList
  }

  const discordId = config.discord?.id
  const apiBaseURL = config.discord?.['lanyard-api-base-url'] || 'https://api.lanyard.rest/v1'

  const discordResponse = await fetch(`/_/api/discord/${discordId}?baseUrl=${apiBaseURL}`)
  const discord = await discordResponse.json()

  return {
    styles,
    config,
    github,
    repos,
    discord,
  }
};