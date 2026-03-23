import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    site: 'https://cindyuuu11-cmd.github.io',
    base: '/my-first-website',
    integrations: [react(), tailwind()]
});
