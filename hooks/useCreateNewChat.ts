// import { ensureStreamUsers } from "@/actions/ensureStreamUsers";
// import stramClient from "@/lib/stream";

// /**
//  * Custom hook for creating new chat channels
//  * Handles both 1-on-1 chats and group chats with Stream Chat
//  * @returns Function to create a new chat channel
//  */
// export const useCreateNewChat = () => {
//   /**
//    * Creates a new chat channel or returns existing 1-on-1 chat
//    * @param members - Array of user IDs to include in the chat
//    * @param createdBy - ID of the user creating the chat
//    * @param groupName - Optional name for group chats
//    * @returns Promise that resolves to the created or existing channel
//    */
//   const createNewChat = async ({
//     members,
//     created_by_id,
//     groupName,
//   }: {
//     members: string[];
//     created_by_id: string;
//     groupName?: string;
//   }) => {
//     // Ensure all users exist in Stream before proceeding
//     await ensureStreamUsers(
//       Array.from(new Set([...(members || []), created_by_id]))
//     );
//     // Determine if this is a group chat (more than 2 members)
//     const isGroupChat = members.length > 2;

//     // For 1-on-1 chats, check if a channel already exists between these two users
//     if (!isGroupChat) {
//       // Query for existing messaging channels with exactly these members
//       const existingChannel = await stramClient.queryChannels(
//         {
//           type: "messaging", // 1-on-1 chats use "messaging" type
//           members: { $eq: members }, // Exact member match
//         },
//         { created_at: -1 }, // Sort by creation date (newest first)
//         { limit: 1 } // Only get the most recent match
//       );

//       // If an existing channel is found, verify it's a proper 1-on-1 match
//       if (existingChannel.length > 0) {
//         const channel = existingChannel[0];
//         const channelMembers = Object.keys(channel.state.members);

//         // Double-check that this is exactly a 2-person chat with the same members
//         if (
//           channelMembers.length === 2 &&
//           members.length === 2 &&
//           members.every((member) => channelMembers.includes(member))
//         ) {
//           console.log("Existing 1-1 chat found", channel.id);
//           return channel; // Return existing channel instead of creating new one
//         }
//       }
//     }

//     // Generate a unique channel ID using timestamp and random string
//     const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

//     try {
//       // Prepare channel data object
//       const channelData: {
//         members: string[];
//         created_by_id: string;
//         name?: string;
//       } = {
//         members,
//         created_by_id,
//       };

//       // For group chats, set the channel name
//       if (isGroupChat) {
//         channelData.name =
//           groupName || `Group chat (${members.length} members)`;
//       }

//       // Create the channel with appropriate type
//       const channel = stramClient.channel(
//         isGroupChat ? "team" : "messaging", // Group chats use "team", 1-on-1 use "messaging"
//         channelId,
//         channelData
//       );

//       // Watch the channel to establish connection and enable presence
//       await channel.watch({
//         presence: true, // Enable online/offline status tracking
//       });

//       return channel;
//     } catch (error) {
//       console.error("Error creating channel:", error);
//       throw error; // Re-throw error for caller to handle
//     }
//   };

//   return createNewChat;
// };

import { ensureStreamUsers } from "@/actions/ensureStreamUsers";
import streamClient from "@/lib/stream";

/**
 * Custom hook for creating new chat channels
 * Handles both 1-on-1 chats and group chats with Stream Chat
 * @returns Function to create a new chat channel
 */
export const useCreateNewChat = () => {
  /**
   * Creates a new chat channel or returns existing 1-on-1 chat
   * @param members - Array of user IDs to include in the chat
   * @param created_by_id - ID of the user creating the chat
   * @param groupName - Optional name for group chats
   * @returns Promise that resolves to the created or existing channel
   */
  const createNewChat = async ({
    members,
    created_by_id,
    groupName,
  }: {
    members: string[];
    created_by_id: string;
    groupName?: string;
  }) => {
    // Ensure all users exist in Stream before proceeding
    const allUsers = Array.from(new Set([...(members || []), created_by_id]));
    await ensureStreamUsers(allUsers);

    // Determine if this is a group chat (more than 2 total participants)
    const totalMembers = allUsers.length;
    const isGroupChat = totalMembers > 2;

    // For 1-on-1 chats, check if a channel already exists between these two users
    if (!isGroupChat) {
      try {
        // Query for existing messaging channels with exactly these members
        const existingChannels = await streamClient.queryChannels(
          {
            type: "messaging",
            members: { $eq: allUsers }, // Use allUsers instead of members
          },
          { created_at: -1 },
          { limit: 1 }
        );

        if (existingChannels.length > 0) {
          const channel = existingChannels[0];
          const channelMembers = Object.keys(channel.state.members);

          // Double-check that this is exactly a 2-person chat with the same members
          if (
            channelMembers.length === 2 &&
            allUsers.length === 2 &&
            allUsers.every((member) => channelMembers.includes(member))
          ) {
            console.log("Existing 1-1 chat found", channel.id);

            // Make sure to watch the channel with presence enabled
            await channel.watch({
              presence: true,
              state: true,
            });

            return channel;
          }
        }
      } catch (error) {
        console.error("Error querying existing channels:", error);
        // Continue to create new channel if query fails
      }
    }

    // Generate a unique channel ID using timestamp and random string
    const channelId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    try {
      // Prepare channel data object with all required fields
      const channelData: {
        members: string[];
        created_by_id: string;
        name?: string;
        created_by?: { id: string }; // Add created_by object for better tracking
      } = {
        members: allUsers, // Use allUsers to include creator
        created_by_id,
        created_by: { id: created_by_id }, // Stream expects this format
      };

      // For group chats, set the channel name
      if (isGroupChat) {
        channelData.name =
          groupName || `Group chat (${allUsers.length} members)`;
      }

      // Create the channel with appropriate type
      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",
        channelId,
        channelData
      );

      // Watch the channel to establish connection and enable presence
      // This is crucial for presence and message delivery
      await channel.watch({
        presence: true, // Enable online/offline status tracking
        state: true, // Get the current state of the channel
        watch: true, // Start watching for real-time updates
      });

      // Add members explicitly (this ensures proper member management)
      if (allUsers.length > 1) {
        await channel.addMembers(allUsers, {});
      }

      console.log(`${isGroupChat ? "Group" : "1-1"} chat created:`, channel.id);
      return channel;
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  };

  return createNewChat;
};
