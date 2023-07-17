import { CampaignType } from "@/types/campaign";
import cities from "../data/cities.json";

export const INITIAL_ACCOUNT = 700;

export const INITIAL_CAMPAIGN: Omit<CampaignType, "id"> = {
  name: "",
  keywords: [],
  bidAmount: 0,
  campaignFund: 0,
  status: true,
  town: cities[0].name,
  radius: 0,
};

export const KEYWORDS = [
  "fashion",
  "automotive",
  "jewelry",
  "production",
  "translations",
  "tourism",
];
