const { query, transaction } = require("../utils/sql.helper");
const { v4: uuidv4 } = require("uuid");

class pollService {
  // Poll service GET - api/poll/create
  async create(req, res) {
    const tx = await transaction();

    try {
      await tx.beginTransaction();

      const payloadPoll = {
        id: uuidv4(),
        user_id: req.user.user_id,
        question: req.body.question,
        poll_type: req.body.poll_type,
        type_of_poll: req.body.type_of_poll,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
      };
      const sqlInsertPoll = `INSERT INTO polls SET ?`;
      await tx.query(sqlInsertPoll, payloadPoll);

      req.body.poll_options.forEach((option) => {
        const payloadPollOption = {
          poll_id: payloadPoll.id,
          option_text: option,
        };
        const sqlInsertPollOption = `INSERT INTO poll_options SET ?`;
        tx.query(sqlInsertPollOption, payloadPollOption);
      });

      await tx.commit();

      return {
        status: "created",
        msg: "Poll created successfully",
      };
    } catch (error) {
      await tx.rollback();
      console.error("Error creating poll:", error);
      return {
        status: "warning",
        msg: "Failed to create poll",
      };
    } finally {
      await tx.release();
    }
  }

  // Poll service GET - api/poll/get
  async get(req, res) {
    const { status = "all", type_of_poll = "all" } = req.query;

    try {
      let sql = `SELECT * FROM polls WHERE user_id = ?`;
      const params = [req.user.user_id];

      // Agar status filterlangan bo‘lsa
      if (status !== "all") {
        sql += ` AND status = ?`;
        params.push(status);
      }

      // Agar type_of_poll filterlangan bo‘lsa
      if (type_of_poll !== "all") {
        sql += ` AND type_of_poll = ?`;
        params.push(type_of_poll);
      }

      sql += ` ORDER BY created_at DESC`;

      const result = await query(sql, params);

      if (!result.length) {
        return {
          status: "empty",
          msg: "No polls found",
        };
      }

      return {
        status: "success",
        msg: "Polls fetched successfully",
        data: result,
      };
    } catch (error) {
      console.error("Error fetching polls:", error);
      return {
        status: "warning",
        msg: "Failed to fetch polls",
      };
    }
  }

  // Poll service GET - api/poll/get/:id
  async getById(req, res) {
    const { id } = req.params;

    try {
      const sql = `SELECT * FROM polls WHERE id = ? AND user_id = ?`;
      const params = [id, req.user.user_id];

      const result = await query(sql, params);

      if (!result.length) {
        return {
          status: "empty",
          msg: "Poll not found",
        };
      }

      const sqlGetOptions = `SELECT * FROM poll_options WHERE poll_id = ? ORDER BY id ASC`;
      const options = await query(sqlGetOptions, [id]);

      const sqlGetResults = `SELECT * FROM poll_results WHERE poll_id = ?`;
      const poll_results = await query(sqlGetResults, [id]);

      return {
        status: "success",
        msg: "Poll fetched successfully",
        data: {
          ...result[0],
          poll_options: options,
          poll_results: poll_results,
        },
      };
    } catch (error) {
      console.error("Error fetching poll by ID:", error);
      return {
        status: "warning",
        msg: "Failed to fetch poll",
      };
    }
  }

  // Poll service PATCH - api/poll/vote/:id
  async vote(req, res) {
    try {
      const poll_id = req.params.id;
      const vote = req.body.vote;

      // Check if the poll exists
      const sqlCheckPoll = `SELECT * FROM polls WHERE id = ?`;
      const poll = await query(sqlCheckPoll, [poll_id]);
      if (!poll.length) {
        return {
          status: "notFound",
          msg: "Poll not found or has been deleted",
        };
      }

      // Check if the user has already voted
      const sqlCheckVote = `SELECT * FROM poll_results WHERE poll_id = ? AND user_id = ?`;
      const setHeader = [poll_id, req.user.user_id];
      const existingVote = await query(sqlCheckVote, setHeader);
      if (existingVote.length) {
        return {
          status: "warning",
          msg: "You have already voted for this option",
        };
      }

      if (poll[0].poll_type === "single_choice") {
        const vote_id = vote[0];
        const sqlCheckPollPptions = `SELECT * FROM poll_options WHERE id = ? AND poll_id = ?`;
        const option = await query(sqlCheckPollPptions, [vote_id, poll_id]);
        if (!option.length) {
          return {
            status: "notFound",
            msg: `Option with ID ${vote_id} not found`,
          };
        }

        // Insert the vote into the poll_results table
        const payloadVote = {
          id: uuidv4(),
          poll_id: poll_id,
          user_id: req.user.user_id,
          option_id: vote_id,
        };
        const sqlInsertVote = `INSERT INTO poll_results SET ?`;
        const result = await query(sqlInsertVote, payloadVote);

        if (!result.affectedRows) {
          return {
            status: "warning",
            msg: "Failed to record your vote",
          };
        }

        return {
          status: "success",
          msg: "Vote recorded successfully",
        };
      }

      if (poll[0].poll_type === "multiple_choice") {
        for (let i = 0; i < vote.length; i++) {
          const sqlCheckOption = `SELECT * FROM poll_options WHERE id = ? AND poll_id = ?`;
          const option = await query(sqlCheckOption, [vote[i], poll_id]);

          if (!option.length) {
            return {
              status: "notFound",
              msg: `Option with ID ${vote[i]} not found`,
            };
          }
        }

        const tx = await transaction();

        try {
          await tx.beginTransaction();

          // Insert the votes into the poll_results table
          for (let i = 0; i < vote.length; i++) {
            const payloadVote = {
              id: uuidv4(),
              poll_id: poll_id,
              user_id: req.user.user_id,
              option_id: vote[i],
            };
            const sqlInsertVote = `INSERT INTO poll_results SET ?`;
            await tx.query(sqlInsertVote, payloadVote);
          }

          await tx.commit();
          return {
            status: "success",
            msg: "Votes recorded successfully",
          };
        } catch (error) {
          await tx.rollback();
          console.error("Error recording votes:", error);
          return {
            status: "warning",
            msg: "Failed to record your votes",
          };
        } finally {
          await tx.release();
        }
      }

      return {
        status: "warning",
        msg: "Invalid poll type",
      };
    } catch (error) {
      console.error("Error processing vote:", error);
      return {
        status: "warning",
        msg: "Failed to process your vote",
      };
    }
  }
}

module.exports = new pollService();

// {
//   question: 'test',
//   poll_type: 'single_choice',
//   type_of_poll: 'public',
//   start_time: '2025-04-10T00:00:00Z',
//   end_time: '2025-04-10T23:59:59Z',
//   poll_options: [ '1 javob', '3 javob', '3 javob' ]
// }
