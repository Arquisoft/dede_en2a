import { RequestHandler } from "express";
import { ratesModel } from "../models/Rates";

//Get the rates given a weight
export const getCarrierRates: RequestHandler = async (req, res) => {
  const { weight } = req.query;
  const { to } = req.query;
  if (!weight) {
    res.status(400).send("Missing weight");
    return;
  }
  let weightNumber = Math.round(parseFloat(weight as string));
  if (isNaN(weightNumber)) {
    res.status(400).send("Invalid weight");
    return;
  }
  if (weightNumber > 10) weightNumber = 10;
  const rates = await ratesModel.findOne({ weight: weightNumber });

  if (!rates) {
    res.status(403).send("No rates found");
    return;
  }

  if (!to) {
    res.status(200).send(filerRatesByType(rates, "National"));
    return;
  }

  if ((to as String).substring(0, 2) == "07") {
    res.status(200).send(filerRatesByType(rates, "Baleares"));
  } else if (
    (to as String).substring(0, 2) == "38" ||
    (to as String).substring(0, 2) == "35"
  ) {
    res.status(200).send(filerRatesByType(rates, "Canarias"));
  } else {
    res.status(200).send(filerRatesByType(rates, "National"));
  }
};

//Create a new rate
export const createCarrierRates: RequestHandler = async (req, res) => {
  const { weight } = req.body;
  if (!weight) {
    res.status(400).send("Missing weight or price");
    return;
  }
  const weightNumber = parseFloat(weight as string);
  if (isNaN(weightNumber)) {
    res.status(400).send("Invalid weight");
    return;
  }
  const newRate = new ratesModel(req.body);
  await newRate.save();
  res.status(201).json(newRate);
};

//Filter the rates given a type
export function filerRatesByType(rates: any, type: string) {
  let filterRates: { name: string; price: number; time: number }[] = [];
  rates.carriers.forEach((carrier: any) => {
    carrier.prices.forEach((price: any) => {
      if (price.type == type) {
        filterRates.push({
          name: carrier.name,
          price: price.price,
          time: price.time,
        });
      }
    });
  });
  return filterRates;
}
