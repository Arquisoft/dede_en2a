export function retrievePickUpLocationsJSON(
  coordinates: string,
  apiKey: string
) {
  let request =
    "https://api.geoapify.com/v2/places?categories=commercial&filter=circle:";
  request += coordinates; // include the point around which we will have to compute the result
  request += ",500&bias=proximity:";
  request += coordinates; // the results have to be close to the coordinates
  request += "&limit=20&apiKey=" + apiKey; // don't forget the apiKey

  let requestOptions = {
    method: "GET",
  };

  fetch(request, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
