import ChildProcess from 'child_process';
import { promisify } from 'util';
import { Plugin } from 'vite';

const { exec } = ChildProcess;
// 使用 promise 的方式执行命令
const execAsync = promisify(exec);

function vitePluginGitRevisionInfo(): Plugin {
  return {
    name: 'vite-plugin-git-revision-info',
    async transformIndexHtml() {
      const res = await execAsync('git log -1 --format=%cI');
      const HtmlStr = `const gitInfo = ${JSON.stringify(res)}`;
      // 将htmlStr插到body里
      return [
        {
          tag: 'script',
          attrs: { defer: true },
          children: HtmlStr,
          injectTo: 'body',
        },
      ];
    },
  };
}

export { vitePluginGitRevisionInfo as default };

