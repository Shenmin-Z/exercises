import { Maybe, ofMaybe, ofNothing } from "../../monad";

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
    return ofMaybe<any>(map[key]);
  } else {
    return ofNothing();
  }
};

export let lookupAddressFromPerson = (
  person: PersonName,
  phoneMap: PhoneMap,
  carrierMap: CarrierMap,
  addressMap: AddressMap
): Maybe<BillingAddress> =>
  lookup<string>(person)(phoneMap)
    .bind(num => lookup<string>(num)(carrierMap))
    .bind(carrier => lookup<string>(carrier)(addressMap));

type Lookup2 = {
  <V>(m: { [s: string]: V }): (key: string) => Maybe<V>;
};

let lookup2: Lookup2 = map => key => {
  if (map[key] !== undefined) {
    return ofMaybe<any>(map[key]);
  } else {
    return ofNothing();
  }
};

export let lookupAddressFromPerson2 = (
  person: PersonName,
  phoneMap: PhoneMap,
  carrierMap: CarrierMap,
  addressMap: AddressMap
): Maybe<BillingAddress> =>
  lookup2<string>(phoneMap)(person)
    .bind(lookup2<string>(carrierMap))
    .bind(lookup2<string>(addressMap));
