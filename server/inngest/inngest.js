import { Inngest } from "inngest";
import User from "../models/user.models.js";

export const inngest = new Inngest({
  id: "social_media"
});

// inngest function to save user to db
const syncUserCreation = inngest.createFunction(
  { 
    id: 'sync-user-from-clerk' 
  },
  {
    event: 'clerk/user.created'
  },
  async({event}) => {
    // Handle the event here
    const {id, first_name, last_name, email_addresses, image_url} = event.data;
    let username = email_addresses[0].email_address.split('@')[0];

    // check availability of username
    const user = await User.findOne({username});

    if(user){
        username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
        _id: id,
        full_name: first_name + " " + last_name,
        email: email_addresses[0].email_address,
        profile_picture: image_url,
        username
    }
    await User.create(userData);
  }
);

// inngest function to update user
const syncUserUpdation = inngest.createFunction(
  { 
    id: 'updated-user-from-clerk' 
  },
  {
    event: 'clerk/user.updated'
  },
  async({event}) => {
    // Handle the event here
    const {id, first_name, last_name, email_addresses, image_url} = event.data;

    const updatedUserData = {
        email: email_addresses[0].email_address,
        full_name: first_name + " " + last_name,
        profile_picture: image_url
    }

    await User.findByIdAndUpdate(id, updatedUserData);
  }
);

// inngest function to delete user
const syncUserDeletion = inngest.createFunction(
  { 
    id: 'deleted-user-from-clerk' 
  },
  {
    event: 'clerk/user.deleted'
  },
  async({event}) => {
    // Handle the event here
    const {id} = event.data;

    await User.findByIdAndDelete(id);
  }
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
