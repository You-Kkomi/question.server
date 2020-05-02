module.exports = {
  apps: [
    {
      name: 'API',
      script: './bin/www',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      merge_logs: true
      // error_file: './logs/aha-api-err.log',
      // out_file: './logs/aha-api-out.log'
    }
  ],
  deploy: {
    production: {
      key: '~/Donwloads/namu.pem',
      user: 'ubuntu',
      host: 'question.api-namu.kro.kr',
      ref: 'origin/master',
      repo: 'git@github.com:You-Kkomi/question.server.git',
      path: '/home/ubuntu/question.server/development',
      'post-deploy':
       'npm install && npm run build && cd /home/ubuntu/question.server/production && npm i --only=production && pm2 reload all'
    }
  }
}
