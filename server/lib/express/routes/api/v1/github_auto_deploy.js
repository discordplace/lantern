const bodyParser = require('body-parser');
const crypto = require('node:crypto');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function findIssueNumber(headCommitId) {
  const { Octokit } = await import('@octokit/core');
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const { data: events } = await octokit.request('GET /repos/{owner}/{repo}/issues/events', {
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const sortedEvents = events.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const mergeEvent = sortedEvents.find(event => event.event === 'merged' && event.commit_id === headCommitId);
    if (!mergeEvent) return null;

    const issueNumber = mergeEvent.issue.number;

    return issueNumber;
  } catch (error) {
    logger.error('Error while fetching issue number:', error);

    return null;
  }
}

async function isFlagPresent(flag, headCommitId) {
  const issueNumber = await findIssueNumber(headCommitId);
  if (!issueNumber) return false;

  const { Octokit } = await import('@octokit/core');
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const { data: labels } = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/labels', {
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      issue_number: issueNumber,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return labels.some(label => label.name === flag);
  } catch (error) {
    logger.error('Error while checking if flag is present:', error);

    return false;
  }
}

module.exports = {
  post: [
    bodyParser.json(),
    async (request, response) => {
      const signature = request.headers['x-hub-signature-256'];
      if (!signature) return response.status(400).json({ error: 'No signature provided.' });

      const modifiedServerFiles = request.body.commits.reduce((acc, commit) => {
        commit.modified.filter(file => file.startsWith('server/')).forEach(file => acc.push(file));
        commit.added.filter(file => file.startsWith('server/')).forEach(file => acc.push(file));
        commit.removed.filter(file => file.startsWith('server/')).forEach(file => acc.push(file));

        return acc;
      }, []);

      if (!modifiedServerFiles.length) return response.status(200).json({ error: 'No server files modified.' });

      const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
      hmac.update(JSON.stringify(request.body));

      const digest = Buffer.from(`sha256=${hmac.digest('hex')}`, 'utf8');
      const hash = Buffer.from(signature, 'utf8');

      try {
        if (hash.length !== digest.length || !crypto.timingSafeEqual(digest, hash)) return response.status(403).json({ error: 'Invalid signature.' });
      } catch (error) {
        return response.status(403).json({ error: 'Invalid signature.' });
      }

      try {
        const { stdout, stderr } = await exec('git pull');
        logger.info(stdout);
        if (stderr) logger.info(stderr);

        logger.info('Pull successful.');

        const installDependencies = await isFlagPresent('Flags: Install Dependencies', request.body.head_commit.id).catch(() => null);
        if (installDependencies) {
          logger.info('There are requests to install dependencies. Installing..');

          const { stdout, stderr } = await exec('pnpm install');
          logger.info(stdout);
          if (stderr) logger.info(stderr);
        }

        logger.info('Auto deploy successful. Exiting process..');
        response.status(204).end();
        process.exit(0);
      } catch (error) {
        logger.error('Error while pulling from GitHub:', error);
        response.status(500).json({ error: `Error while pulling from GitHub:\n${error}` });
      }
    }
  ]
};
