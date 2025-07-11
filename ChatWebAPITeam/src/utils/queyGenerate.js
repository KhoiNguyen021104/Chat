export const generateInsertQuery = (tableName, data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Data must not be empty");
  }

  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map(() => "?").join(", ");

  const query = `INSERT INTO ${tableName} (${fields.join(", ")}) VALUES (${placeholders})`;

  return { query, values };
};
