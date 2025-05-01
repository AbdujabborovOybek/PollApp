// src/sql/sql.helper.js
const pool = require("../sql/connection"); // This file should export pool.promise() from mysql2

class SQLHelper {
  /**
   * Executes a SQL query with the given parameters.
   * @param {string} sql - The SQL query to execute.
   * @param {Array} [values=[]] - An array of values to inject into the query.
   * @returns {Promise<any>} - Resolves with the query results.
   */
  async query(sql, values = []) {
    try {
      const [results] = await pool.query(sql, values);
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Executes a SQL command (INSERT, UPDATE, DELETE, etc.) with the given parameters.
   * @param {string} sql - The SQL command to execute.
   * @param {Array} [values=[]] - An array of values to safely inject into the SQL command.
   * @returns {Promise<any>} - Resolves with the result of the command.
   */
  async execute(sql, values = []) {
    try {
      const [results] = await pool.execute(sql, values);
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a transaction helper that provides methods to manage a transaction.
   * Usage example:
   * const tx = await sqlHelper.transaction();
   * await tx.beginTransaction();
   * const result = await tx.query("UPDATE ...", [params]);
   * await tx.commit();
   * tx.release();
   *
   * @returns {Promise<Object>} - An object with transaction methods.
   */
  async transaction() {
    const connection = await pool.getConnection();

    return {
      /**
       * Begins a transaction.
       * @returns {Promise<void>}
       */
      async beginTransaction() {
        await connection.beginTransaction();
      },

      /**
       * Executes a query within the transaction.
       * @param {string} sql - The SQL query to execute.
       * @param {Array} [values=[]] - An array of values for the query.
       * @returns {Promise<any>} - Resolves with the query results.
       */
      async query(sql, values = []) {
        const [results] = await connection.query(sql, values);
        return results;
      },

      /**
       * Commits the current transaction.
       * @returns {Promise<void>}
       */
      async commit() {
        await connection.commit();
      },

      /**
       * Rolls back the current transaction.
       * @returns {Promise<void>}
       */
      async rollback() {
        await connection.rollback();
      },

      /**
       * Releases the connection back to the pool.
       */
      release() {
        connection.release();
      },
    };
  }
}

module.exports = new SQLHelper();
