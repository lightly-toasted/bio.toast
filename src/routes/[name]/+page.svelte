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
        if (data.github.twitter_username && !socialLinks.twitter) socialLinks['twitter'] = `https://twitter.com/${data.github.twitter_username}`
        if (data.github.blog && !socialLinks.website) socialLinks['website'] = data.github.blog
        return socialLinks
    }
</script>

<svelte:head>
    <link id="styles" rel="stylesheet" href="{data.styles}">
</svelte:head>

<div id="container">
    <div id="github">
        <img src="{data.github.avatar_url}" alt="GitHub profile" width="100" height="100"/>
        <div id="profile-info">
            <h1 id="name">{data.config.name || data.github.name}</h1>
            <h2 id="github-username">@{data.config.description || data.github.login}</h2>
            {#if data.config.pronouns}
            <p id="pronouns">{data.config.pronouns}</p>
            {/if}
            <p id="description">{data.github.bio}</p> 
        </div>
    </div>
    <hr id="github-separator">
    <div id="repos">
        <h2>Repositories <span id="repos-count">{data.repos.count}</span></h2>
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
    <hr id="repos-separator">
    {#if data.discord.success && data.discord.data}
        <div id="discord">
            <h2 id="discord-title">Discord</h2>
            <img src="https://cdn.discordapp.com/avatars/{data.discord.data.discord_user.id}/{data.discord.data.discord_user.avatar}" alt="Discord profile" width="100" height="100"/>
            <div id="discord-user">
                <h3 id="discord-display">{data.discord.data.discord_user.global_name}</h3>
                <h4 id="discord-username">{data.discord.data.discord_user.username}</h4>
            </div>
            <p id="discord-status" data-status="{data.discord.data.discord_status}">{data.discord.data.discord_status}</p>
            <a href="https://discord.com/users/{data.discord.data.discord_user.id}">profile</a>
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