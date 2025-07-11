import { GET_DB } from "~/config/database";
import { generateInsertQuery } from "~/utils/queyGenerate";

const create = async (data) => {
  console.log('🚀 ~ create ~ data:', data)
  try {
    const { query, values } = generateInsertQuery("conversation_members", data);
    const [result] = await GET_DB().query(query, values);
    return { id: result.insertId, ...data };
  } catch (error) {
    throw error;
  }
};


// const findOneById = async (id) => {
//   try {
//     const [rows] = await GET_DB().query(
//       `SELECT c.*, 
//               GROUP_CONCAT(cp.user_id) as participant_ids
//        FROM conversations c
//        LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
//        WHERE c.id = ?
//        GROUP BY c.id`,
//       [id]
//     );
//     if (rows[0]) {
//       rows[0].participants = rows[0].participant_ids 
//         ? rows[0].participant_ids.split(",").map(userId => ({ userId }))
//         : [];
//       delete rows[0].participant_ids;
//     }
//     return rows[0] || null;
//   } catch (error) {
//     throw error;
//   }
// };

const findAllByConversationId = async (conversationId, page = 1, limit = 10, isFull = false) => {
  try {
    const offset = (page - 1) * limit;
    const [[{ total }]] = await GET_DB().query(
      `SELECT COUNT(DISTINCT id) as total 
       FROM conversation_members 
       WHERE conversation_id = ?`,
      [conversationId]
    );

    let [rows] = await GET_DB().query(
      `SELECT cm.*, u.display_name, u.email, u.provider, u.avatar, u.bio,
       u.status, u.last_online_at, u.is_verified
        FROM conversation_members cm 
        JOIN users u ON u.id = cm.user_id
        WHERE cm.conversation_id = ?
        LIMIT ? OFFSET ?`,
      [conversationId, limit, offset]
    );
    if (isFull) {
      [rows] = await GET_DB().query(
        `SELECT cm.*, u.display_name, u.email, u.provider, u.avatar, u.bio,
         u.status, u.last_online_at, u.is_verified
          FROM conversation_members cm 
          JOIN users u ON u.id = cm.user_id
          WHERE cm.conversation_id = ?`,
        [conversationId]
      );
    }
    return {
      total_page: Math.ceil(total / limit) || 0,
      current_page: page || 0,
      total: total || 0,
      has_next_page: page * limit < total,
      conversation_members: rows || []
    }
  } catch (error) {
    throw error;
  }
};

// const findOneBetweenTwoUsers = async (userIds) => {
//   try {
//     const [rows] = await GET_DB().query(
//       `SELECT c.*, 
//               GROUP_CONCAT(cp.user_id) as participant_ids
//        FROM conversations c
//        JOIN conversation_participants cp ON c.id = cp.conversation_id
//        WHERE c.type = ?
//        GROUP BY c.id
//        HAVING SUM(CASE WHEN cp.user_id IN (?, ?) THEN 1 ELSE 0 END) = 2
//        AND COUNT(cp.user_id) = 2`,
//       [TYPE_CONVERSATION.PERSONAL, ...userIds]
//     );

//     if (rows[0]) {
//       rows[0].participants = rows[0].participant_ids 
//         ? rows[0].participant_ids.split(",").map(userId => ({ userId }))
//         : [];
//       delete rows[0].participant_ids;
//     }
//     return rows[0] || null;
//   } catch (error) {
//     throw error;
//   }
// };

// const update = async (id, updateData) => {
//   try {
//     const { participants, ...conversationData } = updateData;

//     if (Object.keys(conversationData).length > 0) {
//       const updateFields = Object.keys(conversationData).map(field => `${field} = ?`).join(", ");
//       const values = Object.values(conversationData);

//       const [result] = await GET_DB().query(
//         `UPDATE conversations SET ${updateFields} WHERE id = ?`,
//         [...values, id]
//       );
//       return result.affectedRows > 0;
//     }
//     return true;
//   } catch (error) {
//     throw error;
//   }
// };

const deleteMember = async (userId, conversationId) => {
  try {
    const [result] = await GET_DB().query(
      `DELETE FROM conversation_members 
       WHERE user_id = ? AND conversation_id = ?`,
      [userId, conversationId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}

const conversationMembers = {
  create,
  // findOneById,
  findAllByConversationId,
  // findOneBetweenTwoUsers,
  // update,
  deleteMember
};

export default conversationMembers;