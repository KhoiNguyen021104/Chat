import { GET_DB } from "~/config/database";
import { getFields, getValues } from "~/utils/algorithms";
import { generateInsertQuery } from "~/utils/queyGenerate";

const create = async (reqBody) => {
  try {
    const { query, values } = generateInsertQuery("message_reactions", reqBody)
    const [result] = await GET_DB().query(query, values)
    return result.insertId ? { id: result.insertId, ...reqBody } : null
  } catch (error) {
    throw error
  }
}

const update = async (id, updateData) => {
  try {
    const updateFields = getFields(updateData)
    const values = getValues(updateData)
    const [result] = await GET_DB().query(
      `UPDATE message_reactions SET ${updateFields} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0
  } catch (error) {
    throw error;
  }
};

const findOneById = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT * FROM message_reactions WHERE id = ?`,
      [id]
    );
    return rows[0] || null
  } catch (error) {
    throw error;
  }
}

const checkExist = async (messageId, userId) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT COUNT(*) as count FROM message_reactions WHERE message_id = ? AND user_id = ?`,
      [messageId, userId]
    );
    return rows[0].count > 0;
  } catch (error) {
    throw error;
  }
}

const deleteOne = async (id) => {
  try {
    const [result] = await GET_DB().query(
      `DELETE FROM message_reactions 
       WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}

// const findOneById = async (id) => {
//   try {
//     const [rows] = await GET_DB().query(
//       `SELECT 
//         m.*,
//         COALESCE((
//           SELECT CONCAT('[', GROUP_CONCAT(
//             JSON_OBJECT(
//               'file_url', mf.file_url,
//               'created_at', mf.created_at
//             )
//           ), ']')
//           FROM message_files mf
//           WHERE mf.message_id = m.id
//         ), '[]') AS files,
//         COALESCE((
//           SELECT CONCAT('[', GROUP_CONCAT(
//             JSON_OBJECT(
//               'user_id', mr.user_id,
//               'reaction', mr.reaction,
//               'created_at', mr.created_at
//             )
//           ), ']')
//           FROM message_reactions mr
//           WHERE mr.message_id = m.id
//         ), '[]') AS reactions,
//         COALESCE((
//           SELECT CONCAT('[', GROUP_CONCAT(
//             JSON_OBJECT(
//               'user_id', mrd.user_id,
//               'read_at', mrd.read_at
//             )
//           ), ']')
//           FROM message_readers mrd
//           WHERE mrd.message_id = m.id
//         ), '[]') AS readers
//       FROM messages m
//       WHERE m.id = ?`,
//       [id]
//     );
//     if (rows?.length > 0) {
//       rows[0].files = JSON.parse(rows[0].files)
//       rows[0].reactions = JSON.parse(rows[0].reactions)
//       rows[0].readers = JSON.parse(rows[0].readers)
//     }
//     return rows[0] || null;
//   } catch (error) {
//     throw error;
//   }
// };

// const checkExist = async (id) => {
//   try {
//     const [rows] = await GET_DB().query(
//       `SELECT COUNT(*) as count FROM messages WHERE id = ?`,
//       [id]
//     );
//     return rows[0].count > 0;
//   } catch (error) {
//     throw error;
//   }
// }

// const findAllByConversationId = async (conversationId, page = 1, limit = 15) => {
//   try {
//     page = parseInt(page, 10) || 1;
//     limit = parseInt(limit, 10) || 15;
//     const offset = (page - 1) * limit;

//     const [rows] = await GET_DB().query(
//       `SELECT m.*,
//         COALESCE((
//           SELECT CONCAT('[', GROUP_CONCAT(
//             JSON_OBJECT(
//               'file_url', mf.file_url,
//               'created_at', mf.created_at
//             )
//           ), ']')
//           FROM message_files mf
//           WHERE mf.message_id = m.id
//         ), '[]') AS files,
//         COALESCE((
//           SELECT CONCAT('[', GROUP_CONCAT(
//             JSON_OBJECT(
//               'user_id', mr.user_id,
//               'reaction', mr.reaction,
//               'created_at', mr.created_at
//             )
//           ), ']')
//           FROM message_reactions mr
//           WHERE mr.message_id = m.id
//         ), '[]') AS reactions,
//         COALESCE((
//           SELECT CONCAT('[', GROUP_CONCAT(
//             JSON_OBJECT(
//               'user_id', mrd.user_id,
//               'read_at', mrd.read_at
//             )
//           ), ']')
//           FROM message_readers mrd
//           WHERE mrd.message_id = m.id
//         ), '[]') AS readers
//       FROM messages m
//       WHERE m.conversation_id = ?
//       ORDER BY m.created_at DESC
//       LIMIT ? OFFSET ?`,
//       [conversationId, limit, offset]
//     );

//     const [[{ total }]] = await GET_DB().query(
//       `SELECT COUNT(*) AS total FROM messages WHERE conversation_id = ?`,
//       [conversationId]
//     );
//     if (rows?.length > 0) {
//       rows.forEach(row => {
//         row.files = JSON.parse(row.files)
//         row.reactions = JSON.parse(row.reactions)
//         row.readers = JSON.parse(row.readers)
//       })
//     }
//     return {
//       total_page: Math.ceil(total / limit) || 0,
//       current_page: page || 0,
//       total: total || 0,
//       has_next_page: page * limit < total,
//       messages: rows || []
//     };
//   } catch (error) {
//     throw error;
//   }
// };

// const update = async (id, updateData) => {
//   try {
//     const updateFields = getFields(updateData)
//     const values = getValues(updateData)
//     const [result] = await GET_DB().query(
//       `UPDATE messages SET ${updateFields} WHERE id = ?`,
//       [...values, id]
//     );
//     return result.affectedRows > 0
//   } catch (error) {
//     throw error;
//   }
// };

// const uploadFile = async (id, files) => {
//   try {
//     let uploadedFiles = await cloudinaryProvider.uploadMultipleFiles(files, FOLDER_MESSAGE_IMAGES);
//     uploadedFiles = uploadedFiles.map((f, index) => ({
//       url: f,
//       type: files[index].mimetype,
//       name: files[index].originalname,
//       size: files[index].size.toString()
//     }));

//     const fileQueries = uploadedFiles.map(file =>
//       GET_DB().query(
//         "INSERT INTO message_files (message_id, url, type, name, size) VALUES (?, ?, ?, ?, ?)",
//         [id, file.url, file.type, file.name, file.size]
//       )
//     );
//     await Promise.all(fileQueries);

//     return uploadedFiles;
//   } catch (error) {
//     throw error;
//   }
// };

// const updateDeletedByMessage = async (id, userId) => {
//   try {
//     const [result] = await GET_DB().query(
//       "INSERT INTO message_deleted (message_id, user_id) VALUES (?, ?)",
//       [id, userId]
//     );
//     return result.affectedRows > 0;
//   } catch (error) {
//     throw error;
//   }
// };

const messageReaction = {
  create,
  update,
  findOneById,
  checkExist,
  deleteOne
};

export default messageReaction;