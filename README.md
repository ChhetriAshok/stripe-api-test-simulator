# Stripe API Test Simulator

A Node.js library to simulate Stripe API requests and responses for testing purposes. Useful for integration testing, development, and CI/CD pipelines without making real Stripe API calls.

## Features

- Simulate Stripe API endpoints and responses
- Customizable test data using [@ngneat/falso](https://github.com/ngneat/falso)
- Built-in utilities for common Stripe objects
- Easy integration with Playwright and other test frameworks

## Installation

```bash
npm install stripe-api-test-simulator
```

## Usage

```ts
const {
  runSimulation,
  runSimulationForExistingSubscription,
} = require("stripe-api-test-simulator");

// Simulate a subscription
await runSimulation("price_*****", 31, 4);

Here’s what it does:
"price_*****": This is a Stripe price ID, representing the product or subscription price you want to simulate.
31: Likely represents the number of days to simulate (e.g., simulating a monthly subscription for 31 days).
4: Probably the number of billing cycles or periods to simulate (e.g., simulate 4 months).

```

## Functions

- runSimulation(priceId, subscriptionCycleDays, sumulationCount) ` – Simulate a newly created subscription on stripe

- runSimulationForExistingSubscription(priceId,subscriptionId, subscriptionCycleDays, sumulationCount) - is useful for testing how your system handles renewals, payments, and other events for subscriptions that already exist in Stripe, without making real API calls but we need to make sure test clock is already integrated on that subscription as stripe doesn't allow to update test clock on existing customer or subscription.

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas.
