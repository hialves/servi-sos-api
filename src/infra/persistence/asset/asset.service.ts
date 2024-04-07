import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { PaginatedDto } from '../../../presentation/dto/list/filter-input.dto';
import { PaginatedList } from '../../../presentation/dto/list/paginated-list';
import { responseMessages } from '../../../application/messages/response.messages';
import { ID } from '../../../domain/entities';
import { PrismaService } from '../prisma/prisma.service';
import { Asset } from '@prisma/client';

@Injectable()
export class AssetService implements OnApplicationBootstrap {
  private logger = new Logger('AssetService');

  constructor(private prisma: PrismaService) {}

  private get repository() {
    return this.prisma.asset;
  }

  onApplicationBootstrap() {
    this.checkSourcePath();
  }

  async create(file: Express.Multer.File): Promise<Asset> {
    const uniqueFilename = this.getUniqueFilename(file.filename);
    const filepath = AssetService.getFilepath(uniqueFilename);
    const source = filepath.split(AssetService.assetsPath)[0];

    try {
      await this.saveFile(file.stream, filepath);
      const data = {
        filename: uniqueFilename,
        mimeType: file.mimetype,
        source,
      };

      return this.repository.create({ data });
    } catch (error) {
      await this.deleteFile(filepath);
      throw error;
    }
  }

  async findAll(filters?: PaginatedDto): Promise<PaginatedList<Asset>> {
    const totalItems = await this.repository.count();
    const items = await this.repository.findMany(filters);

    return new PaginatedList(items, totalItems);
  }

  async findOne(id: ID): Promise<Asset | null> {
    return this.repository.findUnique({ where: { id } });
  }

  private saveFile(stream: Readable, filepath: fs.PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
      const write = fs.createWriteStream(filepath);
      stream
        .pipe(write)
        .on('finish', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private deleteFile(filepath: fs.PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filepath)) return reject(responseMessages.notFound(responseMessages.file.entity));
      if (!fs.statSync(filepath).isFile()) return reject(responseMessages.file.notFile);

      fs.rm(filepath, (error) => {
        if (error) return reject(error);
        else return resolve();
      });
    });
  }

  getUniqueFilename(filename: string): string {
    const { name: filenameWithoutExtension, ext: extension } = path.parse(filename);

    let normalizedFilename: string;
    let ordering = 0;
    do {
      const toNormalize = ordering > 0 ? `${filenameWithoutExtension}__${ordering}${extension}` : filename;
      normalizedFilename = this.normalizeString(toNormalize, '-');
      ordering++;
    } while (!fs.existsSync(AssetService.getFilepath(normalizedFilename)));

    return normalizedFilename;
  }

  private checkSourcePath() {
    if (!fs.existsSync(AssetService.sourcePath)) {
      fs.mkdir(AssetService.sourcePath, (err) => {
        this.logger.error(err);
      });
    }
  }

  static get staticPath() {
    return path.join(process.cwd(), 'static');
  }

  static get assetsPath() {
    return path.join(this.staticPath, 'assets');
  }

  static get sourcePath() {
    return path.join(this.assetsPath, 'source');
  }

  static get previewPath() {
    return path.join(this.assetsPath, 'preview');
  }

  static getFilepath(filename: string) {
    return path.join(this.sourcePath, filename);
  }

  /**
   * Credits to:
   * Normalizes a string to replace non-alphanumeric and diacritical marks with
   * plain equivalents.
   * Based on https://stackoverflow.com/a/37511463/772859
   */
  normalizeString(input: string, spaceReplacer = ' ') {
    return (input || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[!"£$%^&*()+[\]{};:@#~?\\/,|><`¬'=‘’]/g, '')
      .replace(/\s+/g, spaceReplacer);
  }
}
