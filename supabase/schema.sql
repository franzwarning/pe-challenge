SET
    statement_timeout = 0;

SET
    lock_timeout = 0;

SET
    idle_in_transaction_session_timeout = 0;

SET
    client_encoding = 'UTF8';

SET
    standard_conforming_strings = on;

SELECT
    pg_catalog.set_config('search_path', '', false);

SET
    check_function_bodies = false;

SET
    xmloption = content;

SET
    client_min_messages = warning;

SET
    row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET
    default_tablespace = '';

SET
    default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."anonymous_users" (
    "id" bigint NOT NULL,
    "uuid" character varying NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);

ALTER TABLE
    "public"."anonymous_users" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."anonymous_users_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER TABLE
    "public"."anonymous_users_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."anonymous_users_id_seq" OWNED BY "public"."anonymous_users"."id";

CREATE TABLE IF NOT EXISTS "public"."ar_internal_metadata" (
    "key" character varying NOT NULL,
    "value" character varying,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL
);

ALTER TABLE
    "public"."ar_internal_metadata" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."schema_migrations" ("version" character varying NOT NULL);

ALTER TABLE
    "public"."schema_migrations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_files" (
    "id" bigint NOT NULL,
    "file_name" character varying NOT NULL,
    "bucket_path" character varying NOT NULL,
    "created_at" timestamp(6) without time zone NOT NULL,
    "updated_at" timestamp(6) without time zone NOT NULL,
    "anonymous_users_id" bigint NOT NULL,
    "mime_type" "text" NOT NULL,
    "uploaded" boolean DEFAULT false NOT NULL,
    "presigned_upload_url" "text" NOT NULL,
    "description" "text",
    "price_usd" bigint
);

ALTER TABLE
    "public"."user_files" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."user_files_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER TABLE
    "public"."user_files_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."user_files_id_seq" OWNED BY "public"."user_files"."id";

ALTER TABLE
    ONLY "public"."anonymous_users"
ALTER COLUMN
    "id"
SET
    DEFAULT "nextval"('"public"."anonymous_users_id_seq"' :: "regclass");

ALTER TABLE
    ONLY "public"."user_files"
ALTER COLUMN
    "id"
SET
    DEFAULT "nextval"('"public"."user_files_id_seq"' :: "regclass");

ALTER TABLE
    ONLY "public"."anonymous_users"
ADD
    CONSTRAINT "anonymous_users_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."ar_internal_metadata"
ADD
    CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key");

ALTER TABLE
    ONLY "public"."schema_migrations"
ADD
    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");

ALTER TABLE
    ONLY "public"."user_files"
ADD
    CONSTRAINT "user_files_pkey" PRIMARY KEY ("id");

CREATE INDEX "index_user_files_on_anonymous_users_id" ON "public"."user_files" USING "btree" ("anonymous_users_id");

ALTER TABLE
    ONLY "public"."user_files"
ADD
    CONSTRAINT "user_files_anonymous_users_id_fkey" FOREIGN KEY ("anonymous_users_id") REFERENCES "public"."anonymous_users"("id");

ALTER TABLE
    "public"."user_files" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."anonymous_users" TO "anon";

GRANT ALL ON TABLE "public"."anonymous_users" TO "authenticated";

GRANT ALL ON TABLE "public"."anonymous_users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."anonymous_users_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."anonymous_users_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."anonymous_users_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."ar_internal_metadata" TO "anon";

GRANT ALL ON TABLE "public"."ar_internal_metadata" TO "authenticated";

GRANT ALL ON TABLE "public"."ar_internal_metadata" TO "service_role";

GRANT ALL ON TABLE "public"."schema_migrations" TO "anon";

GRANT ALL ON TABLE "public"."schema_migrations" TO "authenticated";

GRANT ALL ON TABLE "public"."schema_migrations" TO "service_role";

GRANT ALL ON TABLE "public"."user_files" TO "anon";

GRANT ALL ON TABLE "public"."user_files" TO "authenticated";

GRANT ALL ON TABLE "public"."user_files" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_files_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."user_files_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."user_files_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

RESET ALL;