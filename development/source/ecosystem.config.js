module.exports = {
  apps: [
    {
      name: 'API',
      script: './bin/www',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      key: '~/Donwloads/namu.pem',
      user: 'ubuntu',
      host: 'question.api-namu.kro.kr:3000',
      ref: 'origin/master',
      repo: 'git@github.com:You-Kkomi/question.server.git',
      path: '/home/ubuntu/question.server/development',
      'post-deploy':
       'npm install && npm run build && cd /home/ubuntu/question.server/production && npm i --only=production && pm2 reload all'
    }
  }
}
