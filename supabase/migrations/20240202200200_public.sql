alter table
    "public"."user_files"
add
    column "display_image_url" text;

alter table
    "public"."user_files"
add
    column "extension" text not null;

create policy "Enable read access for all users" on "public"."user_files" as permissive for
select
    to public using (true);