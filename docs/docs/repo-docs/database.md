---
sidebar_position: 3
title: Database
---

The database is an SQLite3 database which is used to store all user settings and data. 

It can be imported and exported using the [admin panel](../user-guide/admin/importExport).

## Migrations

Migrations are run automatically with any queries (they can be run manually with `npm run typeorm migration:run`) and are used to update the database schema at each version.

The migrations are written with data-integrity in mind, such that a v1 database can be imported and used without any issues. Each database file stores what migrations have been run in the `migrations` table.