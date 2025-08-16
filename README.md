# Stripe API Test Simulator

A Node.js library to simulate Stripe API requests and responses for testing purposes. Useful for integration testing, development, and CI/CD pipelines without making real Stripe API calls.

## Features

- Simulate Stripe API endpoints and responses
- Built-in utilities for common Stripe objects
- Easy integration with Playwright and other test frameworks

## Installation

```bash
npm install stripe-api-test-simulator@latest
```

## Usage

```ts
import { runSimulation, runSimulationForExistingSubscription } from "stripe-api-test-simulator";

// Simulate a subscription
await runSimulation("price_*****", 31, 4);

Here’s what it does:
"price_*****": This is a Stripe price ID, representing the product or subscription price you want to simulate.
31: Likely represents the number of days to simulate (e.g., simulating a monthly subscription for 31 days).
4: Probably the number of billing cycles or periods to simulate (e.g., simulate 4 months).

```

## Functions

1. runSimulation(priceId, subscriptionCycleDays, simulationCount)
   Purpose: Simulates a newly created subscription on Stripe.

When to use:

Testing subscription lifecycles from scratch (new customers, new subscriptions).

Useful for validating how your system handles initial setup and billing cycles.

2. runSimulationForExistingSubscription(priceId, subscriptionId, subscriptionCycleDays, simulationCount)
   Purpose: Simulates events for an already existing subscription in Stripe.

When to use:

Testing how your system handles renewals, payments, and other recurring events.

Important Requirement:

The subscription must already have a test clock attached.

⚠️ Stripe does not allow attaching a test clock to an existing customer or subscription later.

Make sure the test clock integration is set up at the time of subscription creation.

👉 Summary:

Use runSimulation for new subscriptions.

Use runSimulationForExistingSubscription for renewals and recurring events, but only if a test clock was attached during creation.

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas.
