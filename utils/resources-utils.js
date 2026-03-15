import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import rehypeUnwrapImages from 'rehype-unwrap-images';

export const RESOURCES_PATH = path.join(process.cwd(), 'resources');

export const getResourceFilePaths = () => {
  return fs
    .readdirSync(RESOURCES_PATH)
    .filter((path) => /\.mdx?$/.test(path));
};

export const sortResourcesByDate = (resources) => {
  return resources.sort((a, b) => {
    const aDate = new Date(a.data.date);
    const bDate = new Date(b.data.date);
    return bDate - aDate;
  });
};

export const getResources = () => {
  let resources = getResourceFilePaths().map((filePath) => {
    const source = fs.readFileSync(path.join(RESOURCES_PATH, filePath));
    const { content, data } = matter(source);

    return {
      content,
      data,
      filePath,
    };
  });

  resources = sortResourcesByDate(resources);

  return resources;
};

export const getResourceBySlug = async (slug) => {
  const resourceFilePath = path.join(RESOURCES_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(resourceFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism, rehypeUnwrapImages],
    },
    scope: data,
  });

  return { mdxSource, data, resourceFilePath };
};

export const getNextResourceBySlug = (slug) => {
  const resources = getResources();
  const currentFileName = `${slug}.mdx`;
  const currentResource = resources.find(
    (resource) => resource.filePath === currentFileName
  );
  const currentResourceIndex = resources.indexOf(currentResource);

  const resource = resources[currentResourceIndex - 1];
  if (!resource) return null;

  const nextResourceSlug = resource?.filePath.replace(/\.mdx?$/, '');

  return {
    title: resource.data.title,
    slug: nextResourceSlug,
  };
};

export const getPreviousResourceBySlug = (slug) => {
  const resources = getResources();
  const currentFileName = `${slug}.mdx`;
  const currentResource = resources.find(
    (resource) => resource.filePath === currentFileName
  );
  const currentResourceIndex = resources.indexOf(currentResource);

  const resource = resources[currentResourceIndex + 1];
  if (!resource) return null;

  const previousResourceSlug = resource?.filePath.replace(/\.mdx?$/, '');

  return {
    title: resource.data.title,
    slug: previousResourceSlug,
  };
};
