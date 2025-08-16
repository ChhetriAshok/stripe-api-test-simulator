import {
  randCity,
  randFullName,
  randEmail,
  randCountry,
  randStreetAddress,
  randZipCode,
} from "@ngneat/falso";

export const Fakers = {
  name: randFullName(),
  email: randEmail(),
  randomAddress: {
    city: randCity(),
    country: randCountry(),
    line1: randStreetAddress(),
    postal_code: randZipCode(),
  },
};

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
