import { GET_DB } from "~/config/database";
import { generateInsertQuery } from "~/utils/queyGenerate";

const create = async (data) => {
  try {
    const { query, values } = generateInsertQuery("friendships", data);
    const [result] = await GET_DB().query(query, values);
    if (result?.insertId) {
      return await findOneById(result.insertId)
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const findOneById = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `
      SELECT 
        fs.id, fs.sender_id, fs.receiver_id, fs.status, fs.created_at, fs.updated_at, 
        fs.replied_at, fs.is_blocked, fs.action_by_user_id,
        u.id AS user_id, u.email, u.display_name, u.avatar, u.provider, 
        u.status AS user_status, u.bio, u.last_online_at, u.is_verified
      FROM friendships fs
      JOIN users u ON u.id = 
        CASE WHEN fs.sender_id = ? THEN fs.receiver_id
             WHEN fs.receiver_id = ? THEN fs.sender_id
        END
      WHERE fs.id = ?
    `,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const getAllByUserId = async (userId, reqQuery) => {
  try {
    const page = !Number.isInteger(Number(reqQuery.page)) || reqQuery.page < 1 ? 1 : Number(reqQuery.page);
    const limit = !Number.isInteger(Number(reqQuery.limit)) || reqQuery.limit < 1 ? 10 : Number(reqQuery.limit);
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        fs.id, fs.sender_id, fs.receiver_id, fs.status, fs.created_at, fs.updated_at, 
        fs.replied_at, fs.is_blocked, fs.action_by_user_id,
        u.id AS user_id, u.email, u.display_name, u.avatar, u.provider, 
        u.status AS user_status, u.bio, u.last_online_at, u.is_verified
      FROM friendships fs
      JOIN users u ON u.id = 
        CASE WHEN fs.sender_id = ? THEN fs.receiver_id
             WHEN fs.receiver_id = ? THEN fs.sender_id
        END
      WHERE (fs.sender_id = ? OR fs.receiver_id = ?) 
    `;

    const queryParams = [userId, userId, userId, userId];

    if (reqQuery.d) {
      query += " AND u.display_name LIKE ?";
      queryParams.push(`%${reqQuery.d}%`);
    }

    query += " AND u.is_verified = 1 LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [rows] = await GET_DB().query(query, queryParams);

    let countQuery = `
      SELECT COUNT(*) AS total FROM friendships fs
      JOIN users u ON u.id = 
        CASE WHEN fs.sender_id = ? THEN fs.receiver_id
             WHEN fs.receiver_id = ? THEN fs.sender_id
        END
      WHERE u.is_verified = 1
    `;

    const countParams = [userId, userId];

    if (reqQuery.d) {
      countQuery += " AND u.display_name LIKE ?";
      countParams.push(`%${reqQuery.d}%`);
    }

    const [[{ total }]] = await GET_DB().query(countQuery, countParams);

    return {
      total_page: Math.ceil(total / limit) || 0,
      current_page: total === 0 ? 0 : page || 0,
      total: total || 0,
      has_next_page: page * limit < total,
      friendships: rows.map(row => ({ id: row.id, ...row })) || []
    };
  } catch (error) {
    throw error;
  }
};

const update = async (id, updateData) => {
  try {
    const updateFields = Object.keys(updateData).map(field => `${field} = ?`).join(", ");
    const values = Object.values(updateData);

    const [result] = await GET_DB().query(
      `UPDATE friendships SET ${updateFields} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0
  } catch (error) {
    throw error;
  }
};

const findOneBetweenTwoUsers = async (senderId, receiverId) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT * FROM friendships 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)`,
      [senderId, receiverId, receiverId, senderId]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const friendship = {
  create,
  findOneById,
  getAllByUserId,
  update,
  findOneBetweenTwoUsers
};

export default friendship;