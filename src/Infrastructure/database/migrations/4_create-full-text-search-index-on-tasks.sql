-- Index: tasks_fts_index

-- DROP INDEX IF EXISTS public.tasks_fts_index;

CREATE INDEX IF NOT EXISTS tasks_fts_index
    ON public.tasks USING gin
    (to_tsvector('arabic'::regconfig, (title::text || ' '::text) || description))
    TABLESPACE pg_default;
