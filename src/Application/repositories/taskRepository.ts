import { injectable } from "inversify";
import { ITaskRepository } from "../interfaces/Task/ITaskRepository";
import { connectDB, pgClient } from "@/Infrastructure/database";
import { safePromise } from "@/helpers/safePromise";
import { Task } from "@/Domain/entities/Task";
import { HTTP400Error, HTTP500Error } from "@/helpers/ApiError";
import { faker } from "@faker-js/faker";

@injectable()
export class TaskRepository implements ITaskRepository {
  constructor() {}
  async createTask(task: Task): Promise<Task> {
    // let query = `INSERT INTO tasks (user_id `;
    // let placeholders = `($1`;
    // const values = [userId];

    // Object.keys(task).forEach((key, i) => {
    //   query += `,${key}`;
    //   placeholders += `,$${i + 2}`;
    //   values.push(task[key]);
    // });

    // query += `) VALUES ${placeholders}) RETURNING *`;
    // console.log(query)
    const client = await pgClient.connect();
    try {
      await client.query("BEGIN");
      const insertTaskText = `
      INSERT INTO tasks (user_id, title, description, date, budget, longitude, latitude, address, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;
      const { rows } = await client.query(insertTaskText, [
        task.userId,
        task.title,
        task.description,
        task.date,
        task.budget,
        task.location?.longitude,
        task.location?.latitude,
        task.address,
        task.category_id,
      ]);
      //   console.log(rows);
      const taskId = rows[0].id;

      console.log(taskId);
      // set task status to its default value // pending
      await client.query(
        "INSERT INTO task_statuses (task_id, status) VALUES ($1, $2)",
        [taskId, "pending"]
      );

      // insert task skills
      for (let skill of task.skills!) {
        let query = `INSERT INTO task_skills (task_id, name) VALUES ($1, $2)`;
        let values = [taskId, skill];
        await client.query(query, values);
      }

      // Insert into task_schedules table
      await client.query(
        `
    INSERT INTO task_schedules (task_id, start_time, schedule_type, end_time)
    VALUES ($1, $2, $3, $4)`,
        [
          taskId,
          task.schedule?.start_time,
          task.schedule?.schedule_type,
          task.schedule?.end_time,
        ]
      );
      task.schedule;
      if (task.attachments) {
        task.attachments.forEach(
          async (attachment: {
            file_type: string;
            file_path: string;
            file_size: number;
          }) => {
            await client.query(
              `
        INSERT INTO task_attachments (task_id, file_type, file_path, file_size)
        VALUES ($1, $2, $3, $4)`,
              [
                taskId,
                attachment.file_type,
                attachment.file_path,
                attachment.file_size,
              ]
            );
          }
        );
      }
      await client.query("COMMIT");
      //   console.log(rows[0].id);
      return rows[0];
    } catch (e: any) {
      await client.query("ROLLBACK");
      //   console.error(e);
      throw new HTTP500Error("create task transaction failed " + e.message);
    } finally {
      client.release();
    }
  }

  async updateTask(id: number, task: any): Promise<Task | null> {
    let query = `UPDATE tasks SET `;

    for (let key in task) {
      if (!task[key]) continue;
      if (
        ["schedule", "attachments", "skills", "userId", "status"].includes(key)
      )
        continue;
      if (key === "location") {
        query += `longitude = ${task.location.longitude}, latitude = ${task.location.latitude}, `;
        continue;
      }
      query += `${key} = '${task[key]}', `;
    }
    query += ` updated_at = NOW() WHERE id = ${id} RETURNING *`;

    const client = await pgClient.connect();
    try {
      // start the transaction
      await client.query("BEGIN");

      const { rows } = await client.query(query);

      if (task.schedule) {
        let scheduleQ = `INSERT INTO task_schedules (task_id, start_time, schedule_type, end_time) VALUES ($1, $2, $3, $4)`;
        await client.query(`DELETE FROM task_schedules WHERE task_id = ${id}`);
        await client.query(scheduleQ, [
          id,
          task.schedule.start_time,
          task.schedule.schedule_type,
          task.schedule.end_time,
        ]);
      }
      console.log(query);
      if (task.status) {
        await client.query(
          `UPDATE task_statuses SET status = '${task.status}' WHERE task_id = ${id}`
        );
      }
      if (task.skills?.length > 0) {
        await client.query(`DELETE FROM task_skills WHERE task_id = ${id}`);
        for (let key of task.skills) {
          //   skillsQ += `${key} = '${task.skills[key]}', `;
          await client.query(
            `INSERT INTO task_skills (task_id, name) VALUES ($1, $2)`,
            [id, key]
          );
        }
      }

      if (task.attachments) {
        // store attachments for deleting them from storage later
        const [error, data] = await safePromise(() =>
          client.query(`DELETE FROM task_attachments WHERE task_id = ${id}`)
        );
        if (error) throw new Error(error);

        task.attachments.forEach(
          async (attachment: {
            file_type: string;
            file_path: string;
            file_size: number;
          }) => {
            await client.query(
              `
          INSERT INTO task_attachments (task_id, file_type, file_path, file_size)
          VALUES ($1, $2, $3, $4)`,
              [
                rows[0].id,
                attachment.file_type,
                attachment.file_path,
                attachment.file_size,
              ]
            );
          }
        );
      }

      await client.query("COMMIT");
      return rows[0];
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new HTTP500Error("Error while updating task " + error.message);
    } finally {
      client.release();
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    const [error, data] = await safePromise(() =>
      pgClient.query(`DELETE FROM tasks WHERE id = ${id} RETURNING *`)
    );

    if (error)
      throw new HTTP500Error("Error while deleting task " + error.message);

    if (!data.rows[0]) return false;

    return true;
  }

  async findAllTasks(): Promise<Task[]> {
    try {
      const { rows } = await pgClient.query(`
SELECT 
    t.id,
    t.user_id,
    t.title,
    t.description,
    t.date,
    t.budget,
    t.longitude,
    t.latitude,
    t.address,
    tc.category as category,
    ARRAY_AGG(distinct ts.name) AS skills,  
	  ARRAY_AGG(distinct ta.file_path) AS attachmets ,
    s.status,
    sch.schedule_type,
    sch.start_time,
    sch.end_time
FROM 
    tasks t
LEFT JOIN categories tc ON t.category_id = tc.id
LEFT JOIN 
    task_skills ts ON t.id = ts.task_id
LEFT JOIN 
    task_statuses s ON t.id = s.task_id
LEFT JOIN 
    task_schedules sch ON t.id = sch.task_id
LEFT JOIN 
    task_attachments ta ON t.id = ta.task_id
GROUP BY 
    t.id, s.status, sch.schedule_type, sch.start_time, sch.end_time, tc.category;`);
      return rows;
    } catch (error: any) {
      throw new HTTP500Error("Error while fetching tasks " + error.message);
    }
  }

  async findTaskById(id: number): Promise<Task | null> {
    try {
      const { rows } = await pgClient.query(`
  SELECT 
      t.id,
      t.user_id,
      t.title,
      t.description,
      t.date,
      t.budget,
      t.longitude,
      t.latitude,
      t.address,
      tc.category as category,
      ARRAY_AGG(distinct ts.name) AS skills,  
      ARRAY_AGG(distinct ta.file_path) AS attachmets ,
      s.status,
      sch.schedule_type,
      sch.start_time,
      sch.end_time
  FROM 
      tasks t
  LEFT JOIN categories tc ON t.category_id = tc.id
  LEFT JOIN 
      task_skills ts ON t.id = ts.task_id
  LEFT JOIN 
      task_statuses s ON t.id = s.task_id
  LEFT JOIN 
      task_schedules sch ON t.id = sch.task_id
  LEFT JOIN 
      task_attachments ta ON t.id = ta.task_id
  WHERE t.id = ${id}
  GROUP BY 
      t.id, s.status, sch.schedule_type, sch.start_time, sch.end_time, tc.category;`);
      return rows[0];
    } catch (error: any) {
      throw new HTTP500Error("Error while fetching task " + error.message);
    }
  }

  async findTasksByUserId(userId: number): Promise<Task[]> {
    const [error, tasks] = await safePromise(() =>
      pgClient.query(`
        SELECT 
            t.id,
            t.user_id,
            t.title,
            t.description,
            t.date,
            t.budget,
            t.longitude,
            t.latitude,
            t.address,
            tc.category as category,
            ARRAY_AGG(distinct ts.name) AS skills,  
            ARRAY_AGG(distinct ta.file_path) AS attachmets ,
            s.status,
            sch.schedule_type,
            sch.start_time,
            sch.end_time
        FROM 
            tasks t
        LEFT JOIN categories tc ON t.category_id = tc.id
        LEFT JOIN 
            task_skills ts ON t.id = ts.task_id
        LEFT JOIN 
            task_statuses s ON t.id = s.task_id
        LEFT JOIN 
            task_schedules sch ON t.id = sch.task_id
        LEFT JOIN 
            task_attachments ta ON t.id = ta.task_id
        WHERE t.user_id = ${userId}
        GROUP BY 
            t.id, s.status, sch.schedule_type, sch.start_time, sch.end_time, tc.category;`)
    );

    if (error)
      throw new HTTP500Error("Error while fetching tasks " + error.message);

    return tasks.rows;
  }

  async search(
    q: string,
    filters: {
      minBudget?: number;
      maxBudget?: number;
      government?: string;
      status?: string;
      category?: number;
      skills?: string[];
      page: number;
      limit: number;
    },
    sortBy: string
  ): Promise<Task[]> {
    let searchQ = `
    SELECT 
        t.id,
        t.user_id,
        t.title,
        t.description,
        t.date,
        t.budget,
        t.longitude,
        t.latitude,
        t.address,
        tc.category AS category,
        ARRAY_AGG(DISTINCT ts.name) AS skills,  
        s.status,
        sch.schedule_type,
        sch.start_time,
        sch.end_time
        ${
          sortBy === "relevance"
            ? `, ts_rank(to_tsvector('arabic', t.title || ' ' || t.description), plainto_tsquery('arabic', $1 || ':*')) AS rank `
            : ""
        }
        , COUNT(t.id) OVER() AS total_count
    FROM 
        tasks t
    LEFT JOIN 
        categories tc ON t.category_id = tc.id
    LEFT JOIN 
        task_skills ts ON t.id = ts.task_id
    LEFT JOIN 
        task_statuses s ON t.id = s.task_id
    LEFT JOIN 
        task_schedules sch ON t.id = sch.task_id 
    WHERE 
        ($1 = '' OR t.title || ' ' || t.description @@ to_tsquery($1 || ':*'))
`;

    const queryParams: any[] = [q || ""];
    // const queryParams: any[] = q?[q]:[':*'];

    // Add dynamic filters
    if (filters?.minBudget !== undefined && filters.minBudget > 0) {
      searchQ += ` AND t.budget >= $${queryParams.length + 1}`;
      queryParams.push(filters.minBudget);
    }

    if (filters?.maxBudget !== undefined && filters.maxBudget < 1000000) {
      searchQ += ` AND t.budget <= $${queryParams.length + 1}`;
      queryParams.push(filters.maxBudget);
    }

    if (filters?.government) {
      searchQ += ` AND t.government = $${queryParams.length + 1}`;
      queryParams.push(filters.government);
    }

    if (filters?.status) {
      searchQ += ` AND s.status = $${queryParams.length + 1}`;
      queryParams.push(filters.status);
    }
    if (filters?.category) {
      searchQ += ` AND tc.id = $${queryParams.length + 1}`;
      queryParams.push(filters.category);
    }

    searchQ += ` GROUP BY t.id, tc.category, s.status, sch.schedule_type, sch.start_time, sch.end_time`;

    if (filters?.skills && filters.skills.length > 0) {
      searchQ += ` HAVING ARRAY_AGG(DISTINCT LOWER(ts.name))::TEXT[] && LOWER($${
        queryParams.length + 1
      })::TEXT[]`;
      queryParams.push(filters.skills);
    }

    searchQ += ` ORDER BY ${
      sortBy === "relevance" ? " rank DESC" : `t.${sortBy} DESC`
    }`;
    searchQ += ` OFFSET ${filters.limit * (filters.page - 1)} LIMIT ${
      filters.limit
    }`;
    // console.log(searchQ);

    const [error, data] = await safePromise(() =>
      pgClient.query(searchQ, queryParams)
    );
    // console.log(error, data);
    if (error) throw new HTTP500Error(error.message);
    return data.rows;
  }

  async taskerFeed(taskerId: number): Promise<Task[]> {
    const query = `WITH get_tasker_skills AS (
    SELECT DISTINCT sk.name
    FROM taskers t
    LEFT JOIN tasker_skills ts USING(user_id)
    LEFT JOIN skills sk ON ts.skill_id = sk.id
    WHERE user_id = $1
), get_skills_match_count AS (
    SELECT 
        t.id AS task_id,
        t.*, -- Assuming tasks have a title, replace it with the actual column
        array_length(
            ARRAY(
                SELECT unnest(ARRAY(
                    SELECT name FROM get_tasker_skills
                ))
                INTERSECT
                SELECT unnest(t.skills) -- Assuming tasks have a skills array
            ), 1
        ) AS skills_count
    FROM v_tasks t
), get_distance_between_tasker_and_tasks AS (
    SELECT 
        ts.id AS task_id, -- Ensure task_id is included for joining
        (
            6371 * acos(
                cos(radians(ts.latitude)) * 
                cos(radians(t.latitude)) * 
                cos(radians(t.longitude) - radians(ts.longitude)) + 
                sin(radians(ts.latitude)) * 
                sin(radians(t.latitude))
            )
        ) AS distance
    FROM v_tasks ts,
         (SELECT latitude, longitude FROM taskers WHERE id = 15) t
)
SELECT 
	sk.*
FROM get_skills_match_count sk
JOIN get_distance_between_tasker_and_tasks d ON sk.task_id = d.task_id -- Join on task_id to filter tasks
WHERE sk.skills_count > 0 -- Ensure only tasks with matching skills are returned
ORDER BY sk.skills_count DESC, d.distance ASC NULLS LAST;`;

    const [error, data] = await safePromise(() =>
      pgClient.query(query, [taskerId])
    );

    if (error)
      throw new HTTP500Error(
        "an error occured while fetching tasker feed " + error.message
      );

      console.log(data.rows)
    return data.rows;
  }
}

// const repo = new TaskRepository();

// repo.createTask(5, {
//     title: "Fix Leaky Faucet",
//     description: "Need a plumber to fix a leaky faucet in the kitchen.",
//     date: "2024-08-27", // YYYY-MM-DD format
//     budget: 150.00, // Budget in currency
//     longitude: -122.4194, // Longitude example (San Francisco)
//     latitude: 37.7749, // Latitude example (San Francisco)
//     address: "123 Market St, San Francisco, CA 94103",
//     category_id: 1 // Assuming category with ID 3 exists (e.g., Plumbing)
//   }
//   ).then((data) => {
//     console.log(data);
// }).catch((error) => {
//     console.log(error);
// })

// Generate a single task with random data
// const generateTask = () => {
//     return {
//       userId: 8,
//       title: faker.company.catchPhrase(),
//       description: faker.lorem.sentences(3),
//       date: '2024-08-27',
//       budget: faker.finance.amount({min:100, max:1000}),
//       location: {
//           longitude: faker.location.longitude(),
//           latitude: faker.location.latitude(),
//       },
//       address: faker.location.streetAddress(),
//       category_id: 3,
//       skills: faker.helpers.arrayElements(
//           ['سباكه', 'نجاره', 'حداده', 'نقاشه', 'محاره'],
//           faker.number.int({ min: 1, max: 3 })
//       ),
//       schedule: {
//           start_time: '11:00:00',
//           schedule_type: faker.helpers.arrayElement(['Full-Time', 'Part-Time', 'Flexible']),
//           end_time: '13:00:00',
//       },
//       attachments: [
//           {
//               file_type: 'pdf',
//               file_path: faker.system.filePath(),
//               file_size: faker.number.int({ min: 100, max: 10000 }),
//           },]
// };
// }
// // Generate multiple tasks
// const generateTasks = (count) => {
//     const tasks = [];
//     for (let i = 0; i < count; i++) {
//         tasks.push(generateTask());
//     }
//     return tasks;
// };

// // Example usage
// (async () => {
//     const tasks = generateTasks(100);
//     let c = 0;
//     for (let task of tasks) {
//         try {
//             await new TaskRepository().createTask(task); // Assuming createTask is your method
//             console.log("done : " + ++c)
//         } catch (error) {
//             console.error('Failed to create task:', error.message);
//         }
//     }
//     console.log('All tasks generated and inserted successfully!');
// })();
