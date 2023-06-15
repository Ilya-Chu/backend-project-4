#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const downloadPage = async (url, outputDir = process.cwd()) => {
  try {
    const response = await axios.get(url);
    const fileName = `${url.replace(/https?:\/\//i, '').replace(/[^a-zA-Z0-9]/g, '-')}.html`;
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, response.data);
    console.log(path.resolve(filePath));
    return;
  } catch (error) {
    console.error(`Failed to download the page: ${error.message}`);
    throw error;
  }
};

export default downloadPage;
