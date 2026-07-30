# ShopAE – Deployment Guide

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ |
| npm | 10+ |
| WordPress | 6.4+ |
| WooCommerce | 8+ |

---

## Step 1 — WordPress Setup

### Required Plugins
Install all of these in WordPress Admin → Plugins → Add New:

| Plugin | Purpose |
|--------|---------|
| **WooCommerce** | E-commerce backend |
| **WPGraphQL** | GraphQL API for menus/ACF |
| **WPGraphQL for WooCommerce** | Products via GraphQL |
| **JWT Authentication for WP REST API** | Customer login/auth |
| **Advanced Custom Fields (ACF)** | Homepage hero/banners CMS |
| **WPGraphQL for ACF** | Exposes ACF fields to GraphQL |
| **Yoast SEO** | SEO meta tags |

### WordPress `wp-config.php` additions
Add these lines before `/* That's all, stop editing! */`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-same-jwt-secret-from-env');
define('JWT_AUTH_CORS_ENABLE', true);
```

### WooCommerce REST API Keys
1. WordPress Admin → WooCommerce → Settings → Advanced → REST API
2. Click **Add Key**
3. Description: `ShopAE Frontend`
4. Permissions: **Read/Write**
5. Click **Generate API key**
6. Copy `Consumer Key` → `WC_CONSUMER_KEY` in `.env.local`
7. Copy `Consumer Secret` → `WC_CONSUMER_SECRET` in `.env.local`

### WordPress Webhooks (Cache Revalidation)
1. WordPress Admin → WooCommerce → Settings → Advanced → Webhooks
2. Add webhook for each event:
   - **Product created/updated/deleted** → Delivery URL: `https://your-site.com/api/revalidate`
   - **Product category created/updated** → same URL
3. Add header: `X-Revalidation-Secret: your-revalidation-secret`

---

## Step 2 — Next.js Environment

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Key variables to update:

```env
NEXT_PUBLIC_WP_URL=https://your-wordpress.com
NEXT_PUBLIC_SITE_URL=https://your-store.com
WP_HOSTNAME=your-wordpress.com
WC_CONSUMER_KEY=ck_your_key
WC_CONSUMER_SECRET=cs_your_secret
JWT_SECRET=your_jwt_secret_matching_wp_config
REVALIDATION_SECRET=your_webhook_secret
```

---

## Step 3 — Local Development

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

---

## Step 4 — Production Build

```bash
npm run build
npm run start
```

---

## Step 5 — Deployment Options

### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Add all `.env.local` variables in Vercel Dashboard → Project → Settings → Environment Variables.

### Option B: VPS / Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t shopae .
docker run -p 3000:3000 --env-file .env.local shopae
```

### Option C: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-store.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-store.com;

    ssl_certificate     /etc/letsencrypt/live/your-store.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-store.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Step 6 — ACF Homepage Setup

In WordPress Admin → ACF → Field Groups, create a group for the Homepage with these fields:

| Field Name | Type | Purpose |
|-----------|------|---------|
| `hero_slides` | Repeater | Hero banner slides |
| `hero_slides > title` | Text | Slide heading |
| `hero_slides > subtitle` | Text | Slide subheading |
| `hero_slides > button_text` | Text | CTA button label |
| `hero_slides > button_url` | URL | CTA button link |
| `hero_slides > image` | Image | Desktop background |
| `promo_banners` | Repeater | Promo section banners |
| `brand_logos` | Repeater | Brand carousel |

---

## Step 7 — Post-Launch Checklist

- [ ] WordPress SSL active
- [ ] WooCommerce tax settings configured
- [ ] Shipping zones set up
- [ ] Payment gateways configured (COD, Stripe, etc.)
- [ ] All `.env.local` values filled with production values
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Webhook secrets match between WP and `.env.local`
- [ ] Google Analytics / GTM added (optional)
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
