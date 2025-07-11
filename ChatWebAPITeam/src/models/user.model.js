import { GET_DB } from "~/config/database";
import { getFields, getValues } from "~/utils/algorithms";
import { generateInsertQuery } from "~/utils/queyGenerate";

const getAll = async (query, limit = 10) => {
  const page = query.page || 1
  const offset = (page - 1) * limit
  let rows, total
  try {
    if (query.d && typeof query.d === 'string') {
      [rows] = await GET_DB().query(
        `SELECT id, email, display_name, avatar, provider,
          status, bio, last_online_at 
          FROM users 
          WHERE display_name LIKE ? AND is_verified = 1
          LIMIT ? OFFSET ?  
        `,
        [`%${query.d}%`, limit, offset]
      );
      [[{ total }]] = await GET_DB().query(`
        SELECT COUNT(*) AS total FROM users
        WHERE display_name LIKE ? AND is_verified = 1`,
        [`%${query.d}%`])
    }
    else {
      [rows] = await GET_DB().query(`
        SELECT id, email, display_name, avatar, 
        provider, status, is_verified, bio, last_online_at 
        FROM users
        LIMIT ? OFFSET ?  
        `, [limit, offset]);
      [[{ total }]] = await GET_DB().query(`
          SELECT COUNT(*) AS total FROM users
          WHERE is_verified = 1`,
        [`%${query.d}%`])
    }

    return {
      total_page: Math.ceil(total / limit) || 0,
      current_page: page || 0,
      total: total || 0,
      has_next_page: page * limit < total,
      users: rows.map(row => ({ id: row.id, ...row })) || []
    }
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const { query, values } = generateInsertQuery("users", data);
    const [result] = await GET_DB().query(query, values);
    return { id: result.insertId, ...data };
  } catch (error) {
    throw error;
  }
};

const findOneById = async (id, isGetFull = false) => {
  try {
    let query = `SELECT id,
        email,
        display_name,
        provider,
        avatar,
        bio,
        status,
        last_online_at,
        created_at,
        updated_at
        is_verified
        FROM users WHERE id = ?`
    if (isGetFull) query = `SELECT *
        FROM users WHERE id = ?`
    const [rows] = await GET_DB().query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const findOneByUserName = async (username) => {
  try {
    const [rows] = await GET_DB().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const findOneByEmail = async (email) => {
  try {
    const [rows] = await GET_DB().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const update = async (id, updateData) => {
  try {
    const updateFields = getFields(updateData)
    const values = getValues(updateData)

    const [result] = await GET_DB().query(
      `UPDATE users SET ${updateFields} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const findUsersByKeyword = async (query) => {
  try {
    if (!query || typeof query !== "string") return [];

    const [rows] = await GET_DB().query(
      `SELECT id, email, display_name, avatar, provider,
       status, bio, last_online_at 
       FROM users 
       WHERE display_name LIKE ? AND is_verified = 1`,
      [`%${query}%`]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const checkExist = async (id) => {
  try {
    const [rows] = await GET_DB().query(
      `SELECT COUNT(*) as count FROM users WHERE id = ?`,
      [id]
    );
    return rows[0].count > 0;
  } catch (error) {
    throw error;
  }
}

const getAllStrangerByUserId = async (userId, reqQuery) => {
  try {
    const page = !Number.isInteger(Number(reqQuery.page)) || reqQuery.page < 1 ? 1 : Number(reqQuery.page);
    const limit = !Number.isInteger(Number(reqQuery.limit)) || reqQuery.limit < 1 ? 10 : Number(reqQuery.limit);
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        u.id AS user_id, u.email, u.display_name, u.avatar, u.provider, 
        u.status AS user_status, u.bio, u.last_online_at, u.is_verified
        FROM users u
        WHERE u.id != ?`
    let countQuery = `
        SELECT COUNT(*) AS total
        FROM users u
        WHERE u.id != ?`;

    const queryParams = [userId];
    const countParams = [userId];
    if (reqQuery.d) {
      query += " AND u.display_name LIKE ?";
      queryParams.push(`%${reqQuery.d}%`);
      countQuery += " AND u.display_name LIKE ?";
      countParams.push(`%${reqQuery.d}%`);
    }
    query += ` AND u.is_verified = 1 AND u.id NOT IN (
              SELECT fs.sender_id
              FROM friendships fs
              WHERE fs.receiver_id = ? AND fs.status = 'accepted'
              UNION
              SELECT fs.receiver_id
              FROM friendships fs
              WHERE fs.sender_id = ? AND fs.status = 'accepted')`
    queryParams.push(userId, userId);
    query += ' LIMIT ? OFFSET ?'
    queryParams.push(limit, offset);
    console.log('🚀 ~ getAllStrangerByUserId ~ queryParams:', queryParams)
    const [rows] = await GET_DB().query(query, queryParams);

    countQuery += ` AND u.is_verified = 1 AND u.id NOT IN (
      SELECT fs.sender_id
      FROM friendships fs
      WHERE fs.receiver_id = ? AND fs.status = 'accepted'
      UNION
      SELECT fs.receiver_id
      FROM friendships fs
      WHERE fs.sender_id = ? AND fs.status = 'accepted')`
    countParams.push(userId, userId);
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


const user = {
  getAll,
  create,
  findOneById,
  findOneByUserName,
  findOneByEmail,
  update,
  findUsersByKeyword,
  getAllStrangerByUserId,
  checkExist
};


export default user;