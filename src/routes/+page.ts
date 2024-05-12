import type { Load } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: Load = async () => {
    throw redirect(307, '/lightly-toasted')
}