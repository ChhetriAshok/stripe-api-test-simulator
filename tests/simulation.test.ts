import { test } from "@playwright/test";
import { runSimulation, runSimulationForExistingSubscription } from "..";

test.describe("Simulation Tests", () => {
  test("Create simulation for new customer", async ({}) => {
    test.setTimeout(120000);
    await runSimulation("price_*****", 31, 4);
  });

  test("Create simulation for existing customer", async ({}) => {
    test.setTimeout(120000);
    await runSimulationForExistingSubscription(
      "price_*****",
      31,
      4,
      "sub_*****"
    );
  });
});
