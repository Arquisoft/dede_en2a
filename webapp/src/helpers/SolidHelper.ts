import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrlAll,
  Thing,
  getUrl,
  removeUrl,
  buildThing,
  createThing,
  saveSolidDatasetAt,
  setThing,
  removeThing,
} from "@inrupt/solid-client";

import { fetch } from "@inrupt/solid-client-authn-browser";

import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";
import { Address } from "../shared/shareddtypes";

async function getProfile(webId: string): Promise<Thing> {
  let profileDocumentURI = webId.split("#")[0]; // we remove the right hand side of the # for consistency
  let myDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI
  return getThing(myDataset, webId) as Thing; // we obtain the thing we are looking for from the dataset
}

export async function getNameFromPod(webId: string) {
  if (webId === "" || webId === undefined) return "Name not found"; // we return the empty string
  let name = getStringNoLocale(await getProfile(webId), FOAF.name);
  return name !== null ? name : "No name :(";
}

export async function getEmailsFromPod(webId: string) {
  let emailURLs = getUrlAll(await getProfile(webId), VCARD.hasEmail);
  let emails: string[] = [];

  for (let emailURL of emailURLs) {
    let email = getUrl(await getProfile(emailURL), VCARD.value);
    if (email) emails.push(email.toString().replace("mailto:", "")); // we remove the mailto: part
  }

  return emails;
}

export async function getAddressesFromPod(webId: string): Promise<Address[]> {
  let addressURLs = getUrlAll(await getProfile(webId), VCARD.hasAddress);
  let addresses: Address[] = [];

  for (let addressURL of addressURLs) {
    let address = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.street_address
    );
    let locality = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.locality
    ) as string;
    let region = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.region
    ) as string;
    let postal_code = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.postal_code
    ) as string;

    if (address)
      addresses.push({
        street: address,
        postalCode: postal_code,
        locality: locality,
        region: region,
        url: addressURL,
      });
  }

  return addresses;
}

export function toStringAddress(address: Address): string {
  return `${address.street}, ${address.postalCode}, ${address.locality}, ${address.region}`;
}

export async function addAddressToPod(webId: string, address: Address) {
  let profileDocumentURI = webId.split("#")[0]; // we remove the right hand side of the # for consistency
  let solidDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI

  // We create the address
  const newAddressThing = buildThing(createThing())
    .addStringNoLocale(VCARD.street_address, address.street)
    .addStringNoLocale(VCARD.locality, address.locality)
    .addStringNoLocale(VCARD.region, address.region)
    .addStringNoLocale(VCARD.postal_code, address.postalCode)
    .addUrl(VCARD.Type, VCARD.street_address)
    .build();

  // We have to store also the hasAddress :)
  let hasAddress = getThing(solidDataset, VCARD.hasAddress) as Thing;
  if (hasAddress === null)
    // we create the thing as it has not been done before :(
    hasAddress = buildThing(await getProfile(webId))
      .addUrl(VCARD.hasAddress, newAddressThing.url)
      .build();
  else
    hasAddress = buildThing(hasAddress)
      .addUrl(VCARD.hasAddress, newAddressThing.url)
      .build();

  solidDataset = setThing(solidDataset, newAddressThing);
  solidDataset = setThing(solidDataset, hasAddress);

  return await saveSolidDatasetAt(webId, solidDataset, { fetch: fetch });
}

export async function editAddressFromPod(webId: string, address: Address) {
  if (address.url === undefined) return Promise.reject(); // No URL has been provided

  let profileDocumentURI = webId.split("#")[0]; // we remove the right hand side of the # for consistency
  let solidDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI

  // We obtain the address from the POD
  let addressToEditThing = getThing(solidDataset, address.url) as Thing;

  // In case nothing has been retrieved :(
  if (addressToEditThing === null) return Promise.reject();

  // We modify the address in the POD
  addressToEditThing = buildThing(addressToEditThing)
    .setStringNoLocale(VCARD.street_address, address.street)
    .setStringNoLocale(VCARD.locality, address.locality)
    .setStringNoLocale(VCARD.region, address.region)
    .setStringNoLocale(VCARD.postal_code, address.postalCode)
    .build();

  solidDataset = setThing(solidDataset, addressToEditThing);

  return await saveSolidDatasetAt(webId, solidDataset, { fetch: fetch });
}

export async function deleteAddressFromPod(webId: string, url: string) {
  let profileDocumentURI = webId.split("#")[0]; // we remove the right hand side of the # for consistency
  let solidDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI

  // We obtain the address from the POD and the hasAddress
  let address = getThing(solidDataset, url) as Thing;
  let hasAddress = buildThing(await getProfile(webId))
    .removeUrl(VCARD.hasAddress, url)
    .build();

  if (hasAddress === null || address === null) return Promise.reject();
  // We remove the address
  solidDataset = removeThing(solidDataset, address);
  // We remove the link to hasAddress
  hasAddress = removeUrl(hasAddress, VCARD.hasAddress, url);
  solidDataset = setThing(solidDataset, hasAddress);

  return await saveSolidDatasetAt(webId, solidDataset, { fetch: fetch });
}
