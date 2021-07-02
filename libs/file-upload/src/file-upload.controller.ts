import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "./helpers";
import { pathToUploadedFiles } from "./constants";
import { FileUploadService } from "./file-upload.service";


@Controller("/uploads")
export class FileUploadController {

  constructor(private fileUploadService: FileUploadService) {
  }

  @Post("")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: pathToUploadedFiles,
        filename: editFileName
      }),
      fileFilter: imageFileFilter
    })
  )
  async uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.saveFile(file);
  }

  @Post("multiple")
  @UseInterceptors(
    FilesInterceptor("images[]", 20, {
      storage: diskStorage({
        destination: pathToUploadedFiles,
        filename: editFileName
      }),
      fileFilter: imageFileFilter
    })
  )
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileUploadService.saveMultipleFiles(files);
  }
}