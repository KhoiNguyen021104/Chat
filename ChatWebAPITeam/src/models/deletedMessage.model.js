import { GET_DB } from "~/config/database";
import { getFields, getValues } from "~/utils/algorithms";
import { generateInsertQuery } from "~/utils/queyGenerate";

const create = async (reqBody) => {
  try {
    const { query, values } = generateInsertQuery("deleted_messages", reqBody)
    const [result] = await GET_DB().query(query, values)
    return result.insertId ? { id: result.insertId, ...reqBody } : null
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT * FROM deleted_messages WHERE id = ?`,
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
      `SELECT COUNT(*) as count FROM deleted_messages WHERE message_id = ? AND user_id = ?`,
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
      `DELETE FROM deleted_messages 
       WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}
const deletedMessage = {
  create,
  findOneById,
  checkExist,
  deleteOne
};

export default deletedMessage;