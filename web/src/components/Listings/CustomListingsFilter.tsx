import { FunnelIcon } from "@heroicons/react/24/outline";
import { QueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import React, { ChangeEvent } from "react";

import { Filters } from "../../pages/listings";
import Button from "../Inputs/Button";
import CustomPopover from "../Inputs/CustomPopover";
interface props {
  price: number;
  setPrice: (value: number) => void;
  numberRooms: string;
  setNumberRooms: (value: string) => void;
  numberBathrooms: string;
  setNumberBathrooms: (value: string) => void;
  petsAllowed: string;
  setPetsAllowed: (value: string) => void;
  housingType: string;
  setHousingType: (value: string) => void;
  distanceToUcf: number;
  setDistanceToUcf: (value: number) => void;
  isFavorited: boolean;
  setIsFavorited: (value: boolean) => void;
  savedFilters: Filters;
  queryClient: QueryClient;
}

export default function CustomListingFilterPopover({
  price,
  setPrice,
  numberRooms,
  setNumberRooms,
  numberBathrooms,
  setNumberBathrooms,
  petsAllowed,
  setPetsAllowed,
  housingType,
  setHousingType,
  distanceToUcf,
  setDistanceToUcf,
  isFavorited,
  setIsFavorited,
  savedFilters,
  queryClient,
}: props) {
  const clearFilters = () => {
    setPrice(100000);
    setHousingType("all");
    setNumberRooms("all");
    setNumberBathrooms("all");
    setPetsAllowed("all");
    setDistanceToUcf(100000);
    setIsFavorited(false);
    queryClient.clear();
  };

  const debouncedPrice = React.useRef(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setPrice(Number(e.target.value));
      queryClient.setQueryData<Filters>(["filters"], {
        ...savedFilters,
        price: Number(e.target.value),
      });
    }, 600)
  ).current;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedPrice(e);
  };
  const handleHousingTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setHousingType(event.target.value);
    queryClient.setQueryData<Filters>(["filters"], {
      ...savedFilters,
      housingType: event.target.value,
    });
  };

  const handleDistanceToCampusChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setDistanceToUcf(Number(event.target.value));
    queryClient.setQueryData<Filters>(["filters"], {
      ...savedFilters,
      distanceToUCF: Number(event.target.value),
    });
  };

  const handleRoomsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setNumberRooms(event.target.value);
    queryClient.setQueryData<Filters>(["filters"], {
      ...savedFilters,
      bedrooms: event.target.value,
    });
  };

  const handleBathroomsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setNumberBathrooms(event.target.value);
    queryClient.setQueryData<Filters>(["filters"], {
      ...savedFilters,
      bathrooms: event.target.value,
    });
  };

  const handlePetPreferenceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPetsAllowed(event.target.value);
    queryClient.setQueryData<Filters>(["filters"], {
      ...savedFilters,
      petsAllowed: event.target.value,
    });
  };

  const handleIsFavoritedChange = (event: ChangeEvent<HTMLInputElement>) => {
    queryClient.setQueryData<Filters>(["filters"], {
      ...savedFilters,
      isFavorited: !isFavorited,
    });
    setIsFavorited(!isFavorited);
  };

  return (
    <div>
      <CustomPopover
        popoverPlacement={"bottom-end"}
        button={
          <Button>
            Filters
            <FunnelIcon className={"ml-2 h-6 w-6"} />
          </Button>
        }
      >
        {(open) => (
          <div className="space-y-4 rounded p-4">
            <div className="flex items-center">
              <label htmlFor="price" className="block">
                Under $:
              </label>
              <input
                id="price"
                type="number"
                className="text-primary focus:ring-primary rounded"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onChange={handlePriceChange}
              />
            </div>
            <div className="flex items-center">
              <input
                id="price"
                type="checkbox"
                className="text-primary focus:ring-primary rounded"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onChange={handleIsFavoritedChange}
                checked={isFavorited}
              />
              <label htmlFor="favorited" className="ml-4 block">
                Favorited Only
              </label>
            </div>
            <div>
              <label htmlFor="housing_type" className="block">
                Type of home:
              </label>
              <select
                id="htype"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={housingType}
                onChange={handleHousingTypeChange}
              >
                <option value="all">All</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <div>
              <label htmlFor="rooms" className="block">
                Number of rooms:
              </label>
              <select
                id="rooms"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={numberRooms}
                onChange={handleRoomsChange}
              >
                <option value="all">All</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={10}>4+</option>
              </select>
            </div>
            <div>
              <label htmlFor="bathroomsPref" className="block">
                Number of bathrooms:
              </label>
              <select
                id="bathrooms"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={numberBathrooms}
                onChange={handleBathroomsChange}
              >
                <option value="all">All</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={10}>4+</option>
              </select>
            </div>
            <div>
              <label htmlFor="distanceFromCampus" className="block">
                Max distance to campus:
              </label>
              <select
                id="distanceFromCampus"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={distanceToUcf}
                onChange={handleDistanceToCampusChange}
              >
                <option value="">All</option>
                <option value={5}>5 miles</option>
                <option value={8}>8 miles</option>
                <option value={10}>10 miles</option>
                <option value={15}>15 miles</option>
              </select>
            </div>
            <div>
              <label htmlFor="smokePreference" className="block">
                Pet preference:
              </label>
              <select
                id="petPreference"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={petsAllowed}
                onChange={handlePetPreferenceChange}
              >
                <option value="all">All</option>
                <option value="yes">Allowed</option>
                <option value="no">Not Allowed</option>
              </select>
            </div>
            <Button onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        )}
      </CustomPopover>
    </div>
  );
}
