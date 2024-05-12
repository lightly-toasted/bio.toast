<script lang="ts">
    import type { PageData } from './$types';
	export let data: PageData;
    let preview: boolean;

    import { onMount } from 'svelte';
    onMount(() => {
        preview = !!new URLSearchParams(window.location.search).get('preview')
    });

    function getSocialLinks() {
        let socialLinks: { [key: string]: string } = {}
        socialLinks['github'] = data.github.html_url
        socialLinks = {...socialLinks, ...data.config.social}
        if (data.github.email && !socialLinks.email) socialLinks['email'] = `mailto:${data.github.email}`
        return socialLinks
    }
</script>

<svelte:head>
    <link id="styles" rel="stylesheet" href="{data.styles}">
</svelte:head>

<div id="container">
    <div id="github">
        <img src="{data.github.avatar_url}" alt="GitHub profile" width="100" height="100"/>
        <h1 id="name">{data.config.name || data.github.name}</h1>
        <h2 id="github-username">@{data.config.description || data.github.login}</h2>
        <p id="description">{data.github.bio}</p> 
    </div>
    <hr id="github-separator">
    <div id="repos">
        <h2>Repositories <span id="repos-count">({data.repos.count})</span></h2>
        <ul id="repos-list">
            {#if data.repos.list}
                {#each data.repos.list as repo}
                <li><a href="{repo.html_url}" id="repo">{repo.full_name}</a></li>
                {/each}
            {:else}
            <p>Failed to load repositories.</p>
            {/if}
        </ul>
    </div>
    {#if data.discord.success && data.discord.data}
        <div id="discord">
            <img src="https://cdn.discordapp.com/avatars/{data.discord.data.discord_user.id}/{data.discord.data.discord_user.avatar}" alt="Discord profile" width="100" height="100"/>
            <h3 id="discord-display">{data.discord.data.discord_user.global_name}</h3>
            <h4 id="discord-username">{data.discord.data.discord_user.username}</h4>
            <p id="discord-status" data-status="{data.discord.data.discord_status}">{data.discord.data.discord_status}</p>
        </div>
        <hr id="discord-separator">
    {/if}
    <div id="social">
        <h2 id="social-title">Social media</h2>
        <ul id="social-links">
            {#each Object.entries(getSocialLinks()) as [app, link]}
                {#if link}
                <li><a href="{link}" id="social-link" data-app="{app}">{app}</a></li>
                {/if}
            {/each}
        </ul>
    </div>
    {#if preview}
        <div id="preview">
            <h2>Preview</h2>
            <p>You are previewing your customization files. To reload, use Back button (&#x2B05;) in your web browser or click <button on:click={() => {window.history.back()}}>Reload</button>.</p>
        </div>
    {/if}
</div>