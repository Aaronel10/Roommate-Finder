import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { navProp, NavTo } from '../helper';
import Profile from '../components/search/profiles';
import { Color, FontSize, Radius } from '../style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


interface SearchScreenProps {
  route: RouteProp<Record<string, any>, 'Search'>;
  isDarkMode: boolean;
  mobile: boolean;
  isMatches: boolean;
  setIsMatches: any;
  setNavSelector: any;
}

const SearchScreen = ({ route, isDarkMode, mobile, isMatches, setIsMatches, setNavSelector }: SearchScreenProps) => {
  /*
  Daniyal: This screen should be used to add all the components
  that you will need to it for search. I have created a components
  folder named "search" where you can create the filter component (filter.tsx)
  and profile cards (profile-card.tsx) that you will need to generate within
  profiles (profiles.tsx) component. So, this page will really just have
  profiles.tsx and filter.tsx on it and whatever else you need to add here.
  If you need to create other components please add them to the search folder
  that I already generated for you.
  */

  const navigation = useNavigation<navProp>();
  const [noResults, setNoResults] = useState(false);
  const [filtersFetched, setFiltersFetched] = useState(false);
  const [filters, setFilters] = useState<any[]>(route.params?.filters || []);
  const [genderFilter, setGenderFilter] = useState<string>(route.params?.genderFilter || "");
  const [locationFilter, setLocationFilter] = useState<string>(route.params?.locationFilter || "");
  const [sharingPrefFilter, setSharingPrefFilter] = useState<string>(route.params?.sharingPrefFilter || "");
  const [sorting, setSorting] = useState(false);
  const [forceGetProfiles, setForceGetProfiles] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', backPress);
    return () => {
      back.remove();
    }
  });

  const backPress = () => {
    let routes = navigation.getState()?.routes;
    if (routes && routes[routes.length - 2]?.name && navigation.canGoBack()) {
      setNavSelector(routes[routes.length - 2]?.name);
      navigation.goBack();
      return true;
    }
    else {
      return false;
    }
  }

  useEffect(() => {
    if (!hasFilters() && noResults) {
      setFilters([]);
      setGenderFilter("");
      setLocationFilter("");
      setSharingPrefFilter("");
      setNoResults(false);
    }
  }, [noResults]);

  useEffect(() => {
    let params = route.params;
    if (params) {
      setFilters(params.filters || []);
      setGenderFilter(params.genderFilter || "");
      setLocationFilter(params.locationFilter || "");
      setSharingPrefFilter(params.sharingPrefFilter || "");

      if (params.filters?.length ||
        params.genderFilter?.length ||
        params.locationFilter?.length ||
        params.sharingPrefFilter?.length) {
        setFiltersFetched(true);
      }
      else {
        setFiltersFetched(false);
      }

      if (params.view && params.view === "matches") {
        setForceGetProfiles(true);
      }
    }
  }, [route.params]);

  const styles = StyleSheet.create({
    exploreContainer: {
      flex: 1,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: FontSize.large,
      color: Color(isDarkMode).text
    },
    buttonsRow: {

    },
    button: {
      padding: 10,
      borderRadius: Radius.round,
      margin: -5
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    filterBox: {
      backgroundColor: Color(isDarkMode).contentHolder,
      borderRadius: Radius.round,
      paddingVertical: 5,
      paddingHorizontal: 15,
      marginRight: 2,
      borderColor: Color(isDarkMode).separator
    },
    filterText: {
      margin: 'auto',
      fontSize: FontSize.default,
      color: Color(isDarkMode).text
    },
    seeMore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'grey',
      textAlign: 'right',
      textDecorationLine: 'underline',
      paddingRight: 15,
      marginBottom: 120
    },
    filterIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: mobile ? 10 : 0
    },
    container: {
      height: '100%',
      justifyContent: 'flex-start',
    },
    filterContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8,
      marginHorizontal: 10,
      paddingBottom: 10,
      minHeight: 45
    },
    filterContent: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    match: {
      marginRight: 5
    },
    options: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: -5
    },
    matchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      justifyContent: 'flex-end',
      marginRight: 5
    },
    matchContent: {
      borderRadius: Radius.round,
      padding: 5
    },
    searchContainer: {
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 10,
    }
  });

  const hasFilters = () => {
      if ((filters && filters.length > 0) ||
      genderFilter ||
      locationFilter ||
      sharingPrefFilter) {
        return true;
    }
    else {
      return false;
    }
  }

  const clearFilters = () => {
    setFilters([]);
    setGenderFilter("");
    setLocationFilter("");
    setSharingPrefFilter("");
    setNoResults(false);
  }

  const handleToggleButtonPress = () => {
    setSorting(!sorting);
  };

  const containerStyle = () => {
    var container = Color(isDarkMode).contentBackground;
    var padding = 10;
    var paddingVertical = 20
    var borderRadius = Radius.large;
    var borderColor = Color(isDarkMode).border;
    var borderWidth = 1;
    var marginTop = 10;
    var marginBottom = 0;
    var flex = 1;
    if (mobile) {
        padding = 0;
        borderRadius = 0;
        borderWidth = 0;
        marginTop = 0
        paddingVertical = 0;
        container = Color(isDarkMode).contentBackgroundSecondary;
    }
    else {
      marginBottom = 20
    }

    return {
        padding: padding,
        borderRadius: borderRadius,
        borderColor: borderColor,
        borderWidth: borderWidth,
        marginTop: marginTop,
        backgroundColor: container,
        flex: flex,
        marginBottom: marginBottom,
        paddingVertical: paddingVertical
    }
  }

  return (
    <View
    style={styles.exploreContainer}
    >
        <View
        style={styles.container}
        >
          <View
          style={styles.header}
          >
            <_Text
            style={styles.heading}
            isDarkMode={isDarkMode}
            >
              Explore
            </_Text>
            <View
              style={styles.options}
            >
              <TouchableHighlight
                underlayColor={Color(isDarkMode).underlayMask}
                onPress={handleToggleButtonPress}
                style={styles.matchContent}
                >
                <View
                style={styles.matchBtn}
                >
                  <_Text
                    style={styles.match}
                    isDarkMode={isDarkMode}
                  >
                    Sort by matches
                  </_Text>
                    <FontAwesomeIcon
                    icon={sorting ? 'toggle-on' : 'toggle-off'}
                    size={25}
                    color={sorting ? Color(isDarkMode).gold : Color(isDarkMode).text}
                    style={styles.filterIcon}
                  />
                </View>
              </TouchableHighlight>
              <View
              style={styles.buttonsRow}
              >
                <TouchableHighlight
                underlayColor={Color(isDarkMode).underlayMask}
                style={styles.button}
                onPress={() => { navigation.navigate(NavTo.Filters,
                  {
                    params: filters.toString(),
                    genderFilter: genderFilter,
                    locationFilter: locationFilter,
                    sharingPrefFilter: sharingPrefFilter
                  } as never); }}
                >
                  <FontAwesomeIcon 
                  size={20} 
                  color={hasFilters() ? Color(isDarkMode).gold : Color(isDarkMode).text} 
                  style={styles.filterIcon} 
                  icon="filter"
                  >
                  </FontAwesomeIcon>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View
          style={containerStyle()}
          >
          <_TextInput
            containerStyle={styles.searchContainer}
            placeholder="Search..."
            value={search}
            setValue={setSearch}
            isDarkMode={isDarkMode}
          ></_TextInput>
        <Profile
        mobile={mobile}
        filters={filters}
        filtersFetched={filtersFetched}
        genderFilter={genderFilter}
        locationFilter={locationFilter}
        sharingPrefFilter={sharingPrefFilter}
        sorting={sorting}
        isDarkMode={isDarkMode}
        setNoResults={setNoResults}
        noResults={noResults}
        setForceGetProfiles={setForceGetProfiles}
        forceGetProfiles={forceGetProfiles}
        setSorting={setSorting}
        search={search}
        setSearch={setSearch}
        clearFilters={clearFilters}
        />
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
