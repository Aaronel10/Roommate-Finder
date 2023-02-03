import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { Color } from '../../style';
import ListingCard from './listing-card';

const AllListingsView = (props: any) => {
  const [allListings, setAllListings] = useState<JSX.Element[]>([]);

  useEffect(() => {
    generateListings();
  }, [props.allListings, props.selectedFilter]);

  const generateListings = () => {
    const filteredListings = props.allListings
      ?.filter((item: any) => (props.selectedFilter === 'all' ? true : item.category === props.selectedFilter))
      .map((item: any, key: any) => (
        <ListingCard
          isDarkMode={props.isDarkMode}
          setCurrentListing={props.setCurrentListing}
          setListingID={props.setListingID}
          setIsListing={props.setIsListing}
          key={key}
          item={item}
        />
      ));

    setAllListings(filteredListings);
  };

  const styles = StyleSheet.create({
    container: {
      ...Platform.select({
        web:{
          paddingLeft: 3,
        }
      }),
      backgroundColor: Color(props.isDarkMode).contentBackgroundSecondary,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {allListings}
    </ScrollView>
  );
};

export default AllListingsView;
