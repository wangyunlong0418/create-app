import which from 'which';
import {
  spawn,
} from 'child_process';
import fs from 'fs-extra';
import vfs from 'vinyl-fs';
import map from 'map-stream';
import inquirer from 'inquirer';
import path from 'path';
import message from '../../utils/message';

const {
  basename,
  resolve,
} = path;

const log = (file, cb) => {
  message.success(file.path);
  cb(null, file);
};

class Install {
  constructor() {
    this.inquirer = inquirer;
    this.message = message;
    this.app = null;
  }

  runCmd({
    cmd, params, cwd,
  }) {
    const options = params || [];

    const runner = spawn(cmd, options, {
      cwd,
      stdio: 'inherit',
    });

    runner.on('close', (code) => {
      if (code === 0) {
        this.packageSuccess();
      }
    });
  }

  async package(cwd) {
    const choices = process.platform === 'win32' ? ['yarn.cmd', 'tnpm.cmd', 'cnpm.cmd', 'npm.cmd'] : ['yarn', 'cnpm', 'npm'];
    const questions = [{
      type: 'list',
      name: 'method',
      message: '请选择包管理器',
      choices,
    }];

    const { method } = await this.inquirer.prompt(questions);

    this.runCmd({
      cmd: which.sync(method),
      params: ['install'],
      cwd,
    });
  }

  packageSuccess() {
    message.success(`成功了！！！ ${this.app} 创建完成!`);
    message.light(`赶快试试吧:

    cd ${this.app}
    npm run dev

    `);
    process.exit();
  }

  listFile(appDir) {
    const templatePath = resolve(process.cwd(), appDir);
    fs.ensureDir(appDir).then(() => {
      vfs
        .src(['**/*', '!node_modules/**/*'], {
          cwd: templatePath,
          cwdbase: true,
          dot: true,
        })
        .pipe(map(log))
        .pipe(vfs.dest(appDir))
        .on('end', () => {
          const app = basename(appDir);
          this.app = app;
          this.package(appDir);
        });
    });
  }
}

const install = new Install();

module.exports = install;
