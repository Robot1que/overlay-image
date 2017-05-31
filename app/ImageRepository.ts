import 'electron';
import * as path from "path";
import * as fs from "fs";
import * as imageSize from 'image-size';

export class ImageInfo {
    constructor(
        readonly name: string,
        readonly path: string,
        readonly width: number,
        readonly height: number
    ) {
    }
}

export class ImageRepository {

    static ImagesGet(): ImageInfo[] {
        const imageInfos = new Array<ImageInfo>();
        const resourcesPath = process.resourcesPath as string;
        const imagesFolder = path.join(resourcesPath, "app", "images");
        const imageFileNames = fs.readdirSync(imagesFolder);

        for(const imageFileName of imageFileNames) {
            const imagePath = path.join(imagesFolder, imageFileName);
            const imageInfo = imageSize(imagePath);

            imageInfos.push(
                new ImageInfo(
                    imageFileName,
                    imagePath,
                    imageInfo.width,
                    imageInfo.height
                )
            )
        }

        return imageInfos;
    }

}

