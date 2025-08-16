import { Stripe } from "stripe";
import { Fakers, sleep } from "../utils";
import moment from "moment";

export class SimulationRoutes {
  stripeClient: Stripe;

  constructor(stripeClient: Stripe) {
    this.stripeClient = stripeClient;
  }

  createTestClock = async () => {
    try {
      const response = await this.stripeClient.testHelpers.testClocks.create({
        frozen_time: Math.floor(Date.now() / 1000),
      });
      return { clockId: response.id };
    } catch (error: any) {
      throw new Error(`Failed to create test clock: ${error.message}`);
    }
  };

  advanceTestClock = async (testClockId: string, advanceDays: number) => {
    try {
      const response = await this.stripeClient.testHelpers.testClocks.advance(
        testClockId,
        {
          frozen_time: moment().add(advanceDays, "days").unix(),
        }
      );
      return { testClockId: response.id, frozenTime: response.frozen_time };
    } catch (error: any) {
      throw new Error(
        `Failed to advance test clock (${testClockId}): ${error.message}`
      );
    }
  };

  deleteTestClock = async (testClockId: string) => {
    try {
      await this.stripeClient.testHelpers.testClocks.del(testClockId);
    } catch (error: any) {
      throw new Error(
        `Failed to delete test clock (${testClockId}): ${error.message}`
      );
    }
  };

  waitTillTestClockReady = async (testClockId: string) => {
    try {
      let counter = 1;
      let response = await this.stripeClient.testHelpers.testClocks.retrieve(
        testClockId
      );
      while (response.status !== "ready") {
        if (counter >= 20) {
          throw new Error(
            `Test clock (${testClockId}) did not become ready in time`
          );
        }
        counter++;
        await sleep(5);
        response = await this.stripeClient.testHelpers.testClocks.retrieve(
          testClockId
        );
      }

      return { testClockStatus: response.status };
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve test clock (${testClockId}): ${error.message}`
      );
    }
  };

  createCustomer = async (
    testClockId?: string,
    email?: string,
    name?: string
  ) => {
    try {
      const response = await this.stripeClient.customers.create({
        email: email || Fakers.email,
        name: name || Fakers.name,
        test_clock: testClockId || undefined,
        payment_method: "pm_card_visa",
        invoice_settings: {
          default_payment_method: "pm_card_visa",
        },
        address: {
          city: Fakers.randomAddress.city,
          country: Fakers.randomAddress.country,
          line1: Fakers.randomAddress.line1,
          postal_code: Fakers.randomAddress.postal_code,
        },
        shipping: {
          name: Fakers.name,
          address: {
            city: Fakers.randomAddress.city,
            country: Fakers.randomAddress.country,
            line1: Fakers.randomAddress.line1,
            postal_code: Fakers.randomAddress.postal_code,
          },
        },
      });
      return { customerId: response.id };
    } catch (error: any) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  };

  createSubscription = async (
    customerId: string,
    priceId: string,
    trialEndDays?: number,
    quantity = 1
  ) => {
    try {
      const trialEnd = trialEndDays
        ? moment().add(trialEndDays, "days").unix()
        : undefined;
      const response = await this.stripeClient.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        trial_end: trialEnd,
      });
      return {
        subscriptionId: response.id,
        invoiceId: response.latest_invoice,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to create subscription for customer (${customerId}): ${error.message}`
      );
    }
  };

  getSubscription = async (subscriptionId: string) => {
    try {
      const response = await this.stripeClient.subscriptions.retrieve(
        subscriptionId
      );
      return {
        subscriptionId: response.id,
        customerId: response.customer,
        status: response.status,
        testClockId: response.test_clock,
        invoiceId: response.latest_invoice,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch subscription (${subscriptionId}): ${error.message}`
      );
    }
  };

  payInvoice = async (invoiceId: string) => {
    try {
      const response = await this.stripeClient.invoices.pay(invoiceId);
      return { invoiceId: response.id, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to pay invoice (${invoiceId}): ${error.message}`);
    }
  };

  getInvoice = async (invoiceId: string) => {
    try {
      const response = await this.stripeClient.invoices.retrieve(invoiceId);
      return {
        invoiceId: response.id,
        customerId: response.customer,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch invoice (${invoiceId}): ${error.message}`
      );
    }
  };

  fetchInvoices = async (
    customerId: string,
    subscriptionId: string,
    invoiceCount: number
  ) => {
    try {
      let count = 1;
      let response = await this.stripeClient.invoices.list({
        customer: customerId,
        subscription: subscriptionId,
      });
      while (count < 10) {
        if (response.data.length === invoiceCount) break;
        if (count > 10) {
          throw new Error(
            `Fetch new invoices exceeded maximum retries ${count}`
          );
        }
        count++;
        await sleep(2);
        response = await this.stripeClient.invoices.list({
          customer: customerId,
          subscription: subscriptionId,
        });
      }

      return { invoices: response.data };
    } catch (error: any) {
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }
  };
}
