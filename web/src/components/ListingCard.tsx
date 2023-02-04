import Image from "next/image";
import Link from "next/link";
import React from "react";

import { ListingInfo } from "../types/listings.types";

interface Props {
  listing: ListingInfo;
}

const ListingCard = ({ listing }: Props) => {
  return (
    <div className="m-10 max-w-sm overflow-hidden rounded shadow-lg">
      <Link href="">
        <img
          className="w-full"
          src={listing.images[0]}
          width="120"
          height="120"
          alt="listing image"
        />
        <div className="px-6 py-4">
          <div className="mb-2 text-xl font-bold">{listing.name}</div>
          <p className="text-base text-gray-700">
            {listing.description.substring(0, 100)}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
            ${listing.price}
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
            {listing.city}
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
            {listing.housing_type}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
