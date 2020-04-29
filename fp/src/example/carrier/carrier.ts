import { Maybe } from "../../monad";

export type PersonName = string;
export type PhoneNumber = string;
export type BillingAddress = string;
export type MobileCarrier =
  | "Honest_Bobs_Phone_Network"
  | "Morrisas_Marvelous_Mobiles"
  | "Petes_Plutocratic_Phones";

export type PhoneMap = { [s: string]: PhoneNumber };
export type CarrierMap = { [s: string]: MobileCarrier };
export type AddressMap = { [s: string]: BillingAddress };

type Lookup = {
  <V>(key: string): (m: { [s: string]: V }) => Maybe<V>;
};

let lookup: Lookup = key => map => {
  if (map[key] !== undefined) {
    return new Maybe("Just", map[key]);
  } else {
    return new Maybe("Nothing");
  }
};

export let lookupAddressFromPerson = (
  person: PersonName,
  phoneMap: PhoneMap,
  carrierMap: CarrierMap,
  addressMap: AddressMap
): Maybe<BillingAddress> =>
  lookup<string>(person)(phoneMap)
    .chain(num => lookup<string>(num)(carrierMap))
    .chain(carrier => lookup<string>(carrier)(addressMap));
