/**
 * 自动提交 git
 */

const fs = require("fs");
const { exec } = require("child_process");
const inquirer = require("inquirer").default;

async function runcommand(command) {
  return new Promise((reslove) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行 Git 初始化命令时出错：${error}`);
        reslove(false);
        return;
      }
      console.log(`Git 初始化成功：${stdout}`);
      reslove(true);
    });
  });
}

/**
 * 提交
 */
async function gitPush(info = "init") {
  console.time("push");
  await runcommand(`git add .`);
  await runcommand(`git commit -m '${info}'`);
  await runcommand(`git pull`);
  await runcommand(`git push`);
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
  console.log(server);
  console.log(info);
  writeContent({ server });
  await gitPush(info);
}

init();
