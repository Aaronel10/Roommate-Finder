import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import ProfileCard from './profile-card';
import { env, authTokenHeader } from '../../helper';

const Profile = (props: any, {navigation}:any) => {
    /*
    Daniyal: This component will contain all of the profile card components
    and anything else that is needed for the overall profile view.
    Add this component to the search screen.
    */
    const [allProfiles, setAllProfiles] = useState([]);
    const [isFetchedProfiles, setFetchedProfiles] = useState(false);
  
    /* For Testing Only */
  // const [profiles, setProfiles] = useState([
  //   { first_name: 'Kakashi', last_name: 'Hatake', birthday: '2007-11-21', major: 'Computer Science', city: 'Chicago', state: "Illinois", image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  //   { first_name: 'Sakura', last_name: 'Haruno', birthday: '2008-06-15', major: 'MBA', city: 'San Francisco', state: "California", image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  //   { first_name: 'Rock', last_name: 'Lee', birthday: '2004-07-26', major: 'Martial Arts', city: 'San Diego', state: "California", image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  //   { first_name: 'Tsunade', last_name: 'Senju', birthday: '2013-04-27', major: 'Architecture', city: 'St. Louis', state: "Missouri", image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  // ]);

  useEffect(() => {
    getAllProfiles();
  }, []);

  const getAllProfiles = async () => {
    //const env = { URL: "http://localhost:8080" }; // to be removed
    try {
      console.log("Inside getAllProfiles");
      await fetch(`${env.URL}/users/Allprofiles`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization' : await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          console.log(res);
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            setAllProfiles(res);
            setFetchedProfiles(true);
          }
        });
    }
    catch (e) {
      console.log(e);
      return;
    }
  };

  return (
    <View>
      {/* For Testing Only */}
      {/* {profiles.map((profile, index) => <ProfileCard navigation={navigation} key={index} profile={profile} />)} */}

      {isFetchedProfiles && allProfiles.map((profile : any, index) => profile.birthday && <ProfileCard navigation={navigation} key={index} profileInfo={profile} />)}
    </View>
  );
}

export default Profile;