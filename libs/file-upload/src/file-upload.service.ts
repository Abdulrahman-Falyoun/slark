import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createThumbnail, getImageDimensions } from './helpers';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FileModel } from './file.model';
import * as path from 'path';
import { SLARK_FILE } from '../../../src/utils/schema-names';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel(SLARK_FILE) private readonly fileModel: Model<FileModel>,
    private configService: ConfigService,
  ) {}
  async saveFile(file: Express.Multer.File) {
    let createdFile;
    try {
      await createThumbnail(file, 200);

    } catch (e) {
      console.log('Resizing error: ', e.message || e);
      throw new BadRequestException({
        message: e.message || e,
      });
    }
    const port = this.configService.get<number>('port');
    const metadata = await getImageDimensions(file.path);
    createdFile = await this.fileModel.create({
      url: `http://localhost:${port}/images/${file.filename}`,
      thumbnail: `http://localhost:${port}/images/thumbnails/${file.filename}`,
      name: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      dest: file.destination,
      height: metadata.height,
      width: metadata.width,
      ext: path.extname(file.originalname),
    });
    return createdFile;
  }
  async saveMultipleFiles(files: Express.Multer.File[]) {
    try {
      const res = [];
      for (const file of files) {
        const { file: createdFile } = await this.saveFile(file);
        res.push(createdFile);
      }
      return res;
    } catch (e) {
      console.log({ e });
      throw new BadRequestException({
        message: e.message || e,
      });
    }
  }

  async getFile(filterQuery: FilterQuery<FileModel>) {
    return this.fileModel.findOne(filterQuery).then((f) => {
      if (!f) {
        throw new NotFoundException({
          error: `File not found`,
        });
      }
      return f;
    });
  }
}
