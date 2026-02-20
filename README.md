# right-intake-website-backend

**Backend for Right Intake web platform operations.**

## Problem
Web product experiences require reliable backend support for onboarding, account flows, and premium feature gating.

## Solution
This service layer supports website-connected user journeys and monetized nutrition capabilities.

## Architecture
**Current stack signals:** Node.js, Express, MongoDB

- Web API backend
- Auth and user-state handling
- Feature entitlement/payment checks
- Integration with core nutrition services

## Scale
Designed to support marketing spikes and recurring user sessions.

## Monetization
Supports conversion, subscription lifecycle, and premium entitlements.

## Roadmap
- Faster onboarding APIs
- Cohort retention instrumentation
- Checkout optimization

## Quick start
```bash
npm install
npm start
```

## Useful scripts
- `npm run start` — node src/app.js
- `npm run test` — echo "Error: no test specified" && exit 1
