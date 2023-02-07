import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import { navProp, NavTo } from '../../helper';
import { useNavigation } from '@react-navigation/native';


const ProfileCard = (props: any) => {
  /*
  Daniyal: A single card view of a profile will be on this component.
  Generate this component inside of the profiles component only.
  */
  const [profile, setProfile] = useState(props.profileInfo);
  const navigation = useNavigation<navProp>();

  useEffect(() => {
    setProfile({ ...profile, age: profile.birthday ? getAge(profile.birthday) : 0 });
  }, []);

  function getAge(dateString: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.column1}>
          <Text style={styles.name}>{profile.first_name + " " + profile.last_name}</Text>
          <Text style={styles.regText}>Age: {profile.age}</Text>
          <Text style={styles.regText}>From: {profile.city + ", " + profile.state}</Text>
          <Text style={styles.regText}>Bio: {profile.bio}</Text>
        </View>
        <View style={styles.column2}>
          <Image style={styles.profileImg} source={profile.image} />
        </View>
      </View>
      <View style={{...styles.row, ...styles.row2}}>
        <View style={styles.column1}>
          <TouchableOpacity onPress={() => { navigation.navigate(NavTo.Profile, { profile: profile } as never) }}>
            <Text style={styles.viewProfileButton}>View Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column2}>
          <Text style={styles.match}>Match: {profile.matchPercentage}%</Text>
        </View>
      </View>
    </View>
  );

}

export default ProfileCard;


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#dcdcdc',
    width: '93%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    marginBottom: 13,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    // backgroundColor: 'lightgreen',
  },
  row2: {
    paddingTop: 10
  },
  column1: {
    flex: 2,
    // backgroundColor: 'lightblue',
  },
  column2: {
    flex: 1,
    // backgroundColor: 'lightpink',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  regText: {
    paddingBottom: 2,
    textAlign: 'justify',
    paddingRight: 17
  },
  viewProfileButton: {
    color: 'black',
    backgroundColor: 'yellow',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 7,
    width: '60%',
    padding: 10,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: Radius.round,
  },
  match: {
    textAlign: 'right',
    fontStyle: 'italic',
    paddingTop: '8%',
    paddingRight: 5,
    fontWeight: '500'
  }
});