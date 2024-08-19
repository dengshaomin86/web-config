/**
 * 自动提交 git
 */

// const fs = require("fs");
// const { exec } = require("child_process");
// const inquirer = require("inquirer").default;
import fs from "fs";
import inquirer from "inquirer";
import { exec } from "child_process";

async function runcommand(command) {
  return new Promise((resolve, reject) => {
    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     reject(`执行 Git 初始化命令时出错：${error}`);
    //     return;
    //   }
    //   console.log(`Git 初始化成功：${stdout}`);
    //   resolve(true);
    // });

    const workerProcess = exec(command);
    let message = "";
    // 打印正常的后台可执行程序输出
    workerProcess.stdout?.on("data", (data) => {
      console.log("stdout: " + data);
    });
    // 打印错误的后台可执行程序输出
    workerProcess.stderr?.on("data", (data) => {
      console.log("stderr: " + data);
      message = data;
    });
    // 退出之后的输出
    workerProcess.on("close", (code) => {
      console.log(`out code - ${command}: ${code}`);
      if (code === 0) {
        resolve(true);
      } else {
        reject(message);
      }
    });
  });
}

/**
 * 提交
 */
async function gitPush(info = "init") {
  console.time("push");
  try {
    await runcommand("git add .");
    await runcommand(`git commit -m "${info}"`);
    await runcommand("git pull");
    await runcommand("git push");
  } catch (err) {
    console.log(err);
  }
  console.timeEnd("push");
}

function getContent() {
  return JSON.parse(fs.readFileSync("./config.json", "utf8") || "{}");
}

function writeContent(content) {
  fs.writeFileSync("./config.json", JSON.stringify(content, null, 2), "utf8");
}

function prompt(server, info = "update config") {
  return inquirer.prompt([
    {
      name: "server",
      message: "请输入后端地址",
      default: server,
      validate: (val) => {
        if (!val) return "请输入后端地址";
        return true;
      },
    },
    {
      name: "info",
      message: "请输入提交信息",
      default: info,
      validate: (val) => {
        if (!val) return "请输入提交信息";
        return true;
      },
    },
  ]);
}

async function init() {
  const { server, info } = await prompt(getContent().server);
  writeContent({ server });
  await gitPush(info);
}

init();
