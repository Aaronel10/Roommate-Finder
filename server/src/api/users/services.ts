import bcrypt from "bcrypt";
import { tagsStyles } from "utils/tags";
import { uuid } from "uuidv4";

import db from '../../utils/db';

export function findUserByEmail(email: any) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUserByEmailAndPassword(email:string, password:string, first_name: string, last_name: string) {
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.create({
    data: {
      email: email,
      password: hashed,
      first_name,
      last_name,
    },
  });
}

export function createUserByEmail(email:string) {
  // Generate some random password for now, they will change it later when they activate their account.
  var password = new Date().getTime() + uuid();
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.create({
    data: {
      email: email,
      password: hashed,
    },
  });
}

export function UpdatePassword(password:string, id:string) {
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.update({
    where: {
      id,
    },
    data: {
      password: hashed
    },
  });
}

export function findUserById(id: any) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}

export function updateFirstName(id:string, first_name: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      first_name,
    },
  });
}

export function updateLastName(id:string, last_name: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      last_name,
    },
  });
}

//update phone number

export function updatePhoneNumber(id:string, phone_number: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      phone_number,
    },
  });
}

//update gender

export function updateGender(id:string, gender:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      gender,
    },
  });
}

export function updateZip(id:string, zip_code:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      zip_code,
    },
  });
}

export function updateCity(id:string, city:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      city,
    },
  });
}

export function updateImage(id:string, image:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      image,
    },
  });
}

export function updateState(id:string, state:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      state,
    },
  });
}

export function updateProfilePicture(id:string, image:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      image,
    },
  });
}

//tags

//add tags to tags table 
// @@param {string[]} tags - array of tags to add
// @@param {string} userId - id of user to add tags to

// check if tag exists in tags table
// if it does, add tag then skip
// if it doesn't, add tag to tags table 
// get all tags from tags table
// delete missing tags from tags table

//actually easier way just delete all tags 
// and add new tags... 
export async function UpdateTagsandBio(tags:string[], user_id:string, bio:string){
  // delete all tags of user 
  try {
    tags = tags.filter(tag => tagsStyles.includes(tag));
    //update bio
    await db.user.update({
      where: {
        id: user_id,
      },
      data: {
        bio,
      },
    });

    await db.tags.deleteMany({
      where: {
        user_id,
      }
    });
    // add new tags
    for (let i = 0; i < tags.length; i++) {
      await db.tags.create({
        data: {
          tag: tags[i],
          user_id,
        }
      });
    }
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

//get tags and bio of user!! 

export function GetTagsandBio(id:string){
  return db.user.findMany({
    where: {
      id,
    },
    select: {
      bio: true,
      tags: {
        select: {
          tag: true,
        }
      },
    }
  });
}

// Get users filtered by tags 
export async function GetUsersByTags(filters: string[]) {
  // Fetch userIds corresponding to tags in request
  const userIdObj = await db.tags.findMany({
    where: {
      tag: {
        in: filters,
      },
    },
    select: {
      user_id: true,
    }
  });
  // Get users that match the fetched userIds
  const userIds = userIdObj.map(x => x.user_id);
  return db.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });
}

// Get match percentages for logged in user with all other users 
export async function GetMatches(mainUserId: string, userIds: string[]) {
  return db.matches.findMany({
    where: {
      userOneId: mainUserId,
      userTwoId: {
        in: userIds,
      },
    },
  });
}

export function updateBday(id:string, birthday:string){
    return db.user.update({
      where: {
        id,
      },
      data: {
        birthday,
      },
    });
}

export function updateSetupStep(id:string, setup_step:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      setup_step,
    },
  });
}

export function completeSetupAndSetStep(id:string, setup_step:string){
  return db.user.update({
    where: {
      id,
    },
    data: {
      is_setup: true,
      setup_step
    },
  });
}