import fs, { WriteStream } from "fs";

export default function (item, writeStream: WriteStream): Promise<unknown> {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(item);
    readStream.on("end", () => {
      fs.unlinkSync(item);
      resolve(undefined);
    });
    readStream.pipe(writeStream);
  });
}
