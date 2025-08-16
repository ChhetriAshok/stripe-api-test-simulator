import { SimulationRoutes } from "./simulation";

export class SimulationRunner {
  simulationRoutes: SimulationRoutes;
  constructor(simulationRoutes: SimulationRoutes) {
    this.simulationRoutes = simulationRoutes;
  }

  async createSimulation(
    productPriceId: string,
    advanceDays: number,
    simulationCount: number,
    meta?: {
      subscriptionId?: string;
    }
  ) {
    let subscriptionId = meta?.subscriptionId;
    let subscription: any;
    let clockId: any;
    if (!meta?.subscriptionId) {
      const clock = await this.simulationRoutes.createTestClock();
      clockId = clock.clockId;
      const { customerId } = await this.simulationRoutes.createCustomer(
        clockId
      );
      subscription = await this.simulationRoutes.createSubscription(
        customerId,
        productPriceId
      );
      subscriptionId = subscription.subscriptionId;
    } else {
      subscription = await this.simulationRoutes.getSubscription(
        meta?.subscriptionId as string
      );
      if (!subscription.testClockId)
        throw new Error(
          "Subscription does not have a test clock associated with it"
        );
      clockId = subscription.testClockId;
      subscriptionId = subscription.subscriptionId;
    }
    const invoice = await this.simulationRoutes.getInvoice(
      subscription.invoiceId as string
    );
    if (invoice.status !== "paid")
      await this.simulationRoutes.payInvoice(subscription.invoiceId as string);
    await this._advanceClock_FetchInvoice_Pay(
      clockId,
      subscription.customerId,
      subscriptionId,
      advanceDays,
      simulationCount
    );
    await this.simulationRoutes.deleteTestClock(clockId);
  }

  private async _advanceClock_FetchInvoice_Pay(
    testClockId: string,
    customerId: string,
    subscriptionId: string,
    advanceDays: number,
    simulationCount: number
  ) {
    if (simulationCount < 1) {
      throw new Error("Simulation count must be greater than or equal to 1");
    }
    for (
      let invoiceCount = 2;
      invoiceCount <= simulationCount;
      invoiceCount++
    ) {
      const days = advanceDays * (invoiceCount - 1);
      await this.simulationRoutes.advanceTestClock(testClockId, days);
      await this.simulationRoutes.waitTillTestClockReady(testClockId);
      const { invoices } = await this.simulationRoutes.fetchInvoices(
        customerId,
        subscriptionId,
        invoiceCount
      );
      if (invoices.length === invoiceCount) {
        const invoiceId = invoices[0].id as string;
        if (invoices[0].status !== "paid") {
          await this.simulationRoutes.payInvoice(invoiceId);
        } else {
          console.log("Invoice is showing already paid");
        }
      }
    }
  }
}
