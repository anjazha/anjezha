-- View: public.v_tasks

-- DROP MATERIALIZED VIEW IF EXISTS public.v_tasks;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.v_tasks
TABLESPACE pg_default
AS
 SELECT t.id,
    t.user_id,
    t.title,
    t.description,
    t.date,
    t.budget,
    t.longitude,
    t.latitude,
    t.address,
    tc.category,
    array_agg(DISTINCT ts.name) AS skills,
    array_agg(DISTINCT ta.file_path) AS attachmets,
    s.status,
    sch.schedule_type,
    sch.start_time,
    sch.end_time
   FROM tasks t
     LEFT JOIN categories tc ON t.category_id = tc.id
     LEFT JOIN task_skills ts ON t.id = ts.task_id
     LEFT JOIN task_statuses s ON t.id = s.task_id
     LEFT JOIN task_schedules sch ON t.id = sch.task_id
     LEFT JOIN task_attachments ta ON t.id = ta.task_id
  GROUP BY t.id, s.status, sch.schedule_type, sch.start_time, sch.end_time, tc.category
WITH DATA;

ALTER TABLE IF EXISTS public.v_tasks
    OWNER TO avnadmin;


CREATE INDEX v_tasks_category_index
    ON public.v_tasks USING btree
    (category COLLATE pg_catalog."default")
    TABLESPACE pg_default;
CREATE UNIQUE INDEX v_tasks_id_category_index
    ON public.v_tasks USING btree
    (id, category COLLATE pg_catalog."default")
    TABLESPACE pg_default;

