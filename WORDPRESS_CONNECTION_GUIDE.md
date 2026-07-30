# 🚀 ShopAE Headless WooCommerce & WordPress Setup Guide

This Next.js 16 storefront is fully built, styled in Forest Green (`#2E6F40`), and pre-wired to connect seamlessly with any WordPress + WooCommerce installation.

---

## 🛠️ Step 1: Install Required Plugins in WordPress

Log in to your WordPress admin panel (`https://your-wordpress-site.com/wp-admin`) and install the following plugins:

1. **WooCommerce** *(Core e-commerce engine for products, categories, orders, & payments)*
2. **WPGraphQL** *(Ultra-fast GraphQL API for menus and catalog data)*
3. **WPGraphQL WooCommerce** (WooGraphQL) *(Exposes WooCommerce via GraphQL)*
4. **Advanced Custom Fields (ACF)** or **ACF PRO** *(For product custom tabs: Ingredients, How to Use, Safety, FAQs, Features & Banner Images)*
5. **JWT Authentication for WP REST API** *(For customer login & registration tokens)*

---

## 🔑 Step 2: Generate WooCommerce API Keys

1. In WordPress Admin, go to: **WooCommerce → Settings → Advanced → REST API**.
2. Click **Add Key**.
3. Description: `ShopAE Next.js Storefront`.
4. User: Select your Admin user.
5. Permissions: **Read/Write**.
6. Click **Generate API Key**.
7. Copy your **Consumer Key** (`ck_...`) and **Consumer Secret** (`cs_...`).

---

## ⚙️ Step 3: Connect WordPress in `.env.local`

Open `.env.local` in your Next.js project root (`c:\Users\DragonV\Desktop\shopae\.env.local`) and paste your live site details:

```env
# WordPress Live URLs
NEXT_PUBLIC_WP_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WP_REST_URL=https://your-wordpress-site.com/wp-json
NEXT_PUBLIC_STORE_API_URL=https://your-wordpress-site.com/wp-json/wc/store/v1
NEXT_PUBLIC_GRAPHQL_URL=https://your-wordpress-site.com/graphql

# WooCommerce API Keys (From Step 2)
WC_CONSUMER_KEY=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WC_CONSUMER_SECRET=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Site Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ShopAE
NEXT_PUBLIC_CURRENCY=AED
NEXT_PUBLIC_CURRENCY_SYMBOL=د.إ
WHATSAPP_NUMBER=+971500000000
```

---

## 📦 Step 4: Product Custom Tabs (ACF Setup)

Your Next.js product page includes 10 dynamic tabs. Tabs automatically show up when filled in WordPress and **auto-hide** when empty:

| Tab Name | ACF Field Name | Type |
| :--- | :--- | :--- |
| **Features & Benefits** | `features_benefits` | Repeater / Textarea |
| **Description** | `description` | Native Product Description |
| **Specification** | `specification` | Key/Value Repeater or Native Attributes |
| **Ingredients** | `ingredients` | WYSIWYG / Textarea |
| **Included Makeup Brushes** | `included_makeup_brushes` | Textarea / List |
| **How To Use** | `how_to_use` | Textarea |
| **Safety & Warnings** | `safety` | Textarea |
| **FAQs** | `faqs` | Repeater (question, answer) |
| **Shipping & Returns** | `shipping_returns` | Textarea |
| **Customer Reviews** | Native WooCommerce Reviews | Native Star Rating & Comment |

---

## 🎨 Step 5: Upload Banner Images & Manage Menus

### Banner Sliders & Promos:
- Hero slider slides and promotional banners can be uploaded in **ACF Options Page** or as **Posts** in category `banners`.

### Navigation Menus:
1. Go to **Appearance → Menus** in WordPress.
2. Create a Menu named `Primary Menu`.
3. Add your Categories (*Vitamins & Supplements*, *Skincare & Beauty*, *Personal Care*, etc.).
4. Assign location to **Primary Menu**.

---

## 🚀 Step 6: Start Development Server

Once `.env.local` is saved with your live URLs:

```bash
npm run dev
```

Your Next.js store at `http://localhost:3000` will fetch live products, categories, variation swatches, and cart items directly from your WordPress backend!
