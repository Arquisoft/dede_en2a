import { Rate } from "../shared/shareddtypes";

export async function getRates(
  weight: number,
  postalCode: string
): Promise<Rate[]> {
  const carrierApiEndPoint =
    process.env.REACT_APP_CARRIERS_API_URI || "http://localhost:8000";
  let response = await fetch(
    carrierApiEndPoint + "/rates?weight=" + weight + "&to=" + postalCode
  );
  return response.json();
}
