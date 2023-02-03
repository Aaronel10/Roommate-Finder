import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AllListingsView from '../components/listings/all-listings';
import { env } from '../helper';
import BottomNavbar from '../components/listings/bottom-nav';
import FavoriteListings from '../components/listings/favorite-listings';
import CreateListing from '../components/listings/create-listing';
import { useLinkProps } from '@react-navigation/native';
import _Dropdown from '../components/control/dropdown';
import ListingView from '../components/listings/listing';

export enum Listings_Screen {
  all,
  favorites,
  create
}

const ListingsScreen = (props: any) => {
  const [isListing, setIsListing] = useState(false);
  const [listingID, setListingID] = useState('');
  const [distance, setDistance] = useState('');
  const [allListings, setAllListings] = useState([]);
  const [init, setInit] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentScreen, setCurrentScreen] = useState(Listings_Screen.all);
  const [searchPressed, setSearchPressed] = useState(false);
  const [isListingViewVisible, setIsListingViewVisible] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);

  useEffect(() => {
    if (!init) {
      getAllListings();
      setInit(true);
    }
  }, [currentScreen]);

  const getAllListings = async () => {
    try {
      await fetch(`${env.URL}/listings/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (ret) => {
          let res = JSON.parse(await ret.text());
          setAllListings(res);
        });
    } catch (e) {
      return;
    }
  };

  const handleNavigation = (screen: Listings_Screen) => {
    setCurrentScreen(screen);
    if (screen === Listings_Screen.all) {
      setSelectedFilter('all');
      setSearchPressed(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    content: {
      flex: 1,
    },
  });

  const getDistanceOptions = () => {
    return [
      { key: 1, value: 'Less than 1 mile' },
      { key: 2, value: 'Between 1 and 10 miles' },
      { key: 3, value: 'More than 10 miles' },
    ];
  };

  return (
    <View style={styles.container}>
      {!currentListing ?
      <View style={styles.content}>
        <_Dropdown
          isDarkMode={props.isDarkMode}
          options={getDistanceOptions()}
          placeholder="Select..."
          value={distance}
          setValue={setDistance}
        />
        {currentScreen === Listings_Screen.all ? (
          <AllListingsView
            isDarkMode={props.isDarkMode}
            setCurrentListing={setCurrentListing}
            allListings={allListings}
            setListingID={setListingID}
            setIsListing={setIsListing}
            selectedFilter={selectedFilter}
          />
        ) : (
          <View>
            {currentScreen === Listings_Screen.favorites ? (
              <FavoriteListings allListings={allListings} isDarkMode={props.isDarkMode} />
            ) : (
              <CreateListing isDarkMode={props.isDarkMode} />
            )}
          </View>
        )}
        <BottomNavbar
          isDarkMode={props.isDarkMode}
          setCurrentScreen={setCurrentScreen}
          handleNavigation={handleNavigation}
          disabled={currentScreen !== Listings_Screen.all || selectedFilter !== 'all'}
          setSearchPressed={setSearchPressed}
          currentScreen={currentScreen}
        />
      </View>
      : <ListingView
        isDarkMode={props.isDarkMode}
        setCurrentListing={setCurrentListing}
        currentListing={currentListing}
      >
        
      </ListingView>
    }
    </View>
  );
  };
  
  export default ListingsScreen;

