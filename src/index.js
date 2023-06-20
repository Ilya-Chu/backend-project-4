#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import cheerio from 'cheerio';

const downloadPage = async (url, outputDir = process.cwd()) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileName = `${url.replace(/https?:\/\//i, '').replace(/[^a-zA-Z0-9]/g, '-')}.html`;
    const filePath = path.join(outputDir, fileName);
    const $ = cheerio.load(response.data);

    // Скачивание и изменение ссылок на изображения
    const imagePromises = $('img').map(async (index, element) => {
      const imageUrl = $(element).attr('src');
      const imageFileName = `${imageUrl.replace(/https?:\/\//i, '').replace(/[^a-zA-Z0-9]/g, '-')}`;
      const imageFilePath = path.join(outputDir, `${fileName.replace('.html', '_files')}`, imageFileName);

      // Скачивание изображения
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(imageFilePath, imageResponse.data);

      // Изменение ссылки на скачанное изображение
      $(element).attr('src', `${fileName.replace('.html', '_files')}/${imageFileName}`);
    }).get();

    await Promise.all(imagePromises);

    // Сохранение измененного HTML
    await fs.writeFile(filePath, $.html());
    console.log(path.resolve(filePath));
    return;
  } catch (error) {
    console.error(`Failed to download the page: ${error.message}`);
    throw error;
  }
};

export default downloadPage;
