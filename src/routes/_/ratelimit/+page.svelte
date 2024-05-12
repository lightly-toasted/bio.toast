<script lang="ts">
    let button: HTMLButtonElement;
    let state: string | null;
    let personalToken: string;
    import { getAuthUrl } from '$lib/authorize';
    import { onMount } from 'svelte';
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        state = urlParams.get('state');
        button.disabled = false
    })
</script>

<div>
    <h1>Create your own bio</h1>
    <p>To see another bios, you must create your own bio.</p>
    <p>...Actually 🤓 you don't have to create one to see another bios, but GitHub rate-limits you.</p>
    <p>By authorizing this OAuth app, you will be automatically prompted to re-authorize this app when you get rate-limited.</p>
    <button bind:this={button} disabled on:click={() => {location.href = getAuthUrl(state)}}>Continue</button>
    <hr />
    <details>
        <summary>EXPERIMENTAL: Login with personal access token</summary>
        <p>You can use your own <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens">personal access token</a> if you have trouble with OAuth.<br>⚠️ Not recommended. Use OAuth app if possible.</p>
        <form action="/api/loginWithPAT" method="post">
            <label for="token">Personal Access Token:</label>
            <input bind:value={personalToken} type="password" id="token" name="token" placeholder="personal-access-token" required>
            <button type="submit">Continue</button>
            <small>You will be redirected back here if your token does not work.</small>
        </form>
    </details>
</div>