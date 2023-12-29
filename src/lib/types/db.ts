export type createEventDto = {
  address: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  targetValue: number;
  currency: string;
  image: File | null;
};

export type allEventDto = {
  id: number;
  displayId: string;
  description: string;
  title: string;
  startDate: number;
  endDate: number;
  targetValue: number;
  currentValue: number;
  currency: string;
  imageSrc: string;
};

export type nft = {
  id: number;
  displayId: string;
  name: string;
  totalAmount: number;
  nowAmount: number;
  price: number;
  description: string;
  imageSrc: string;
};

export type eventDetailDto = {
  id: number;
  eventAddress: string;
  title: string;
  description: string;
  startDate: number; // or Date
  endDate: number; // or Date
  targetValue: number;
  currentValue: number;
  currency: string;
  imageSrc: string;
  nfts: nft[]; // replace 'any' with the correct type for NFTs
};

