import { GET_DB } from "~/config/database"
import { getFields, getValues } from "~/utils/algorithms"
import { generateInsertQuery } from "~/utils/queyGenerate"
import { conversationMembersModel } from "."
import { TYPE_CONVERSATION } from "~/utils/constants"

const create = async (data) => {
  try {
    const { query, values } = generateInsertQuery("conversations", data)
    const [result] = await GET_DB().query(query, values)
    return { id: result.insertId, ...data }
  } catch (error) {
    throw error
  }
}

const findOneByMembers = async (conversation) => {
  const { group_name, members } = conversation
  try {
    let placeholders = members.map(() => "?").join(", ")
    const queryParams = [...members, ...members, members.length]
    const query = `SELECT c.*, cm.user_id, cm.role
      FROM conversations c
      LEFT JOIN conversation_members cm ON c.id = cm.conversation_id
      WHERE 
        (c.type = 'personal' 
          AND c.id IN (
            SELECT conversation_id
            FROM conversation_members
            WHERE user_id IN (${placeholders})
            GROUP BY conversation_id
            HAVING COUNT(DISTINCT user_id) = 2
          )
        ) 
      OR 
        (c.type = 'group' 
          AND c.group_name = ? 
          AND c.id IN (
            SELECT conversation_id
            FROM conversation_members
            WHERE user_id IN (${placeholders})
            GROUP BY conversation_id
            HAVING COUNT(DISTINCT user_id) = ?
          )
        )
      LIMIT 1`
    const [rows] = await GET_DB().query(
      query,
      [...queryParams, group_name, ...queryParams]
    )

    return rows[0] || null
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT c.*, cm.user_id, cm.role
      FROM conversations c 
      JOIN conversation_members cm ON cm.conversation_id = c.id
      WHERE c.id = ?
      `,
      [id]
    )
    return rows[0] || null
  } catch (error) {
    throw error
  }
}

const findAllByUserId = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit

    const [[{ total }]] = await GET_DB().query(`
      SELECT COUNT(*) AS total FROM conversation_members
      WHERE user_id = ?
    `, [userId])

    const [rows] = await GET_DB().query(
      `SELECT c.*, cs.conversation_emoji, cs.conversation_background
      FROM conversations c
      JOIN conversation_members cm ON cm.conversation_id = c.id
      JOIN conversation_setting cs ON cs.conversation_id = c.id
      WHERE cm.user_id = ?
      LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    )
    const conversations = await Promise.all(
      rows?.map(async (row) => {
        // if (row.type === TYPE_CONVERSATION.GROUP) return row
        const { conversation_members: members } = await conversationMembersModel.findAllByConversationId(row.id, 1, 10, true);
        const conversationMembers = members?.filter(cm => cm.conversation_id === row.id);
        return { ...row, members: conversationMembers };
      })
    );

    return {
      total_page: Math.ceil(total / limit) || 0,
      current_page: page || 0,
      total: total || 0,
      has_next_page: page * limit < total,
      conversations
    }
  } catch (error) {
    throw error
  }
}

const update = async (id, updateData) => {
  try {
    const updateFields = getFields(updateData)
    const values = getValues(updateData)
    const [result] = await GET_DB().query(
      `UPDATE conversations SET ${updateFields} WHERE id = ?`,
      [...values, id]
    )
    return result.affectedRows > 0
  } catch (error) {
    throw error
  }
}

const conversation = {
  create,
  findOneByMembers,
  findOneById,
  findAllByUserId,
  update
}

export default conversation