### Roles, Permissions and Transactions

### CRUD on a role

### Granting and Revoking permissions

```
create role lead_instructor with login;
create role instructor with login;
create role student with login;

--login as superuser

revoke all on all tables in schema public from public;
grant usage on all tables in schema public to public;

alter default privileges for role lead_instructor in schema public grant all on tables to lead_instructor;
alter default privileges for role lead_instructor in schema public grant insert, update, select, delete on tables to instructor;
alter default privileges for role lead_instructor in schema public grant select on tables to student;

alter default privileges for role lead_instructor in schema public grant all on sequences to lead_instructor;
alter default privileges for role lead_instructor in schema public grant all on sequences to instructor;
```

Then, you're:

1. Creating three roles (synonymous with "users") for my database
1. Removing all privileges on any _new_ tables that you create from everyone
1. Giving only the "usage" permission to everyone on all new tables you create
1. Giving `lead_instructor` permissions to do everything to any new table
1. Giving `instructor` permissions to insert, update, select, and delete anything on new tables, but nothing else (like making new tables)
1. Giving `student` permissions to select anything on new tables
1. Since `lead_instructor` and `instructor` can create new records, they need all permissions for sequences (the things that auto increment IDs)

## Slides

* [Danny](https://docs.google.com/presentation/d/1VQ6C87KF9XECrgkpi3_pzQUH-DfgoPyWd6HmJZufYHc/edit#slide=id.p)

## Docs

- [Postgres: postgres User](http://www.postgresql.org/docs/current/static/postgres-user.html)  
- [Postgres: Database Roles](http://www.postgresql.org/docs/current/static/user-manag.html)
