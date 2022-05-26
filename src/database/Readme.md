---
sidebar_position: 1
title: Database
---

The database is an SQLite3 database which is used to store all user settings and data. 

It can be imported and exported using the [admin panel](../user-guide/admin/importExport).

## Migrations

Migrations are run automatically on start (they can be run manually with `npm run typeorm migration:run`) and are used to update the database schema at each version.

The migrations are written with data-integrity in mind, such that a v1 database can be imported and used without any issues. Each database file stores what migrations have been run in the `migrations` table.

## Export

On boot, the database is copied over to `/admin` as a backup. This is done such that the user can use the export button on the admin interface to download that copy of the database for future use.