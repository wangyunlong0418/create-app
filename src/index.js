import commander from 'commander'; // 接收命令行参数
import { existsSync } from 'fs';
import { resolve } from 'path';
import { version } from '../package.json';
import message from '../utils/message';

commander
  .version(version)
  .parse(process.argv);


// 获取命令行中第一个参数
const [todo = ''] = commander.args;

// 判断是否存在命令文件，如不存在，进程退出
if (existsSync(resolve(__dirname, `command/${todo}.js`))) {
  require(`./command/${todo}.js`);
} else {
  message.error(`
      输入命令不正确
    `);
  process.exit(-1);
}
