import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrlAll,
  Thing,
  getUrl,
} from "@inrupt/solid-client";

import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

async function getProfile(webId: string): Promise<Thing> {
  let profileDocumentURI = webId.split("#")[0]; // we remove the right hand side of the # for consistency
  let myDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI
  return getThing(myDataset, webId) as Thing; // we obtain the thing we are looking for from the dataset
}

export async function getNameFromPod(webId: string) {
  return getStringNoLocale(await getProfile(webId), FOAF.name) as string;
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

export async function getAddressesFromPod(webId: string) {
  let addressURLs = getUrlAll(await getProfile(webId), VCARD.hasAddress);
  let addresses: string[] = [];

  for (let addressURL of addressURLs) {
    let address = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.street_address
    );
    let locality = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.locality
    );
    let region = getStringNoLocale(await getProfile(addressURL), VCARD.region);
    let postal_code = getStringNoLocale(
      await getProfile(addressURL),
      VCARD.postal_code
    );

    if (address)
      addresses.push(`${address} - ${locality}, ${region} - ${postal_code}`);
  }

  return addresses;
}
