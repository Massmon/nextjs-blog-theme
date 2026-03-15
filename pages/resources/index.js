import Link from 'next/link';
import { getResources } from '../../utils/resources-utils';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Layout, { GradientBackground } from '../../components/Layout';
import ArrowIcon from '../../components/ArrowIcon';
import { getGlobalData } from '../../utils/global-data';
import SEO from '../../components/SEO';

export default function Resources({ resources, globalData }) {
  return (
    <Layout>
      <SEO
        title={`Resources - ${globalData.name}`}
        description="Helpful guides, references, and tools"
      />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="mb-4 text-3xl text-center lg:text-5xl">Resources</h1>
        <p className="mb-12 text-lg text-center opacity-60">
          Guides, references, and tools to help you build better.
        </p>
        <ul className="w-full">
          {resources.map((resource) => (
            <li
              key={resource.filePath}
              className="transition border border-b-0 bg-white/10 border-gray-800/10 md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/50 dark:border-white/10 last:border-b"
            >
              <Link
                as={`/resources/${resource.filePath.replace(/\.mdx?$/, '')}`}
                href={`/resources/[slug]`}
                className="block px-6 py-6 lg:py-10 lg:px-16 focus:outline-hidden focus:ring-4 focus:ring-primary/50"
              >
                {resource.data.category && (
                  <p className="mb-3 font-bold uppercase opacity-60">
                    {resource.data.category}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl">
                  {resource.data.title}
                </h2>
                {resource.data.description && (
                  <p className="mt-3 text-lg opacity-60">
                    {resource.data.description}
                  </p>
                )}
                <ArrowIcon className="mt-4" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export function getStaticProps() {
  const resources = getResources();
  const globalData = getGlobalData();

  return { props: { resources, globalData } };
}
