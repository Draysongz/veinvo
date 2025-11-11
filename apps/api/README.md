Veinvo API (TypeScript)

Getting Started

1. Install dependencies from repo root:

   - npm install

2. Create an .env file in apps/api with:

   - NODE_ENV, PORT
   - SUPABASE*URL, SUPABASE*
   - PAYSTACK_SECRET_KEY, FLUTTERWAVE_SECRET_KEY
   - MONNIFY_API_KEY, MONNIFY_SECRET_KEY
   - PAYMENT_REDIRECT_URL

3. Run the API in dev mode:

   - npm run dev --workspace @veinvo/api

4. Health check:
   - GET http://localhost:4000/health

Scripts

- build: tsc compile to dist
- dev: tsx watch src/server.ts
- start: run compiled server

Project Structure

- src/server.ts: entry HTTP server
- src/app.ts: Express app setup and routes
- src/routes: routers (health, invoices, payments, clients, expenses, auth)
- src/controllers: request handlers
- src/services: business logic
- src/integrations: payment and notification providers
- src/db/supabase.ts: Supabase client
- src/config: env validation (Zod)
- src/middlewares: error handling

Notes

- Payment providers are stubbed; add signature verification logic before production use.
- Supabase schema should contain an invoices table matching src/types.

Veinvo: Smart Invoicing and Payment Platform for
Africa
Tagline: Keep your cashflow alive.

1. Overview
   Veinvo is a smart invoicing and payment platform designed for freelancers, agencies, and
   small businesses across Africa.
   It helps users create branded invoices, send them instantly via WhatsApp or email, and
   receive payments through trusted local gateways like Paystack, Flutterwave, and Monnify.
   Unlike traditional invoicing tools built for Western markets, Veinvo understands the African
   payment landscape by integrating local currencies, payment links, QR codes, and
   mobile-first workflows.
2. Problem
   Across Africa, freelancers and SMEs face challenges such as:
   ●
   Unpaid or delayed invoices
   ●
   Complicated payment processes across banks and gateways
   ●
   Lack of professional tools to manage invoices and expenses
   ●
   Poor visibility into cashflow and client behaviour
   Most global invoicing apps do not support local payment gateways or regional nuances
   like WhatsApp-based business communication.
3. Solution
   Veinvo simplifies getting paid.
   Users can:
   ●
   ●
   Create branded invoices with custom logo, colours, and payment links
   Send invoices instantly through WhatsApp, email, or SMS
   ●
   ●
   Receive payments via Paystack, Flutterwave, or Monnify through API integration
   Automate reminders, receipts, and client analytics in one dashboard
   Veinvo provides a single, mobile-first system built for Africa’s business realities.
4. Key Features
   Invoice and Payments
   ●
   Branded invoice creation
   ●
   Instant share via WhatsApp, email, or PDF link
   ●
   Smart payment links and QR code support
   ●
   Automatic receipts after payment confirmation
   ●
   Multi-currency support (NGN, GHS, KES, and future USD stablecoin options)
   Client Management
   ●
   Client directory with payment history
   ●
   Analytics showing top payers and late payers
   ●
   Lifetime value tracking
   Automation
   ●
   ●
   ●
   Automatic payment reminders (3 days, 1 day, overdue)
   Auto-generated thank-you messages
   Recurring invoices and subscription billing
   Expense Tracking
   ●
   Upload receipts or log expenses manually
   ●
   Categorize spending (utilities, software, salaries)
   ●
   Profit and loss summaries and monthly reports
   Dashboard and Reports
   ●
   Revenue trends and overdue invoice tracking
   ●
   Average payment times
   ●
   Expense versus income ratio
   ●
   Export to Excel or PDF and integrate with accounting tools in future updates

5. Revenue Model
6. Freemium Plan
   a. Up to 5 invoices per month
   b. Basic analytics
7. Pro Plan (₦3,500/month or ₦30,000/year)
   a. Unlimited invoices
   b. Branded templates
   c. Automated reminders
   d. Client analytics and expense tracking
8. Enterprise Plan (Custom)
   a. Team accounts
   b. API access
   c. White-label branding
9. Transaction Fee
   a. 1% service fee on transactions processed through Veinvo (in addition to
   gateway fees)
10. Technology Stack

Backend Node.js and Express
Database Supabase or PostgreSQL
Payments Paystack, Flutterwave, Monnify APIs
Notifications Twilio, WhatsApp API, EmailJS
Authentication Supabase Auth or Wallet Connect (future)

Name: Veinvo
Meaning: “Vein” for flow and lifeline,
of payments.
Logo: Minimalist V-shape forming a network or vein pattern
Colours: Deep Blue (trust), Teal (growth), White (clarity)
Tone: Modern, confident, African-built but globally appealing
“Invo” for invoice. Together, it represents the flow 10. Long-Term Vision
Veinvo aims to become Africa’s financial backbone for freelancers and small businesses,
enabling seamless invoice-to-payment experiences across borders.
Future expansions include:
●
SME credit scoring using invoice history
●
Cross-border payment support
●
Business tool ecosystem (accounting, payroll, analytics)
\*Veinvo is designed to be the financial bloodstream of African entrepreneurship.

-
