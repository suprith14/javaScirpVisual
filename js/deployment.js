/*
 * JS Engine Lab — 🚢 Deployment: how a frontend app gets from your laptop to a public URL.
 *   1 the ways to deploy → 2 what happens when you push → 3 what every deploy needs → 4 which one? / fix it
 * The questions are also 🏋️ Practice tasks (topic "Deployment"), opened in the Web lab window.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const WAYS = [
    { id: 'static', icon: '📦', name: 'Static hosting + CDN', start: true, brief: 'Upload the built files; a CDN serves them worldwide. For Vite / React apps.',
      shape: 'dist/\n  index.html\n  assets/app.3f9c1a.js\n  assets/app.8b2e41.css',
      use: 'Apps and sites that are only HTML, CSS and JS: Vite / React SPAs, static Astro or Next export.',
      how: 'The build output is copied to servers all over the world (a CDN). No server code runs, so it is fast, cheap and hard to break.',
      ex: 'Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront' },
    { id: 'fullstack', icon: '⚡', name: 'Full-stack platform', brief: 'Static hosting plus server code for SSR and API routes. For Next.js.',
      shape: 'next build →\n  static pages      → CDN\n  SSR pages, API   → functions',
      use: 'Next.js, Remix, SvelteKit, Nuxt: apps with server rendering and API routes.',
      how: 'The platform splits your app for you: static files go to the CDN, server parts become functions.',
      ex: 'Vercel, Netlify, Cloudflare, AWS Amplify' },
    { id: 'functions', icon: 'λ', name: 'Serverless / edge functions', brief: 'Small backend code that runs only when called. For an API route or a webhook.',
      shape: 'export default async (req) => {\n  return Response.json({ ok: true });\n}',
      use: 'Small backend pieces next to a frontend: an API route, a form handler, a webhook, an auth callback.',
      how: 'Code runs only when a request comes in and scales to zero. Short-lived: no long connections, no memory between requests.',
      ex: 'Vercel / Netlify Functions, Cloudflare Workers, AWS Lambda' },
    { id: 'container', icon: '🐳', name: 'Containers', brief: 'Your app packed in a Docker box, always running. For WebSocket servers and background jobs.',
      shape: 'FROM node:20-alpine\nCOPY . .\nRUN npm ci && npm run build\nCMD ["node", "server.js"]',
      use: 'A long-running server: WebSockets, background jobs, anything that needs a real process.',
      how: 'You package the app and its runtime into an image (Docker); the platform runs, scales and restarts it.',
      ex: 'Render, Railway, Fly.io, Google Cloud Run, AWS ECS' },
    { id: 'vps', icon: '🖥️', name: 'Your own server (VPS)', brief: 'A rented machine you manage yourself. Good for learning; rarely the first choice.',
      shape: 'nginx → node app (pm2)\n+ certbot, firewall, updates…',
      use: 'Full control or special needs; good for learning how it all works.',
      how: 'You rent a machine and set up everything yourself: updates, security, HTTPS, restarts, backups.',
      ex: 'DigitalOcean, Hetzner, Linode, AWS EC2' },
  ];
  const WAY_CHOICES = WAYS.map(w => [w.id, `${w.icon} ${w.name}`]);

  const PIPELINE = [
    ['🔀', 'Push or open a pull request', 'git push origin feature/cart'],
    ['🧪', 'CI checks', 'GitHub Actions: npm ci → lint → type-check → tests. Red = nothing gets deployed.'],
    ['🏗️', 'Build', 'npm run build → dist/ with hashed file names (app.3f9c1a.js), minified and compressed'],
    ['👀', 'Preview deploy', 'every pull request gets its own URL (feature-cart.my-app.pages.dev) to review before merging'],
    ['🚀', 'Merge → production', 'the new files are uploaded, then all traffic switches to them at once (an atomic deploy)'],
    ['🌍', 'CDN', 'copies are served from the location nearest each user; old hashed files stay for tabs that are still open'],
    ['📈', 'Watch, and roll back if needed', 'error monitoring (Sentry) and Web Vitals; if something breaks, roll back to the previous deploy in one click'],
  ];

  const MUST = [
    { t: 'Environment variables', b: 'Different settings per environment. VITE_ / NEXT_PUBLIC_ values are public: never put secrets there.', d: 'Different values for development, preview and production, set in the hosting dashboard. Anything prefixed VITE_ or NEXT_PUBLIC_ is built into the JavaScript: it is public.',
      code: '# .env.production\nVITE_API_URL=https://api.shop.com\n\n# never in the frontend:\n# VITE_STRIPE_SECRET_KEY=sk_live_…' },
    { t: 'The "404 on refresh" fix (SPAs)', b: 'Send every path to index.html, or shared links to inner pages break.', d: 'A single-page app has only index.html. Opening /products/7 directly asks the server for a file that does not exist. Send every unknown path to index.html and let the router handle it.',
      code: '# Netlify: public/_redirects\n/*   /index.html   200\n\n// Vercel: vercel.json\n{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }' },
    { t: 'Cache headers', b: 'Cache hashed files forever; never cache index.html.', d: 'Hashed files never change under the same name, so cache them for a year. index.html must always be checked, or users keep the old version (see the caching tasks).',
      code: '/assets/*     Cache-Control: public, max-age=31536000, immutable\n/index.html   Cache-Control: no-cache' },
    { t: 'Domain, DNS and HTTPS', b: 'Point your domain at the host; HTTPS is set up for you.', d: 'Point your domain at the host with DNS records; HTTPS certificates are created and renewed for you (Let\'s Encrypt).',
      code: 'shop.com       A      76.76.21.21\nwww.shop.com   CNAME  cname.vercel-dns.com' },
    { t: 'Security headers', b: 'CSP, HSTS and friends: set once at the host.', d: 'Set once at the host: Content-Security-Policy, HSTS (always HTTPS), X-Content-Type-Options, frame-ancestors (no clickjacking).',
      code: 'Strict-Transport-Security: max-age=63072000\nContent-Security-Policy: default-src \'self\'\nX-Content-Type-Options: nosniff' },
    { t: 'Monitoring and rollback', b: 'Hear about errors before users do; undo a bad release in one click.', d: 'Upload source maps to your error monitor so stack traces point at your real code; add an uptime check; know where the rollback button is before you need it.',
      code: 'npx @sentry/wizard@latest -i sourcemaps\n# uptime: Better Stack, UptimeRobot, Checkly' },
  ];

  // situations; the "which way" ones use the deploy types as choices, the "fix it" ones have their own
  const QUESTIONS = [
    { id: 'dep-portfolio', title: 'A portfolio site', q: 'A Vite + React portfolio with no backend. Where do you deploy it?', choices: WAY_CHOICES, a: 'static',
      scene: 'Setup project: your first app should be online in minutes.', why: 'Only HTML, CSS and JS: static hosting on a CDN is free, fast and needs no server. Connect the GitHub repo and every push deploys.' },
    { id: 'dep-next', title: 'A Next.js shop', q: 'A Next.js shop with server-rendered product pages, ISR and API routes.', choices: WAY_CHOICES, a: 'fullstack',
      scene: 'Shop project: some pages are static, some are rendered per request, and there is an API.', why: 'A full-stack platform splits it for you: static and ISR pages on the CDN, SSR pages and API routes as functions.', also: 'A container (Next.js standalone output) works too, if you want to run it yourself.' },
    { id: 'dep-websocket', title: 'A WebSocket chat server', q: 'A chat server that keeps thousands of WebSocket connections open all day.', choices: WAY_CHOICES, a: 'container',
      scene: 'Chat project: the real-time part needs its own server.', why: 'Serverless functions are short-lived and cannot hold connections open; a container runs a long-lived process.', also: 'Or a hosted real-time service (Ably, Pusher, Supabase Realtime) and no server of your own.' },
    { id: 'dep-webhook', title: 'One payment webhook', q: 'Your static site needs one endpoint that receives payment webhooks from Stripe.', choices: WAY_CHOICES, a: 'functions',
      scene: 'Shop project: Stripe calls your server when a payment succeeds.', why: 'One small piece of backend code that runs on each request: a serverless function next to the static site, no server to run.' },
    { id: 'dep-404', title: 'Fix it: 404 on refresh', q: 'After deploying the React app, opening /products/7 directly (or refreshing on it) shows "404 Not Found".',
      choices: [['fallback', 'Send every unknown path to index.html (an SPA fallback)'], ['cdn', 'Turn the CDN off'], ['bundler', 'Build with a different bundler']], a: 'fallback',
      scene: 'Setup project: the app works when you click around, but a shared link is broken.', why: 'The server looks for a file called /products/7 and finds none. A rewrite to index.html lets the React router show the right page.', also: 'Hash URLs (/#/products/7) avoid it too, but look worse and are bad for SEO.' },
    { id: 'dep-stale', title: 'Fix it: users see the old version', q: 'After a deploy, some users still see the old version for hours.',
      choices: [['html', 'index.html is cached: serve it with Cache-Control: no-cache'], ['js', 'Cache the JS files for a shorter time'], ['users', 'Ask users to clear their cache']], a: 'html',
      scene: 'Shop project: the bug is fixed, but customers still report it.', why: 'If index.html is cached, the browser keeps loading the old HTML, which points at the old hashed JS. index.html must be revalidated every time; the hashed files can be cached forever.', also: 'With a service worker, also make sure it updates (skipWaiting / a "new version" banner).' },
    { id: 'dep-env', title: 'Fix it: production calls localhost', q: 'The app works locally, but in production it calls http://localhost:3000.',
      choices: [['env', 'Set VITE_API_URL for production in the hosting dashboard and rebuild'], ['hardcode', 'Hard-code the production URL in the code'], ['commit', 'Commit your .env file']], a: 'env',
      scene: 'Dashboard project: the deployed app shows "Network error" everywhere.', why: 'Vite puts env values into the bundle at build time, so production needs its own value and a new build. Hard-coding breaks local development; committing .env leaks secrets.' },
    { id: 'dep-secret', title: 'Fix it: a secret key in the frontend', q: 'You put your Stripe secret key in VITE_STRIPE_SECRET_KEY so the frontend can use it.',
      choices: [['rotate', 'It is now public in the JavaScript: rotate the key, and call Stripe from a server function'], ['fine', 'Fine: environment variables are private'], ['minify', 'Minify the bundle so nobody finds it']], a: 'rotate',
      scene: 'Checkout project: a teammate asks why payments need a backend at all.', why: 'Every VITE_ / NEXT_PUBLIC_ value ends up in the files every visitor downloads. Treat the key as stolen: rotate it, and keep secrets only in server code.' },
    { id: 'dep-preview', title: 'Review before merging', q: 'A designer wants to check your pull request on a real URL before it is merged.',
      choices: [['preview', 'Preview deployments: one URL per pull request'], ['prod', 'Deploy to production and roll back if they dislike it'], ['shots', 'Send screenshots']], a: 'preview',
      scene: 'Design-system project: every change gets reviewed by design.', why: 'Netlify, Vercel and Cloudflare build every pull request at its own URL automatically. Production stays untouched until the merge.' },
    { id: 'dep-rollback', title: 'A release breaks checkout', q: 'At 6 pm a release breaks checkout. What first?',
      choices: [['rollback', 'Roll back to the previous deploy in one click, then fix and redeploy'], ['hotfix', 'Edit the files on the server by hand'], ['wait', 'Fix it in the next release']], a: 'rollback',
      scene: 'Any production app: things go wrong; recovery speed is what matters.', why: 'Deploys are kept as immutable versions, so rolling back is instant and safe. Fix calmly afterwards, with a test that catches the bug.' },
  ];

  // ------------------------------------------------------------ step-by-step walkthroughs: [title, one line, commands]
  const L = (...lines) => lines.join('\n');
  const WALKS = [
    { id: 'easy', name: '⚡ Vercel / Netlify (easiest)', note: 'For a Vite / React app or a Next.js app. Free to start; about 10 minutes.', steps: [
      ['Push the project to GitHub', 'The host deploys from your repository.', L('git init && git add . && git commit -m "First version"', 'git remote add origin https://github.com/you/shop.git', 'git push -u origin main')],
      ['Import the repository', 'In Vercel or Netlify: "Add new project" → pick the repo. It detects Vite or Next.js.', L('Build command:   npm run build', 'Output folder:   dist        (Vite)', '                 .next       (Next.js: automatic)')],
      ['Set environment variables', 'Add your settings separately for Production and Preview.', L('Project → Settings → Environment Variables', 'VITE_API_URL = https://api.shop.com            (Production)', 'VITE_API_URL = https://staging-api.shop.com    (Preview)')],
      ['Deploy', 'Push to main → production. Open a pull request → a preview URL.', L('git checkout -b feature/cart', 'git push -u origin feature/cart   # → https://feature-cart--shop.netlify.app')],
      ['SPA fallback and cache headers', 'One small config file in the repo.', L('# netlify.toml', '[[redirects]]', '  from = "/*"', '  to = "/index.html"', '  status = 200', '', '[[headers]]', '  for = "/assets/*"', '  [headers.values]', '    Cache-Control = "public, max-age=31536000, immutable"')],
      ['Custom domain', 'Add your domain, copy the DNS records it shows to your registrar; HTTPS is automatic.', L('shop.com       A      75.2.60.5          (the host shows the exact values)', 'www.shop.com   CNAME  shop.netlify.app')],
      ['Roll back when needed', 'Deployments list → pick the last good one → publish / promote it.', 'Deploys → (older deploy) → "Publish deploy"  (Netlify)\nDeployments → … → "Promote to Production"   (Vercel)'],
    ] },
    { id: 'aws', name: '☁️ AWS: S3 + CloudFront', note: 'How many companies host a React SPA. More steps, more control. Needs an AWS account and the AWS CLI.', steps: [
      ['Build', 'npm run build creates the dist/ folder.', 'npm ci && npm run build'],
      ['Create a private S3 bucket', 'S3 stores the files. Keep "Block all public access" ON: only CloudFront may read it.', 'aws s3api create-bucket --bucket shop-frontend-prod \\\n  --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1'],
      ['Create a CloudFront distribution', 'The CDN in front of the bucket. It reads S3 through Origin Access Control (OAC).', L('CloudFront → Create distribution', '  Origin:               shop-frontend-prod.s3.eu-west-1.amazonaws.com', '  Origin access:        Origin access control (OAC) → copy the bucket policy it shows into S3', '  Default root object:  index.html', '  Viewer protocol:      Redirect HTTP to HTTPS')],
      ['SPA fallback', 'Missing paths come back as 403/404 from S3: answer them with index.html.', L('CloudFront → Error pages → Create custom error response', '  403 → /index.html, response code 200', '  404 → /index.html, response code 200')],
      ['HTTPS certificate (ACM)', 'Free certificate. It must be in us-east-1 (N. Virginia): CloudFront only reads certificates from there.', 'aws acm request-certificate --domain-name shop.com \\\n  --subject-alternative-names www.shop.com --validation-method DNS --region us-east-1\n# then add the CNAME record ACM shows, and pick the certificate in the distribution'],
      ['Domain (Route 53)', 'An alias record points your domain at the distribution.', 'Route 53 → Hosted zone shop.com → Create record\n  shop.com   A (Alias) → the CloudFront distribution'],
      ['Upload with the right cache headers', 'Hashed files cached for a year; index.html always checked.', 'aws s3 sync dist/ s3://shop-frontend-prod --delete \\\n  --exclude index.html --cache-control "public,max-age=31536000,immutable"\naws s3 cp dist/index.html s3://shop-frontend-prod/index.html --cache-control "no-cache"'],
      ['Invalidate index.html', 'Tell CloudFront to drop its cached copy, so the new version is served now.', 'aws cloudfront create-invalidation --distribution-id E1A2B3C4D5 --paths "/index.html"'],
      ['Automate with GitHub Actions (no stored keys)', 'OIDC: GitHub gets short-lived credentials from an IAM role allowed to touch only this bucket.', L('permissions: { id-token: write, contents: read }', 'steps:', '  - uses: actions/checkout@v4', '  - run: npm ci && npm run build', '  - uses: aws-actions/configure-aws-credentials@v4', '    with:', '      role-to-assume: arn:aws:iam::123456789012:role/deploy-shop-frontend', '      aws-region: eu-west-1', '  - run: aws s3 sync dist/ s3://shop-frontend-prod --delete', '  - run: aws cloudfront create-invalidation --distribution-id E1A2B3C4D5 --paths "/index.html"')],
      ['The shortcut: AWS Amplify Hosting', 'Connect the repo and Amplify does build, CDN, HTTPS and previews for you, like Vercel, inside AWS.', 'Amplify → Host web app → GitHub → pick the repo and branch → Save and deploy'],
    ] },
    { id: 'docker', name: '🐳 Docker → Cloud Run / AWS', note: 'For an app that needs a running server (Next.js with SSR, a Node API, WebSockets).', steps: [
      ['Write a Dockerfile', 'A recipe for an image with your built app and Node. Two stages keep it small.', L('FROM node:20-alpine AS build', 'WORKDIR /app', 'COPY package*.json ./', 'RUN npm ci', 'COPY . .', 'RUN npm run build', '', 'FROM node:20-alpine', 'WORKDIR /app', 'ENV NODE_ENV=production', 'COPY --from=build /app/.next/standalone ./', 'COPY --from=build /app/.next/static ./.next/static', 'COPY --from=build /app/public ./public', 'EXPOSE 3000', 'CMD ["node", "server.js"]')],
      ['Build and run it locally', 'If it runs here, it runs in the cloud the same way.', 'docker build -t shop .\ndocker run -p 3000:3000 --env-file .env.local shop'],
      ['Push the image to a registry', 'Google: Artifact Registry. AWS: ECR (Elastic Container Registry).', L('gcloud auth configure-docker europe-west1-docker.pkg.dev', 'docker tag shop europe-west1-docker.pkg.dev/my-project/apps/shop:v1', 'docker push europe-west1-docker.pkg.dev/my-project/apps/shop:v1')],
      ['Deploy', 'Cloud Run gives you an HTTPS URL; it scales with traffic, down to zero.', L('gcloud run deploy shop --image europe-west1-docker.pkg.dev/my-project/apps/shop:v1 \\', '  --region europe-west1 --allow-unauthenticated', '# AWS: App Runner (simplest), or ECS on Fargate behind a load balancer')],
      ['Secrets', 'Pass secrets at runtime from a secret store; never bake them into the image.', 'gcloud run services update shop --set-secrets DATABASE_URL=db-url:latest\n# AWS: Secrets Manager / SSM Parameter Store → ECS task definition "secrets"'],
      ['Health check and scaling', 'A /health endpoint tells the platform the app is alive; set minimum and maximum instances.', 'gcloud run services update shop --min-instances 1 --max-instances 20\n# min 1 avoids "cold starts"; 0 is cheapest'],
      ['Domain and HTTPS', 'Map your domain; the certificate is managed for you.', 'gcloud beta run domain-mappings create --service shop --domain shop.com --region europe-west1'],
    ] },
  ];

  // ------------------------------------------------------------ the AWS services a frontend developer meets
  const AWS = [
    ['Hosting and delivery', [
      ['S3', 'Stores files (objects): built websites, images, uploads.', 'hosting a SPA, user uploads with presigned URLs'],
      ['CloudFront', 'The CDN: caches and serves your files worldwide, with HTTPS.', 'every production frontend on AWS'],
      ['Route 53', 'DNS: points your domain at AWS services.', 'connecting shop.com'],
      ['ACM', 'Free HTTPS certificates (for CloudFront: request them in us-east-1).', 'adding HTTPS to a domain'],
      ['Amplify', 'All-in-one frontend hosting (build, CDN, previews) plus optional backend.', 'the "Vercel of AWS"'],
    ]],
    ['Running code', [
      ['Lambda', 'Functions that run on demand, billed per request.', 'an API, a webhook, image resizing'],
      ['API Gateway', 'Public HTTPS endpoints in front of Lambda (or a Lambda function URL for simple cases).', 'a REST or WebSocket API'],
      ['App Runner', 'Run a container from an image with almost no setup.', 'a Next.js or Node server'],
      ['ECS / Fargate + ECR', 'Run and scale containers; ECR stores the images.', 'larger container apps'],
      ['EC2', 'Virtual machines you manage yourself.', 'legacy apps, full control'],
    ]],
    ['Data', [
      ['RDS / Aurora', 'Managed PostgreSQL and MySQL (backups, replicas, updates done for you).', 'the main app database'],
      ['DynamoDB', 'Key-value / document database that scales without limits.', 'serverless apps, sessions, carts'],
      ['ElastiCache', 'Managed Redis / Valkey.', 'caching, rate limits'],
      ['OpenSearch', 'Managed Elasticsearch-style search.', 'the search box'],
    ]],
    ['Security and identity', [
      ['IAM', 'Who may do what: users, roles, policies. Give the least permissions needed.', 'every deploy pipeline (OIDC roles)'],
      ['Cognito', 'User sign-up and login (user pools), social login.', 'auth without your own auth server'],
      ['Secrets Manager / SSM', 'Store secrets and config; apps read them at runtime.', 'database passwords, API keys'],
      ['WAF', 'A web firewall in front of CloudFront / API Gateway.', 'blocking bots and attacks'],
    ]],
    ['Watching and messaging', [
      ['CloudWatch', 'Logs, metrics, alarms and dashboards.', 'reading Lambda errors, alerts'],
      ['SQS / SNS / EventBridge', 'Queues, notifications and events between services.', 'sending work to the background'],
      ['SES', 'Sending email.', 'order confirmations, password resets'],
    ]],
  ];
  const CLOUDS = [
    ['Files', 'S3', 'Cloud Storage', 'Blob Storage'],
    ['CDN', 'CloudFront', 'Cloud CDN', 'Front Door'],
    ['DNS', 'Route 53', 'Cloud DNS', 'Azure DNS'],
    ['Functions', 'Lambda', 'Cloud Run functions', 'Azure Functions'],
    ['Containers', 'App Runner / ECS Fargate', 'Cloud Run', 'Container Apps'],
    ['SQL database', 'RDS / Aurora', 'Cloud SQL / AlloyDB', 'Azure SQL / Database for PostgreSQL'],
    ['NoSQL', 'DynamoDB', 'Firestore', 'Cosmos DB'],
    ['Auth', 'Cognito', 'Identity Platform / Firebase Auth', 'Entra External ID'],
    ['Secrets', 'Secrets Manager', 'Secret Manager', 'Key Vault'],
    ['Logs and metrics', 'CloudWatch', 'Cloud Logging / Monitoring', 'Azure Monitor'],
  ];

  // ------------------------------------------------------------ releasing safely
  const RELEASE = [
    { t: 'Environments', b: 'dev (your laptop) → preview (per pull request) → staging (like production) → production.', d: 'Each has its own URL, database and secrets. Staging catches what previews cannot (real integrations, data migrations). Never test against the production database.' },
    { t: 'Blue-green deploys', b: 'Run the new version next to the old one, then switch all traffic at once.', d: 'Switching back is instant if something is wrong. Static hosts and Vercel / Netlify do this for every deploy (atomic deploys).' },
    { t: 'Canary releases', b: 'Send 1% → 10% → 100% of users to the new version, watching errors at each step.', d: 'Supported by Cloud Run traffic splitting, AWS CodeDeploy / Lambda aliases, Vercel / Netlify split testing, or a feature flag.' },
    { t: 'Feature flags', b: 'Ship code switched off; turn it on for some users without a new deploy.', d: 'LaunchDarkly, Unleash, GrowthBook, PostHog. Also used for A/B tests and kill switches. Remove old flags or they pile up.', code: 'if (flags.newCheckout) return <NewCheckout />;\nreturn <Checkout />;' },
    { t: 'Infrastructure as code', b: 'Describe buckets, CDNs and databases in files, reviewed like code, instead of clicking in a console.', d: 'Terraform / OpenTofu (any cloud), AWS CDK (TypeScript), SST (for full-stack apps on AWS), Pulumi. Repeatable, reviewable, easy to copy for staging.', code: 'resource "aws_s3_bucket" "site" {\n  bucket = "shop-frontend-prod"\n}' },
    { t: 'Secrets', b: 'Keep secrets in the host\'s or cloud\'s secret store, never in git or in frontend code.', d: 'Rotate them when people leave or a leak is possible. Scan commits for secrets (GitHub secret scanning, gitleaks).' },
    { t: 'Database changes with no downtime', b: 'Expand, then migrate, then contract: add the new column first, remove the old one later.', d: 'During a deploy old and new code run at the same time, so both must work with the database. Run migrations in CI (prisma migrate deploy) before the new code goes live.' },
    { t: 'Monitoring and alerts', b: 'Errors (Sentry), real-user speed (Web Vitals), uptime checks, logs: with alerts to a person.', d: 'Decide what wakes someone up (checkout errors) and what waits (a slow admin page). Write a short note after each incident: what happened, why, how to prevent it.' },
    { t: 'Cost', b: 'Static hosting is almost free; servers, databases and data transfer (egress) cost money.', d: 'Set a budget alert on day one (AWS Budgets). Serverless is cheap when idle, containers are cheaper at steady high traffic. Delete what you do not use.' },
  ];

  // AWS questions (also practice tasks, topic "Cloud (AWS)")
  QUESTIONS.push(
    { id: 'aws-static', cloud: true, title: 'A React SPA on AWS', q: 'Host a React single-page app on AWS, fast worldwide and with HTTPS.', choices: [['s3cf', 'S3 + CloudFront (+ ACM, Route 53)'], ['ec2', 'An EC2 server with Nginx'], ['rds', 'RDS']], a: 's3cf',
      scene: 'Your company runs everything on AWS, and the new frontend has to live there too.', why: 'Static files belong in S3, served by the CloudFront CDN with an ACM certificate. No server to patch, and it scales by itself.', also: 'AWS Amplify Hosting does the same with less setup.' },
    { id: 'aws-cert', cloud: true, title: 'The certificate is missing', q: 'You created an ACM certificate in eu-west-1, but CloudFront does not list it.', choices: [['region', 'Request it again in us-east-1 (N. Virginia)'], ['wait', 'Wait for DNS to update'], ['iam', 'Give CloudFront an IAM role']], a: 'region',
      scene: 'Setting up HTTPS for the shop on AWS.', why: 'CloudFront is global and only reads certificates from us-east-1. Certificates for regional services (load balancers, API Gateway) live in their own region.' },
    { id: 'aws-keys', cloud: true, title: 'Deploying from GitHub safely', q: 'How should GitHub Actions get permission to upload to S3?', choices: [['oidc', 'An IAM role through OIDC: short-lived credentials, only for this bucket'], ['keys', 'Paste an admin access key into GitHub secrets'], ['public', 'Make the bucket writable by everyone']], a: 'oidc',
      scene: 'Setup project: automating the AWS deploy.', why: 'OIDC gives each run temporary credentials, so there is no long-lived key to leak, and the role allows only what the deploy needs (least privilege).' },
    { id: 'aws-api', cloud: true, title: 'A small API without servers', q: 'Your frontend needs a small JSON API on AWS, with no server to manage.', choices: [['lambda', 'Lambda + API Gateway (or a Lambda function URL)'], ['ec2', 'EC2'], ['s3', 'S3']], a: 'lambda',
      scene: 'Dashboard project: three endpoints that read from the database.', why: 'Lambda runs your code per request and costs nothing when idle; API Gateway (or a function URL) gives it a public HTTPS address.' },
    { id: 'aws-postgres', cloud: true, title: 'PostgreSQL on AWS', q: 'You need a managed PostgreSQL database on AWS.', choices: [['rds', 'RDS or Aurora PostgreSQL'], ['dynamo', 'DynamoDB'], ['s3', 'S3']], a: 'rds',
      scene: 'Checkout project: orders need a relational database.', why: 'RDS (and the faster Aurora) run PostgreSQL for you: backups, updates, replicas and failover. DynamoDB is a different kind of database (key-value).' },
    { id: 'aws-logs', cloud: true, title: 'Where are the errors?', q: 'Your Lambda function fails in production. Where do you read its errors?', choices: [['cw', 'CloudWatch Logs'], ['s3', 'S3'], ['route53', 'Route 53']], a: 'cw',
      scene: 'Any AWS backend: something broke, and you need the stack trace.', why: 'Everything a Lambda writes with console.log / console.error goes to CloudWatch Logs; CloudWatch alarms can notify you when errors rise.' },
  );

  // the questions as 🏋️ Practice tasks
  if (window.WebLab) window.WebLab.extend('deploy', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }].concat(s.also ? [{ ok: true, text: 'Also OK: ' + esc(s.also) }] : []) }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...QUESTIONS.map(x => ({
    id: x.id, cat: x.cloud ? 'Cloud (AWS)' : 'Deployment', kind: 'rule', solver: 'deploy', icon: x.cloud ? '☁️' : '🚢', kindLabel: x.cloud ? 'pick the AWS service' : 'deploy it right',
    title: x.title, ask: x.cloud ? 'Which AWS option?' : x.choices === WAY_CHOICES ? 'Where do you deploy it?' : 'What do you do?', scene: x.scene,
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'Is there server code? Does it run long or only per request? What is cached, and what is public?',
    why: `${esc(x.why)} See the 🚢 Deployment tab for the whole picture.`, scenario: { q: x.q, a: x.a, why: x.why, also: x.also },
  })));

  const STAGES = [
    { key: 'ways', name: 'The ways', title: 'The ways to deploy', say: 'From simplest to most work. Most frontend apps need the first one or two.' },
    { key: 'push', name: 'On push', title: 'What happens when you push', say: 'With a modern host, deploying is just git push: everything after it is automatic.' },
    { key: 'walk', name: 'Step by step', title: 'Step by step: deploy it yourself', say: 'Three real ways, from easiest to most control. Pick one; "Show details" shows every command.' },
    { key: 'must', name: 'Must-haves', title: 'What every deploy needs', say: 'The settings that cause most "it works locally" problems.' },
    { key: 'aws', name: 'AWS map', title: 'The AWS services you will meet', say: 'AWS has 200+ services; a frontend developer meets about 20. Here they are, with the same thing on Google Cloud and Azure.' },
    { key: 'release', name: 'Release safely', title: 'Releasing safely in a team', say: 'How real teams ship often without breaking things.' },
    { key: 'quiz', name: 'Which one?', title: 'Which one? Fix it!', say: 'Real situations. Pick an answer to see why.' },
  ];
  const UI = { stage: 0, answers: {}, detail: false, walk: 'easy' };
  const VIEWS = {
    walk: () => {
      const w = WALKS.find(x => x.id === UI.walk);
      return `<div class="dp-walks">${WALKS.map(x => `<button class="btn small cl-choice${x.id === UI.walk ? ' on' : ''}" data-dpwalk="${x.id}">${esc(x.name)}</button>`).join('')}</div>
        <p class="cl-note">${esc(w.note)}</p>
        <ol class="dp-steps">${w.steps.map(([t, b, code]) => `<li><b>${esc(t)}</b><span>${esc(b)}</span>${UI.detail ? `<pre>${esc(code)}</pre>` : ''}</li>`).join('')}</ol>
        ${UI.detail ? '' : '<p class="cl-note">Press "+ Show details" to see the exact commands and settings for every step.</p>'}`;
    },
    aws: () => `<div class="dp-aws">${AWS.map(([g, list]) => `<div class="db-card"><div class="db-h"><b>${esc(g)}</b></div><ul>${list.map(([n, what, when]) => `<li><b>${esc(n)}</b>: ${esc(what)}${UI.detail ? ` <i>You meet it: ${esc(when)}.</i>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>
      <p><b>The same thing in other clouds</b></p>
      <table class="iv-diff db-words"><thead><tr><th>job</th><th>AWS</th><th>Google Cloud</th><th>Azure</th></tr></thead><tbody>${CLOUDS.map(r => `<tr>${r.map((c, i) => `<td>${i ? esc(c) : `<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <p class="cl-note">Learn the ideas once (files, CDN, DNS, functions, containers, databases, permissions, logs); every cloud has the same pieces under different names.</p>`,
    release: () => `<div class="db-grid dp-must">${RELEASE.map(r => `<div class="db-card"><div class="db-h"><b>${esc(r.t)}</b></div><p>${esc(r.b)}</p>${UI.detail ? `<p class="db-how">${esc(r.d)}</p>${r.code ? `<pre>${esc(r.code)}</pre>` : ''}` : ''}</div>`).join('')}</div>`,
    ways: () => `<div class="db-grid">${WAYS.map(w => `<div class="db-card${w.start ? ' start' : ''}"><div class="db-h">${w.icon} <b>${esc(w.name)}</b>${w.start ? ' <span class="db-tag">start here</span>' : ''}</div>
        ${UI.detail ? `<pre>${esc(w.shape)}</pre><p><b>For:</b> ${esc(w.use)}</p><p class="db-how">${esc(w.how)}</p>` : `<p>${esc(w.brief)}</p>`}<p class="db-ex">${esc(w.ex)}</p></div>`).join('')}</div>
      <p class="cl-note">Rule of thumb: a Vite / React app → static hosting. Next.js → a full-stack platform. Need a long-running server? → a container.</p>`,
    push: () => !UI.detail ? `<div class="dp-chain">${PIPELINE.map(([i, t]) => `<span>${i} ${esc(t.replace(/^Merge → /, ''))}</span>`).join('<i>→</i>')}</div>
      <p>You push code. Checks run, the app is built, a preview URL is made for review, and after the merge it goes live on a CDN. If something breaks, you roll back in one click.</p>`
      : `<ol class="dp-pipe">${PIPELINE.map(([i, t, d]) => `<li><span class="dp-i">${i}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div></li>`).join('')}</ol>
      <p><b>The CI part</b> (it is the 🚀 Setup project's workflow):</p>
      <pre class="px-src"># .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint && npx tsc --noEmit && npx vitest run
      - run: npm run build</pre>
      <p class="cl-note">The host (Netlify, Vercel, Cloudflare Pages) watches the repository and does the build, preview and production steps itself once you connect it.</p>`,
    must: () => `<div class="db-grid dp-must">${MUST.map(m => `<div class="db-card"><div class="db-h"><b>${esc(m.t)}</b></div>${UI.detail ? `<p>${esc(m.d)}</p><pre>${esc(m.code)}</pre>` : `<p>${esc(m.b)}</p>`}</div>`).join('')}</div>`,
    quiz: () => QUESTIONS.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a;
      const label = k => (x.choices.find(c => c[0] === k) || [k, k])[1];
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-dpq="${i}" data-dpa="${k}">${esc(l)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Right' : `❌ Best: <b>${esc(label(x.a))}</b>`}: ${esc(x.why)}${x.also ? ` <i>Also OK: ${esc(x.also)}</i>` : ''}</p>` : ''}</div>`;
    }).join(''),
  };

  function ensure() {
    let m = $('dpLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'dpLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Deployment');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-dpclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🚢 Deployment</h2><span class="cl-note">how an app gets from your laptop to a public URL</span></div>
      <div class="px-rail" id="dpRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="dpTitle"></h3><p class="px-say" id="dpSay"></p><button class="btn small dp-detail" id="dpDetail" data-dpdetail></button><div id="dpBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="dpPrev">◀ Back</button><button class="btn small primary" id="dpNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('dpRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-dpstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('dpTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('dpSay').textContent = s.say;
    $('dpBody').innerHTML = VIEWS[s.key]();
    $('dpDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('dpDetail').classList.toggle('hidden', s.key === 'quiz');
    $('dpPrev').disabled = UI.stage === 0;
    $('dpNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('dpLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnDeploy') || t.closest('[data-fmdeploy]')) { open(); return; }
    if (!$('dpLab') || $('dpLab').classList.contains('hidden')) return;
    const st = t.closest('[data-dpstage]');
    if (st) { UI.stage = +st.dataset.dpstage; draw(); return; }
    const a = t.closest('[data-dpq]');
    if (a) { UI.answers[+a.dataset.dpq] = a.dataset.dpa; const box = $('dpBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    if (t.closest('[data-dpdetail]')) { UI.detail = !UI.detail; draw(); return; }
    const wk = t.closest('[data-dpwalk]');
    if (wk) { UI.walk = wk.dataset.dpwalk; draw(); return; }
    if (t.closest('#dpPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#dpNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-dpclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('dpLab') && !$('dpLab').classList.contains('hidden')) close(); });

  window.DeployLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, walk: id => { UI.walk = id; draw(); }, ways: WAYS, questions: QUESTIONS, walks: WALKS };
})();
