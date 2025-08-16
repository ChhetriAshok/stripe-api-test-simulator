import { Stripe } from "stripe";
import { config } from "./config";
import { SimulationRoutes, SimulationRunner } from "./routes";

const stripeClient = new Stripe(config.stripe.apiKey as string);
const simulationRoutes = new SimulationRoutes(stripeClient);

/**
 * This method runs a simulation for a new subscription by creating a new customer on stripe
 * @param productPriceId : stripe subscription price id
 * @param advanceDays : number of days of subscription cycle for example: 30 days, 60 days etc.
 * @param simulationCount : number of subscription callbacks to simulate [ means how many invoices to create ]
 */
export async function runSimulation(
  productPriceId: string,
  advanceDays: number,
  simulationCount: number
) {
  const simulationRunner = new SimulationRunner(simulationRoutes);
  await simulationRunner.createSimulation(
    productPriceId,
    advanceDays,
    simulationCount
  );
}

/**
 * This method runs a simulation for an existing customer but will create a new subscription on stripe
 * @param productPriceId: stripe subscription price id
 * @param advanceDays: number of days of subscription cycle for example: 30 days, 60 days etc.
 * @param simulationCount: number of subscription callbacks to simulate [ means how many invoices to create ]
 * @param subscriptionId: stripe subscription id
 */

export async function runSimulationForExistingSubscription(
  productPriceId: string,
  advanceDays: number,
  simulationCount: number,
  subscriptionId: string
) {
  const simulationRunner = new SimulationRunner(simulationRoutes);
  await simulationRunner.createSimulation(
    productPriceId,
    advanceDays,
    simulationCount,
    {
      subscriptionId: subscriptionId,
    }
  );
}
