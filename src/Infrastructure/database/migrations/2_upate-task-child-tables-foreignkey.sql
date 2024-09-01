-- task_skills table
ALTER TABLE task_skills
DROP CONSTRAINT task_skills_task_id_fkey;
ALTER TABLE task_skills
ADD CONSTRAINT task_skills_task_id_fkey
FOREIGN KEY (task_id)
REFERENCES tasks(id)
ON DELETE CASCADE;

-- task_statuses table
ALTER TABLE task_statuses
DROP CONSTRAINT task_statuses_task_id_fkey;
ALTER TABLE task_statuses
ADD CONSTRAINT task_statuses_task_id_fkey
FOREIGN KEY (task_id)
REFERENCES tasks(id)
ON DELETE CASCADE;

-- task_schedules table
ALTER TABLE task_schedules
DROP CONSTRAINT task_schedules_task_id_fkey;
ALTER TABLE task_schedules
ADD CONSTRAINT task_schedules_task_id_fkey
FOREIGN KEY (task_id)
REFERENCES tasks(id)
ON DELETE CASCADE;

-- task_attachments table
ALTER TABLE task_attachments
DROP CONSTRAINT task_attachments_task_id_fkey;
ALTER TABLE task_attachments
ADD CONSTRAINT task_attachments_task_id_fkey
FOREIGN KEY (task_id)
REFERENCES tasks(id)
ON DELETE CASCADE;
