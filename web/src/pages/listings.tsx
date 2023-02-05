import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Button from "../components/Inputs/Button";
import ListingCard from "../components/ListingCard";
import { GetListings } from "../request/fetch";
import { ListingInfo } from "../types/listings.types";

//This is a placeholder...
export default function Listings() {
  const { data, isLoading } = useQuery(["listings"], GetListings);
  const router = useRouter();

  return (
    <div className="relative">
      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <div className="flex">
          <ul>
            {data.map((listing: ListingInfo) => {
              return (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <Button
        onClick={() => void router.push("/createListing")}
        className="absolute top-2 m-10"
      >
        Create Listing
      </Button>
    </div>
  );
}
