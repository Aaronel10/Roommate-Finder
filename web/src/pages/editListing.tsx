import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

import Button from "../components/Inputs/Button";
import { GetListing } from "../request/fetch";
import { UpdateListing } from "../request/mutate";

export default function EditListing() {
  const router = useRouter();
  const { listingId } = router.query;
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [housing_type, setHousingType] = useState<string>("Apartment");
  const [rooms, setRooms] = useState<number>(1);
  const [size, setSize] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [street, setStreet] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [petsAllowed, setPetsAllowed] = useState<boolean>(true);
  const [files, setFiles] = useState<string[] | undefined>([]);

  const { data, isLoading } = useQuery(["ListingToEdit", listingId], {
    queryFn: () => GetListing(listingId as string),
    onSuccess: (data) => {
      console.log(data, "hit listing correctly");
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: (data) => {
      setFiles(data?.images);
    },
  });

  const { mutate: updateListing, isLoading: updatingData } = useMutation({
    mutationFn: (fullAddress: string) =>
      UpdateListing(
        name,
        description,
        images,
        price,
        city,
        housing_type,
        rooms,
        bathrooms,
        size,
        fullAddress,
        petsAllowed,
        listingId as string
      ),
    onSuccess: () => {
      void router.push("/listings");
    },
    onError: (err: Error) => {
      toast.error(err.message);
      console.log(err);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!images) {
      setImages(files as string[]);
    }
    const streetAddress = document.getElementById(
      "street-address"
    ) as HTMLInputElement;
    const city = document.getElementById("city") as HTMLInputElement;
    const state = document.getElementById("state") as HTMLInputElement;
    const zip = document.getElementById("zip") as HTMLInputElement;
    setZipcode(zip.value);
    const fullAddress = `${streetAddress.value}, ${city.value}, ${state.value} ${zip.value}`;
    updateListing(fullAddress);
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (!files) {
      return;
    }
    const res = await fileListToBase64(files);
    setImages(res);
    console.log(images);
  };

  const fileListToBase64 = (fileList: FileList): Promise<string[]> => {
    const files = Array.from(fileList);
    const promises = files.map((file) => {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return toast.error("Invalid image type. Only jpg and png are allowed.");
      }
      if (file.size > 8 * 1024 * 1024) {
        return toast.error("Image size is too large. Max size is 8MB.");
      }
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });
    return Promise.all<string>(promises);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col bg-white md:px-8 xl:px-0">
        <form
          className="space-y-8 divide-y divide-gray-200 p-10"
          onSubmit={handleSubmit}
        >
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Edit Listing
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="Title your listing"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title your listing
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      id="listing-title"
                      defaultValue={data?.name}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      value={data?.description}
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Listing photos
                  </label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onChange={handleFiles}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, up to 8MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  General Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You must either own this property or have explicit permission
                  to sublease
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="square-feet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total square feet
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="square-feet"
                      id="square-feet"
                      defaultValue={data?.size}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setSize(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="housing_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type of housing
                  </label>
                  <div className="mt-1">
                    <select
                      id="housing_type"
                      name="housing_type"
                      autoComplete="housing_type"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={data?.housing_type}
                      onChange={(e) => setHousingType(e.target.value)}
                    >
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Condo</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="number-of-rooms"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of rooms available
                  </label>
                  <div className="mt-1">
                    <select
                      id="number-of-rooms"
                      name="number-of-rooms"
                      autoComplete="number-of-rooms"
                      value={data?.rooms ? data?.rooms : 1}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setRooms(Number(e.target.value))}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="num-bathrooms"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of bathrooms
                  </label>
                  <div className="mt-1">
                    <select
                      id="num-bathrooms"
                      name="num-bathrooms"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={data?.bathrooms ? data?.bathrooms : 1}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="street-address"
                      id="street-address"
                      autoComplete="street-address"
                      defaultValue={data?.address}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      defaultValue={data?.city}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="region"
                      id="state"
                      defaultValue="FL"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="postal-code"
                      id="zip"
                      autoComplete="postal-code"
                      defaultValue={data?.zipcode}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="pets-allowed"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pets allowed?
                  </label>
                  <div className="mt-1">
                    <select
                      id="pets-allowed"
                      name="pets-allowed"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={data?.petsAllowed ? "Yes" : "No"}
                      onChange={(e) => {
                        setPetsAllowed(e.target.value === "Yes" ? true : false);
                      }}
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="price"
                      id="price"
                      defaultValue={data?.price}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  How would you like to get notified about new messages for this
                  listing?
                </p>
              </div>
              <div className="mt-0">
                <fieldset>
                  <div className="mt-4 space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="notified_by_email"
                          name="notified_by_email"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="notified_by_email"
                          className="font-medium text-gray-700"
                        >
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="notified_by_sms"
                          name="notified_by_sms"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="notified_by_sms"
                          className="font-medium text-gray-700"
                        >
                          SMS
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => void router.push("/listings")}
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2"
                loading={updatingData}
                disabled={updatingData}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
