create sequence "public"."anonymous_users_id_seq";

create sequence "public"."user_files_id_seq";

create table "public"."anonymous_users" (
    "id" bigint not null default nextval('anonymous_users_id_seq' :: regclass),
    "uuid" character varying not null,
    "created_at" timestamp(6) without time zone not null,
    "updated_at" timestamp(6) without time zone not null
);

create table "public"."ar_internal_metadata" (
    "key" character varying not null,
    "value" character varying,
    "created_at" timestamp(6) without time zone not null,
    "updated_at" timestamp(6) without time zone not null
);

create table "public"."schema_migrations" ("version" character varying not null);

create table "public"."user_files" (
    "id" bigint not null default nextval('user_files_id_seq' :: regclass),
    "file_name" character varying not null,
    "bucket_path" character varying not null,
    "created_at" timestamp(6) without time zone not null,
    "updated_at" timestamp(6) without time zone not null,
    "anonymous_users_id" bigint not null,
    "mime_type" text not null,
    "uploaded" boolean not null default false,
    "presigned_upload_url" text not null,
    "description" text,
    "price_usd" bigint
);

alter table
    "public"."user_files" enable row level security;

alter sequence "public"."anonymous_users_id_seq" owned by "public"."anonymous_users"."id";

alter sequence "public"."user_files_id_seq" owned by "public"."user_files"."id";

CREATE UNIQUE INDEX anonymous_users_pkey ON public.anonymous_users USING btree (id);

CREATE UNIQUE INDEX ar_internal_metadata_pkey ON public.ar_internal_metadata USING btree (key);

CREATE INDEX index_user_files_on_anonymous_users_id ON public.user_files USING btree (anonymous_users_id);

CREATE UNIQUE INDEX schema_migrations_pkey ON public.schema_migrations USING btree (version);

CREATE UNIQUE INDEX user_files_pkey ON public.user_files USING btree (id);

alter table
    "public"."anonymous_users"
add
    constraint "anonymous_users_pkey" PRIMARY KEY using index "anonymous_users_pkey";

alter table
    "public"."ar_internal_metadata"
add
    constraint "ar_internal_metadata_pkey" PRIMARY KEY using index "ar_internal_metadata_pkey";

alter table
    "public"."schema_migrations"
add
    constraint "schema_migrations_pkey" PRIMARY KEY using index "schema_migrations_pkey";

alter table
    "public"."user_files"
add
    constraint "user_files_pkey" PRIMARY KEY using index "user_files_pkey";

alter table
    "public"."user_files"
add
    constraint "user_files_anonymous_users_id_fkey" FOREIGN KEY (anonymous_users_id) REFERENCES anonymous_users(id) not valid;

alter table
    "public"."user_files" validate constraint "user_files_anonymous_users_id_fkey";