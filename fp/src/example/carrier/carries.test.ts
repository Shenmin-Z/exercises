import {
  lookupAddressFromPerson,
  lookupAddressFromPerson2,
  PhoneMap,
  CarrierMap,
  AddressMap
} from "./carrier";

let phoneMap: PhoneMap = {
  siro: "444-666",
  kaguya: "000-000",
  fubuki: "666-666"
};

let carrierMap: CarrierMap = {
  "444-661": "Petes_Plutocratic_Phones",
  "444-662": "Petes_Plutocratic_Phones",
  "444-663": "Petes_Plutocratic_Phones",
  "444-664": "Petes_Plutocratic_Phones",
  "444-665": "Petes_Plutocratic_Phones",
  "444-666": "Petes_Plutocratic_Phones",
  "666-661": "Honest_Bobs_Phone_Network",
  "666-662": "Honest_Bobs_Phone_Network",
  "666-663": "Honest_Bobs_Phone_Network",
  "666-664": "Honest_Bobs_Phone_Network",
  "000-000": "Morrisas_Marvelous_Mobiles",
  "000-001": "Morrisas_Marvelous_Mobiles",
  "000-003": "Morrisas_Marvelous_Mobiles",
  "000-005": "Morrisas_Marvelous_Mobiles"
};

let addressMap: AddressMap = {
  Petes_Plutocratic_Phones: "LaLa Land",
  Honest_Bobs_Phone_Network: "Shanghai"
};

let defaultAddress = "新日暮里";

test("carrier", () => {
  expect(
    lookupAddressFromPerson("matsuri", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual(defaultAddress);
  expect(
    lookupAddressFromPerson("siro", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual("LaLa Land");
  expect(
    lookupAddressFromPerson("kaguya", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual(defaultAddress);
  expect(
    lookupAddressFromPerson("fubuki", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual(defaultAddress);

  expect(
    lookupAddressFromPerson2("matsuri", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual(defaultAddress);
  expect(
    lookupAddressFromPerson2("siro", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual("LaLa Land");
  expect(
    lookupAddressFromPerson2("kaguya", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual(defaultAddress);
  expect(
    lookupAddressFromPerson2("fubuki", phoneMap, carrierMap, addressMap).maybe(
      defaultAddress,
      _ => _
    )
  ).toEqual(defaultAddress);
});
