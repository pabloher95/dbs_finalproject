# Project Proposal: SmallBiz IQ

## One-Line Description
A small business inventory and sales intelligence platform that helps micro-business owners know what to buy, when to buy it, and how their business is performing.

## The Problem
Micro-business owners — people running small product-based businesses — often manage everything through spreadsheets, Instagram DMs, and mental math. They lack visibility into what inventory they need, what their margins look like, and when demand is coming. Enterprise tools are overkill and expensive. They don't need an ERP — they need a smart, simple dashboard that turns their messy data into clear decisions.

## Target User
Solo operators and micro-business owners (1-5 people) who sell physical product bundles — cocktail kits, meal prep boxes, craft supplies, gift baskets — and currently manage orders and inventory through spreadsheets and social media.

## Core Features (v1)
1. **Spreadsheet import** — upload existing order and product data (CSV) to bootstrap the system
2. **Product/recipe management** — define product bundles and their individual ingredients with costs
3. **Order tracking** — log incoming orders with status (received, packed, delivered)
4. **Inventory shopping list** — given upcoming orders and kit recipes, generate a list of exactly what ingredients to buy and in what quantities
5. **Supplier and client directory** — store contact info for suppliers and clients in one place

## Tech Stack
- Frontend: Next.js — recommended stack, good for a data-heavy dashboard app, and a valuable learning opportunity
- Styling: Tailwind CSS — fast to prototype, pairs well with Next.js
- Database: Supabase (PostgreSQL) — relational data (orders, products, ingredients, contacts) is a natural fit; strong SQL background makes this a good match
- Auth: Clerk — simple to set up, keeps the dashboard private to the business owner
- APIs: None required for v1. Potential future integrations with Google Sheets, WhatsApp Business, or supplier catalogs
- Deployment: Vercel — seamless with Next.js, free tier is sufficient
- MCP Servers: Supabase MCP (database management), Playwright MCP (end-to-end testing of the dashboard)

## Stretch Goals
- **Demand forecasting** — use historical order data to predict upcoming demand by product and ingredient, surfacing "you'll probably need X by next week" insights
- **Cost and margin analysis** — track ingredient costs vs. sale prices per bundle, show profit margins over time
- **Revenue dashboard** — visualize sales trends, seasonal patterns (e.g., December spikes), top products, and top clients
- **Simple order intake form** — a shareable link customers can use to place orders directly, replacing Instagram DMs
- **Smart reorder alerts** — notify when ingredient stock is likely to run low based on order patterns
- **Multi-business support** — generalize the data model so other small businesses can onboard with their own products and recipes

## Biggest Risk
The frontend is the biggest technical risk — strong Python, SQL, and backend experience but limited React/Next.js knowledge. Building a polished, usable dashboard in a new framework while also modeling the data layer is a real challenge. The mitigation is Claude Code, which can accelerate the frontend learning curve significantly. The second risk is scope creep — the forecasting and analytics features are exciting but could eat weeks without a solid core CRUD foundation first.

## Week 5 Goal
A working web app deployed on Vercel where a business owner can:
- Import existing spreadsheet data
- See product bundles and their ingredient breakdowns
- Log new orders
- Generate a shopping list of exactly what to buy for upcoming orders
- Look up supplier and client contact info

This is the "prove the idea works" version — if the first user actually uses it instead of their spreadsheet, the core is validated.
