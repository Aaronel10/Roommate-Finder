import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { navProp, NavTo } from '../helper';
import Profile from '../components/search/profiles';

const SearchScreen = (props: any) => {
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
    useEffect(() => {
       
    }, []);

        return (
          <ScrollView style={styles.exploreContainer}>
            <Text style={styles.heading}>You are viewing{'\n'}everyone here!</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Filters') }}>
                <Text style={styles.buttonText}>Filter Results</Text>
              </TouchableOpacity>
            </View>
            <Profile navigation={navigation} />
            //list of profile caRDS
          </ScrollView>
        );
      };
    
    export default SearchScreen;

    
    
    
    const styles = StyleSheet.create({
      exploreContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: '10%',
        // height: '100%',
        // paddingBottom: '29%',
        // borderWidth: 3,
      },
      heading: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        // elevation: 4,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
      },
      buttonsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 30,
      },
      button: {
        // marginTop: 25,
        // marginBottom: 25,
        marginLeft: 7,
        marginRight: 7,
        padding: 10,
        borderRadius: 7,
        backgroundColor: 'grey',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      seeMore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'right',
        textDecorationLine: 'underline',
        paddingRight: 15,
        marginBottom: 120
      }
    });