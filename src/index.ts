import express from "express";
import yaml from "js-yaml";
import { IP } from "./config";
import fs from "fs";

const app = express();

app.get("/", (req, res) => {
  const data = yaml.load(fs.readFileSync("t.yaml") as unknown as string);
  res.send(data);
  res.end();
});

app.all("/au", (req, res, next) => {
  res.send("身份鉴权成功");
  // res.end();
  next();
});

app.use("/au/a", (req, res) => {
  res.send("aua");
  res.end();
});

app.listen(8001, function () {
  console.log(`访问地址为 http://${IP}:8001`);
});
