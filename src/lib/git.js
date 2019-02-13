import download from 'download-git-repo';
import axios from '../../utils/axios';
import { baseUrl, orgName } from '../../config';

class Git {
  constructor() {
    this.orgName = orgName;
  }

  getProjectList() {
    return axios(`${baseUrl}/orgs/${this.orgName}/repos`);
  }

  getProjectVersion(repo) {
    return axios(`${baseUrl}/repos/${this.orgName}/${repo}/tags`);
  }

  // getProjectUrl() {

  // }

  downloadProject({ repo, version, repoPath }) {
    return new Promise((resolve, reject) => {
      download(`${this.orgName}/${repo}#${version}`, repoPath, (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
      });
    });
  }
}

export default new Git();
