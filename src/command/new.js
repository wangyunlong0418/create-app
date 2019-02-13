/*
 * @Author: wangyunlong
 * @Date: 2018-11-19 08:46:32
 * @Last Modified by: wangyunlong
 * @Last Modified time: 2019-02-13 15:17:05
 */

import commander from 'commander';
//  命令行交互工具
import inquirer from 'inquirer';
// 显示加载动画
import ora from 'ora';
import { git, install } from '../lib';
import message from '../../utils/message';
import packageJson from '../../package';

const {
  version: packageVersion,
} = packageJson;

class Download {
  constructor() {
    this.git = git;
    this.inquirer = inquirer;
    this.commander = commander;
    this.getProjectList = ora('正在获取列表');
    this.getTagList = ora('正在获取版本列表');
    this.download = ora('正在下载代码');
  }

  run() {
    this.commander
      .version(packageVersion, '-V, --version')
      .option('-l --list', 'download')
      .command('new')
      .description('正在从仓库下载代码')
      .action(() => {
        this.clone();
      });

    this.commander
      .on('--help', () => {
        console.log('Examples: create download');
        console.log('  $ custom-help --help');
        console.log('  $ custom-help -h');
      });
    this.commander.parse(process.argv);
  }

  async clone() {
    let getProjectListLoad;
    let getTagListLoad;
    let downloadLoad;
    let repos;
    let version;
    let template = null;

    // 获取参数，如果参数中指定模板，则不在询问用户
    if (process.argv[3]) {
      template = `${process.argv[3]}-template`;
    } else {
      try {
        getProjectListLoad = this.getProjectList.start();
        repos = await this.git.getProjectList();
        this.getProjectList.succeed('获取项目列表成功');
      } catch (err) {
        this.getProjectList.fail('获取项目列表失败');
        process.exit(-1);
        throw new Error(err);
      }

      if (repos.length === 0) {
        message.error('请查看配置，可能配置有误');
        process.exit(-1);
      }

      const choices = repos.map(item => item.name);

      const questions = [{
        type: 'list',
        name: 'repo',
        message: '请选择要开发的项目',
        choices,
      }];

      const { repo } = await this.inquirer.prompt(questions);
      template = repo;
    }

    // 获取版本，默认选择项目最近一个版本
    try {
      getTagListLoad = this.getTagList.start();
      [{ name: version }] = await this.git.getProjectVersion(template);
      this.getTagList.succeed('获取版本号成功');
    } catch (err) {
      this.getTagList.fail('获取版本号失败');
      process.exit(-1);
    }

    // 询问用户创建工程目录
    const repoName = [
      {
        type: 'input',
        name: 'repoPath',
        message: '请输入项目名称',
        validate(v) {
          const done = this.async();
          if (!v.trim()) {
            done('项目名称不能为空');
          }

          done(null, true);
        },
      },
    ];

    const { repoPath } = await this.inquirer.prompt(repoName);

    try {
      downloadLoad = this.download.start();
      await this.git.downloadProject({
        repo: template,
        version,
        repoPath,
      });

      install.listFile(repoPath);
      downloadLoad.succeed('下载模板成功');
    } catch (err) {
      console.log(err);
      downloadLoad.fail('下载模板失败');
    }
  }
}

const donwload = new Download();
donwload.run();
