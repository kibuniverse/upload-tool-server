import fs from "fs";
import resolvePost from "../utils/resolves-post";
import pipeStream from "../utils/pipe-stream";
import { IP } from "../config";

export default async function (req, res) {
  console.log("====> 收到合并请求");
  const data: any = await resolvePost(req);
  console.log(data);
  await mergeFileChunks(data);
  res.send(
    JSON.stringify({
      ok: 1,
      msg: "合并完成",
      url: `http://${IP}:8001/${data.newname}`,
    })
  );
  res.end();
}

const mergeFileChunks = async (data) => {
  const chunksDir = __dirname + `/uploads/${data.fileName}`;
  fs.readdir(chunksDir, async (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const chunkFilesPath = files.map((item) => `${chunksDir}/${item}`);
    chunkFilesPath.sort(compareFun);
    await Promise.all(
      /**
       * 异步的将每一个文件item写入创建的文件可写流里
       */
      chunkFilesPath.map((item, index) =>
        pipeStream(
          item,
          fs.createWriteStream(`${__dirname}/files/${data.newname}`, {
            flags: "a+",
            start: index * data.chunkSize,
          })
        )
      )
    );

    fs.rmdirSync(chunksDir, { recursive: true });
  });
};

const compareFun = (value1, value2) => {
  let v1 = parseInt(value1.split("_")[value1.split("_").length - 1]);
  let v2 = parseInt(value2.split("_")[value2.split("_").length - 1]);
  return v1 - v2;
};
