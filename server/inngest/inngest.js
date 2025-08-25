import { Inngest } from "inngest";
import User from "../models/user.models.js";
import Connection from "../models/connection.models.js";
import Story from "../models/story.models.js";
import sendEmail from "../config/nodeMailer.js";
import Message from "../models/messages.model.js";

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

// inngest function to send reminder when a new connection request is added
const sendConnectionRequestReminder = inngest.createFunction(
  { 
    id: 'send-connection-request-reminder' 
  },
  {
    event: 'app/connection-request'
  },
  async({event, step}) => {
    // Handle the event here
    const {connectionId} = event.data;

    await step.run('send-connection-request-mail', async() => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      const subject = `New connection Request`;
      const body = `
        <div style = "font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
          <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}.</p>
          <p>Click <a href="${process.env.FRONTEND_URL}/connections/${connectionId}" style = "color: #10b981">here</a> to view the request.</p>
        </div>
      `

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        html: body
      });
    })

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil('wait-for-24-hours', in24Hours);

    await step.run('send-connection-request-reminder', async() => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      
      // CHECK: Has the status changed from 'pending' to 'accepted'?
      if(connection.status === 'accepted'){
        return {message: 'accepted'};
      }
      const subject = `New connection Request`;
      const body = `
        <div style = "font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
          <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}.</p>
          <p>Click <a href="${process.env.FRONTEND_URL}/connections/${connectionId}" style = "color: #10b981">here</a> to view the request.</p>
        </div>
      `

      // If we reach here, status is still 'pending'
      // Send reminder email...
      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        html: body
      });

      return {message: 'reminder sent'}
    })
  }
);

// inngest function to delete after 24hrs
const deleteStoryAfter24hrs = inngest.createFunction(
  {
    id: 'story-delete'
  },
  {
    event: 'app/story.delete'
  },
  async({event, step}) => {
    const {id} = event.data;

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil('wait-for-24-hours', in24Hours);

    // delete story
    await step.run('delete-story', async() => {
      await Story.findByIdAndDelete(id);
      return {message: 'story deleted'};
    });
  }
);

// inngest function to send notification of unseen messages
const sendNotificationOfUnseenMessages = inngest.createFunction(
  {
    id: 'send-unseen-messages-notification'
  },
  {
    cron: "TZ=America/New_York 0 9 * * *", // every day at 9AM
  },
  async({step}) => {
    const message = await Message.find({seen: false}).populate('to_user_id');
    const unSeenCount = {};

    message.map(message => {
      unSeenCount[message.to_user_id._id] = (unSeenCount[message.to_user_id._id] || 0) + 1;
    })

    for(const userId in unSeenCount){
      const user = await User.findById(userId);
      const subject = `You have ${unSeenCount[userId]} new messages`;
      const body = `
        <div style = "font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.full_name},</h2>
          <p>You have ${unSeenCount[userId]} new messages that you haven't seen yet.</p>
          <p>Click <a href="${process.env.FRONTEND_URL}/messages" style = "color: #10b981">here</a> to view your messages.</p>
        </div>
      `

      await sendEmail({
        to: user.email,
        subject,
        html: body
      });
    }

    return {message: 'notifications sent'};
  }
);

export const functions = [
  syncUserCreation, 
  syncUserUpdation, 
  syncUserDeletion, 
  sendConnectionRequestReminder, 
  deleteStoryAfter24hrs,
  sendNotificationOfUnseenMessages
];
