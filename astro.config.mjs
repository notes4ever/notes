import tailwind from '@astrojs/tailwind';
import {defineConfig} from 'astro/config';
import dayjs from 'dayjs';
import fs from 'fs';
import {parse} from 'node-html-parser';

import rehypeCustomizeImageSrc from './rehype-customize-image-src.js';
import {SITE} from './src/config';

const DEFAULT_FORMAT = 'YYYY/MM/DD';
const WEEKLY_REPO_NAME = 'tw93/weekly';

function formatDate(date) {
  return dayjs(date).format(DEFAULT_FORMAT);
}

function getFileCreateDate(filePath) {
  return formatDate(fs.statSync(filePath).birthtime);
}

function getWeeklyDate() {
  return getFileCreateDate(filePath);
}

function defaultLayoutPlugin() {
  return function(tree, file) {
    const filePath = file.history[0];
    const {frontmatter} = file.data.astro;
    frontmatter.layout = '@layouts/post.astro';

    if (tree.children[0]?.value && !frontmatter.pic) {
      const imageElement = parse(tree.children[0].value).querySelector('img');
      frontmatter.pic = imageElement.getAttribute('src');
    }

    if (tree.children[1]?.children[1]?.value) {
      frontmatter.desc = tree.children[1].children[1].value;
    }

    frontmatter.desc = frontmatter.desc || SITE.description;
    frontmatter.pic = frontmatter.pic || SITE.pic;

    if (!frontmatter.date) {
      const postNumber = filePath.split('/posts/')[1]?.split('-')[0];
      frontmatter.date = SITE.repo === WEEKLY_REPO_NAME ?
          getWeeklyDate() :
          getFileCreateDate(filePath);
    }

    if (SITE.repo === WEEKLY_REPO_NAME) {
      const postNumber = filePath.split('/posts/')[1]?.split('-')[0];
    }
  };
}

export default defineConfig({
  prefetch: true,
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [defaultLayoutPlugin],
    rehypePlugins: [rehypeCustomizeImageSrc],
  },
});
