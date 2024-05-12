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

    // const configResponse = await fetch(`${repoURL}/bio.toast.json`)
    // const config = configResponse.ok ? await configResponse.json() : {};
    config = {
      "name": "",
      "description": "",
      "github": {
        "username": ""
      },
      "discord": {
        "id": "1167437052766322770",
        "lanyard-api-base-url": "https://api.lanyard.rest/v1",
      },
      "social": {
        "youtube": "https://youtube.com/a",
        "twitter": "https://twitter.com/a",
        "facebook": "https://facebook.com/a",
        "twitch": "https://twitch.com/a",
        "buymeacoffee": "https://buymeacoffee.com/tooast",
        "email": "mailto:me@toast.name"
      }
    }
  }

  const { token } = await parent();
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  console.log({headers})

  const githubUsername = config.github?.username || params.name
  const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}`, { headers })
  //console.log(github)
  //console.log(github.status)
  if (githubResponse.status === 403) throw redirect(303, `/_/ratelimit?state=${params.name}`)
  if (!githubResponse.ok) throw error(404, `User ${params.name} not found.`)
  const github = await githubResponse.json()
  
  // const github = {
  //   "login": "lightly-toasted",
  //   "id": 165365207,
  //   "node_id": "U_kgDOCdtF1w",
  //   "avatar_url": "https://avatars.githubusercontent.com/u/165365207?v=4",
  //   "gravatar_id": "",
  //   "url": "https://api.github.com/users/lightly-toasted",
  //   "html_url": "https://github.com/lightly-toasted",
  //   "followers_url": "https://api.github.com/users/lightly-toasted/followers",
  //   "following_url": "https://api.github.com/users/lightly-toasted/following{/other_user}",
  //   "gists_url": "https://api.github.com/users/lightly-toasted/gists{/gist_id}",
  //   "starred_url": "https://api.github.com/users/lightly-toasted/starred{/owner}{/repo}",
  //   "subscriptions_url": "https://api.github.com/users/lightly-toasted/subscriptions",
  //   "organizations_url": "https://api.github.com/users/lightly-toasted/orgs",
  //   "repos_url": "https://api.github.com/users/lightly-toasted/repos",
  //   "events_url": "https://api.github.com/users/lightly-toasted/events{/privacy}",
  //   "received_events_url": "https://api.github.com/users/lightly-toasted/received_events",
  //   "type": "User",
  //   "site_admin": false,
  //   "name": "toast",
  //   "company": null,
  //   "blog": "https://y.at/🍞🥐✨💻",
  //   "location": null,
  //   "email": null,
  //   "hireable": null,
  //   "bio": "🍞🍞🍞🍞",
  //   "twitter_username": null,
  //   "public_repos": 7,
  //   "public_gists": 1,
  //   "followers": 0,
  //   "following": 0,
  //   "created_at": "2024-03-29T06:58:41Z",
  //   "updated_at": "2024-05-04T00:13:44Z"
  // }

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