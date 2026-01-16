import type { APIRoute } from 'astro';

const pages = [
  { url: '', priority: 1.0, changefreq: 'weekly' },
  { url: 'work', priority: 0.9, changefreq: 'monthly' },
  { url: 'research', priority: 0.9, changefreq: 'monthly' },
  { url: 'music', priority: 0.9, changefreq: 'monthly' },
  { url: 'projects', priority: 0.8, changefreq: 'monthly' },
  { url: 'about', priority: 0.7, changefreq: 'monthly' },
  { url: 'contact', priority: 0.6, changefreq: 'yearly' },
  { url: 'agents', priority: 0.5, changefreq: 'yearly' },
];

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() || 'https://ashwinphilips.com';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.url ? `/${page.url}` : ''}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
