/* eslint-disable @typescript-eslint/no-explicit-any */
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

// hooks/useCreateNewChat.ts
import { ensureStreamUsers } from "@/actions/ensureStreamUsers";
import streamClient from "@/lib/stream";

/**
 * createNewChat args:
 *  - members: array of user ids (must include creator)
 *  - created_by_id: creator user id
 *  - groupName?: optional for group channels
 */
export const useCreateNewChat = () => {
  const createNewChat = async ({
    members,
    created_by_id,
    groupName,
  }: {
    members: string[];
    created_by_id: string;
    groupName?: string;
  }) => {
    // Normalize members, ensure creator present
    const allMembers = Array.from(new Set([...(members || []), created_by_id]));
    await ensureStreamUsers(allMembers);

    const isGroupChat = allMembers.length > 2;

    // For DMs (1-on-1), try to find an existing channel
    if (!isGroupChat) {
      try {
        const channels = await streamClient.queryChannels(
          { type: "messaging", members: { $in: allMembers } },
          { created_at: -1 },
          { limit: 10 }
        );

        const found = channels.find((ch) => {
          const chMembers = Object.keys(ch.state.members || {});
          return (
            chMembers.length === 2 &&
            allMembers.every((id) => chMembers.includes(id))
          );
        });

        if (found) {
          // ensure we are watching it so presence & messages flow
          await found.watch({ presence: true, state: true, watch: true });
          return found;
        }
      } catch (err) {
        console.error("Error querying channels:", err);
        // fallthrough to create a new one
      }
    }

    // Create channel:
    // - For DMs: omit channel id so Stream creates a 'distinct' channel for same members.
    // - For group chats we can provide our own short id or let Stream create one.
    try {
      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",

        {
          members: allMembers,
          created_by_id,
          distinct: true,
          ...(isGroupChat && {
            name: groupName || `Group chat (${allMembers.length})`,
          }),
        } as Record<string, any>
      );
      await channel.create();

      // watch to enable presence + get current state
      await channel.watch({ presence: true, state: true, watch: true });

      // ensure members are added (watch + addMembers is safe)
      if (allMembers.length > 0) {
        await channel.addMembers(allMembers);
      }

      console.log(`${isGroupChat ? "Group" : "DM"} channel ready:`, channel.id);
      return channel;
    } catch (err) {
      console.error("Error creating channel:", err);
      throw err;
    }
  };

  return createNewChat;
};
