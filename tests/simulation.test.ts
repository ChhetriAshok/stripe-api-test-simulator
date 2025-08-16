import { test } from "@playwright/test";
import { runSimulation, runSimulationForExistingSubscription } from "..";

test.describe("Simulation Tests", () => {
  test("Create simulation for new customer", async ({}) => {
    test.setTimeout(120000);
    await runSimulation("price_1Rvf6EByVlfITvRXxA0N9yQ5", 31, 4);
  });

  test("Create simulation for existing customer", async ({}) => {
    test.setTimeout(120000);
    await runSimulationForExistingSubscription(
      "price_1RwfwLByVlfITvRXHR5umy9P",
      31,
      4,
      "sub_1RwgKMByVlfITvRXzq60jPcC"
    );
  });
});
