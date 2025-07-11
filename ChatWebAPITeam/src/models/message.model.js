import { GET_DB } from "~/config/database";
import { cloudinaryProvider } from "~/providers/cloudinary";
import { getFields, getValues } from "~/utils/algorithms";
import { FOLDER_MESSAGE_IMAGES, TYPE_MESSAGE } from "~/utils/constants";
import { generateInsertQuery } from "~/utils/queyGenerate";

const create = async (data) => {
  try {
    const { query, values } = generateInsertQuery("messages", data)
    const [result] = await GET_DB().query(query, values)
    if (result?.insertId) {
      return await findOneById(result.insertId)
    }
    return null
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT 
        m.*,
        COALESCE((
          SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'file_url', mf.file_url,
              'created_at', mf.created_at
            )
          ), ']')
          FROM message_files mf
          WHERE mf.message_id = m.id
        ), '[]') AS files,
        COALESCE((
          SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'id', mr.id,
              'user_id', mr.user_id,
              'reaction', mr.reaction,
              'created_at', mr.created_at
            )
          ), ']')
          FROM message_reactions mr
          WHERE mr.message_id = m.id
        ), '[]') AS reactions,
        COALESCE((
          SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'user_id', mrd.user_id,
              'read_at', mrd.read_at
            )
          ), ']')
          FROM message_readers mrd
          WHERE mrd.message_id = m.id
        ), '[]') AS readers,
        COALESCE(( 
        SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', dm.id,
                'user_id', dm.user_id,
                'deleted_at', dm.deleted_at
            )
        ), ']')
        FROM deleted_messages dm
        WHERE dm.message_id = m.id
        ), '[]') AS deleted_by_users
      FROM messages m
      WHERE m.id = ?`,
      [id]
    );
    if (rows?.length > 0) {
      rows[0].files = JSON.parse(rows[0].files)
      rows[0].reactions = JSON.parse(rows[0].reactions)
      rows[0].readers = JSON.parse(rows[0].readers)
      rows[0].deleted_by_users = JSON.parse(rows[0].deleted_by_users)
    }
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const checkExist = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT COUNT(*) as count FROM messages WHERE id = ?`,
      [id]
    );
    return rows[0].count > 0;
  } catch (error) {
    throw error;
  }
}

const findAllByConversationId = async (conversationId, page = 1, limit = 15) => {
  try {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 15;
    const offset = (page - 1) * limit;

    const [rows] = await GET_DB().query(
      `SELECT m.*,
        COALESCE((
            SELECT CONCAT('[', GROUP_CONCAT(
                JSON_OBJECT(
                    'file_url', mf.file_url,
                    'file_name', mf.file_name,
                    'file_type', mf.file_type,
                    'file_size', mf.file_size,
                    'created_at', mf.created_at
                )
            ), ']')
            FROM message_files mf
            WHERE mf.message_id = m.id
        ), '[]') AS files,
        COALESCE((
            SELECT CONCAT('[', GROUP_CONCAT(
                JSON_OBJECT(
                    'id', mr.id,
                    'user_id', mr.user_id,
                    'reaction', mr.reaction,
                    'created_at', mr.created_at
                )
            ), ']')
            FROM message_reactions mr
            WHERE mr.message_id = m.id
        ), '[]') AS reactions,
        COALESCE((
            SELECT CONCAT('[', GROUP_CONCAT(
                JSON_OBJECT(
                    'user_id', mrd.user_id,
                    'read_at', mrd.read_at
                )
            ), ']')
            FROM message_readers mrd
            WHERE mrd.message_id = m.id
        ), '[]') AS readers,
        COALESCE(( 
        SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', dm.id,
                'user_id', dm.user_id,
                'deleted_at', dm.deleted_at
            )
        ), ']')
        FROM deleted_messages dm
        WHERE dm.message_id = m.id
        ), '[]') AS deleted_by_users

      FROM messages m
      WHERE m.conversation_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [conversationId, limit, offset]
    );

    const [[{ total }]] = await GET_DB().query(
      `SELECT COUNT(*) AS total FROM messages WHERE conversation_id = ?`,
      [conversationId]
    );
    if (rows?.length > 0) {
      rows.forEach(row => {
        row.files = JSON.parse(row.files)
        row.reactions = JSON.parse(row.reactions)
        row.readers = JSON.parse(row.readers)
        row.deleted_by_users = JSON.parse(row.deleted_by_users)
      })
    }
    return {
      total_page: Math.ceil(total / limit) || 0,
      current_page: page || 0,
      total: total || 0,
      has_next_page: page * limit < total,
      messages: rows || []
    };
  } catch (error) {
    throw error;
  }
};

const update = async (id, updateData) => {
  try {
    const updateFields = getFields(updateData)
    const values = getValues(updateData)
    const [result] = await GET_DB().query(
      `UPDATE messages SET ${updateFields} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0
  } catch (error) {
    throw error;
  }
};

const message = {
  create,
  findOneById,
  checkExist,
  findAllByConversationId,
  update,
};

export default message;