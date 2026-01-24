
  import { MetadataRoute } from 'next';
  import { getAllTrips } from '@/lib/mongo/trips';
  import { getPosts } from '@/lib/mongo/blog';

  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.mongoltrail.com';

    // 1. Static Routes   
    const locales = ['mn', 'en', 'ko'];
    const routes = [
      '',
      '/about',
      '/packages',
      '/packages/europe',
      '/packages/mongolia',
      '/blog',
      '/contact',
      '/faq',
    ];

    // 1. Static Routes with Localized Variants
    const staticRoutes: MetadataRoute.Sitemap = [];

    for (const route of routes) {
      for (const locale of locales) {
        staticRoutes.push({
          url: `${baseUrl}/${locale}${route}`,
          lastModified: new Date(),
          changeFrequency: route === '' ? 'daily' : route === '/contact' ? 'yearly' : 'monthly',
          priority: route === '' ? 1 : 0.8,
        });
      }
    }

    // 2. Dynamic Routes: Trips
    let tripRoutes: MetadataRoute.Sitemap = [];
    try {
      const trips = await getAllTrips();
      for (const trip of trips) {
        for (const locale of locales) {
          tripRoutes.push({
            url: `${baseUrl}/${locale}/tours/${trip._id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    } catch (error) {
      console.error('Sitemap Error: Failed to fetch trips', error);
    }

    // 3. Dynamic Routes: Blog Posts
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
      const posts = await getPosts();
      for (const post of posts) {
        for (const locale of locales) {
          blogRoutes.push({
            url: `${baseUrl}/${locale}/blog/${post._id}`,
            lastModified: new Date(post.date || new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    } catch (error) {
      console.error('Sitemap Error: Failed to fetch posts', error);
    }

    return [...staticRoutes, ...tripRoutes, ...blogRoutes];
  }
