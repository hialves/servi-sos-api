import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { AssetService } from './asset.service';

export const paths = {
  source: AssetService.sourcePath,
  preview: AssetService.previewPath,
};

export function generateFolders() {
  Object.entries(paths).forEach(([key, p]) => {
    fs.access(p, fs.constants.F_OK, (err) => {
      if (err) {
        const folderUri = p.split(process.cwd())[1].replace(/[\\]/g, '/');
        Logger.log(`Generating folder for ${key} on ${folderUri}`, 'Paths');
        fs.mkdir(p, { recursive: true }, (err) => err && console.info(err));
      }
    });
  });
}
