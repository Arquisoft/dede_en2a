import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getStringNoLocaleAll,
  Thing,
} from "@inrupt/solid-client";

import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

async function getProfile(webId: string): Promise<Thing> {
  let profileDocumentURI = webId.split("#")[0]; // we remove the right hand side of the # for consistency
  let myDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI
  return getThing(myDataset, webId) as Thing; // we obtain the thing we are looking for from the dataset
}

export async function getAddressFromPod(webId: string) {
  return getStringNoLocale(
    await getProfile(webId),
    VCARD.street_address
  ) as string;
}

export async function getNameFromPod(webId: string) {
  return getStringNoLocale(await getProfile(webId), FOAF.name) as string;
}

export async function getEmailsFromPod(webId: string) {
  return getStringNoLocaleAll(await getProfile(webId), VCARD.hasEmail);
}
