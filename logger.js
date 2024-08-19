import chalk from "chalk";

function formatdate() {
  const date = new Date();
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `[${h}:${m}:${s}]`;
}

function formatlog(type, ...args) {
  console.log(chalk[type](formatdate(), ...args));
}

const logger = {
  info(...args) {
    formatlog("whiteBright", ...args);
  },
  warn(...args) {
    formatlog("yellowBright", ...args);
  },
  success(...args) {
    formatlog("greenBright", ...args);
  },
  error(...args) {
    formatlog("redBright", ...args);
  },
};

export default logger;
