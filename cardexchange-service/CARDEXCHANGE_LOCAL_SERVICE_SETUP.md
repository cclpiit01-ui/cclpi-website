# CardExchange Local Service --- Laptop Migration & Setup Guide

This guide documents how to restore and run the **CardExchange Local
Service** on a new Windows laptop/PC.

## Purpose

The local service connects the live CCLPI React website to the SQLite
database used by CardExchange Producer.

``` text
cclpi.com.ph
    ↓
React / Supabase
    ↓
Sync CardExchange
    ↓
http://localhost:3001
    ↓
Docker: cardexchange-service
    ↓
Windows SQLite database
    ↓
CardExchange Producer
```

The React website decides which records are sent based on the current
table filters. The local service does **not** fetch from Supabase. Its
job is to receive the filtered records and replace the working data
inside `sales_counselors.sqlite`.

------------------------------------------------------------------------

## Files to Back Up Before Changing Laptop

Copy the entire `cardexchange-service` folder from the old computer. It
should contain at least:

``` text
cardexchange-service/
├── Dockerfile
├── package.json
├── package-lock.json
└── server.js
```

Also back up the CardExchange database folder, especially:

``` text
sales_counselors.sqlite
```

The current Windows database folder used during setup was:

``` text
C:\Users\ASUS\Desktop\ID\Sales Counselor\database
```

On a new laptop this path may be different. That is okay; use the new
path when creating the Docker container.

------------------------------------------------------------------------

## 1. Install Required Software on the New Laptop

Install:

-   Docker Desktop
-   CardExchange Producer
-   The CardExchange project/database files

Node.js is not required just to run the Dockerized service because Node
runs inside the Docker image. Node.js is useful only if you also want to
run or develop the service outside Docker.

In Docker Desktop, enable:

**Settings → General → Start Docker Desktop when you sign in to your
computer**

This allows Docker to start after Windows login.

------------------------------------------------------------------------

## 2. Copy the Local Service Project

Copy the backed-up `cardexchange-service` folder to the new laptop.

Example:

``` text
C:\laragon\www\cclpi-website\cardexchange-service
```

It does not have to use this exact location. The important thing is that
the folder contains `Dockerfile`, `server.js`, and the package files.

------------------------------------------------------------------------

## 3. Copy / Configure the SQLite Database

Place the CardExchange SQLite database somewhere on the new laptop.

Example:

``` text
C:\Users\NEW-USER\Desktop\ID\Sales Counselor\database\sales_counselors.sqlite
```

The Docker service expects the database inside the container at:

``` text
/data/sales_counselors.sqlite
```

`server.js` should therefore contain:

``` javascript
const DB_PATH =
  process.env.DB_PATH || "/data/sales_counselors.sqlite";
```

Do **not** replace `/data/...` with a Windows path when running through
Docker. The Windows folder is connected to `/data` using a Docker volume
mount.

------------------------------------------------------------------------

## 4. Check the Docker Network Binding

At the bottom of `server.js`, the service must listen on:

``` javascript
app.listen(PORT, "0.0.0.0", () => {
```

Do not use `127.0.0.1` inside the container. Docker needs the Node
service to listen on `0.0.0.0`, while the Docker port itself is exposed
only to Windows localhost.

------------------------------------------------------------------------

## 5. Build the Docker Image

Open PowerShell and go to the `cardexchange-service` folder:

``` powershell
cd "C:\laragon\www\cclpi-website\cardexchange-service"
```

Build:

``` powershell
docker build -t cardexchange-service .
```

Verify:

``` powershell
docker images
```

You should see:

``` text
cardexchange-service:latest
```

------------------------------------------------------------------------

## 6. Create the Docker Container

Replace the Windows path below with the **actual database folder on the
new laptop**.

Example:

``` powershell
docker run -d --name cardexchange-service --restart unless-stopped -p 127.0.0.1:3001:3001 -v "C:\Users\NEW-USER\Desktop\ID\Sales Counselor\database:/data" cardexchange-service
```

Important parts:

-   `--name cardexchange-service` --- container name
-   `--restart unless-stopped` --- automatically restarts the service
    with Docker
-   `-p 127.0.0.1:3001:3001` --- exposes the service only on the local
    PC
-   `-v "...database:/data"` --- connects the Windows CardExchange
    database folder to the container

Do not copy the old `C:\Users\ASUS\...` path blindly if the new Windows
username or folder location is different.

------------------------------------------------------------------------

## 7. Verify the Container

Run:

``` powershell
docker ps
```

`cardexchange-service` should show a status similar to:

``` text
Up ...
```

Check logs:

``` powershell
docker logs cardexchange-service
```

Expected information includes:

``` text
CardExchange Local Service
Database: /data/sales_counselors.sqlite
Waiting for React...
```

------------------------------------------------------------------------

## 8. Test the Local Connection

Open in the browser:

``` text
http://localhost:3001/connection-test
```

Expected response:

``` json
{
  "status": "ok",
  "message": "React successfully connected to CardExchange Local Service."
}
```

Then test the SQLite connection:

``` text
http://localhost:3001/database-test
```

You should see a successful database response and the `sales_counselors`
table.

You can also check:

``` text
http://localhost:3001/database-schema
```

This reports the table columns and current record count.

------------------------------------------------------------------------

## 9. Test From the Live CCLPI Website

With Docker running on the CardExchange laptop, open:

``` text
https://cclpi.com.ph/admin/sales-counselors
```

Use **Sync Data → Sync CardExchange**.

The current React table filters determine which records are sent. For
example:

``` text
Status: Active
Agency: Example Agency
Result: 25 records
```

Syncing sends those 25 filtered records to the local service. The local
service:

1.  Validates the received records.
2.  Creates a backup of the existing SQLite database.
3.  Deletes the current working rows from `sales_counselors`.
4.  Inserts exactly the records sent by React.
5.  Verifies the final record count.

The SQLite backup folder is created under the mounted database
directory:

``` text
database\backups\
```

------------------------------------------------------------------------

## Automatic Startup After Reboot

Two things are required:

1.  Docker Desktop must start when you sign in to Windows.
2.  The container must have the restart policy:

``` text
--restart unless-stopped
```

Check the restart policy with:

``` powershell
docker inspect -f "{{.HostConfig.RestartPolicy.Name}}" cardexchange-service
```

Expected:

``` text
unless-stopped
```

After a Windows restart and login, Docker Desktop starts and the
`cardexchange-service` container should start automatically.

------------------------------------------------------------------------

## If `server.js` Is Changed Later

Docker does not automatically use changes made to `server.js` after the
image was built.

After editing the service, rebuild and recreate the container:

``` powershell
docker stop cardexchange-service
docker rm cardexchange-service
docker build -t cardexchange-service .
```

Then run it again with the correct database path:

``` powershell
docker run -d --name cardexchange-service --restart unless-stopped -p 127.0.0.1:3001:3001 -v "C:\Users\NEW-USER\Desktop\ID\Sales Counselor\database:/data" cardexchange-service
```

Removing the Docker container does **not** delete the Windows SQLite
database because the database is stored outside the container in the
mounted Windows folder.

------------------------------------------------------------------------

## Common Problems

### `Unable to find image 'cardexchange-service:latest' locally`

The Docker image has not been built yet.

Run:

``` powershell
docker build -t cardexchange-service .
```

### `ERR_EMPTY_RESPONSE`

Check:

``` powershell
docker logs cardexchange-service
```

Also verify that `server.js` uses:

``` javascript
app.listen(PORT, "0.0.0.0", () => {
```

After changing it, rebuild and recreate the container.

### Port 3001 already in use

Make sure an old manual Node service is not still running.

If you previously ran:

``` text
node server.js
```

stop that process before starting the Docker container.

Also check existing containers:

``` powershell
docker ps -a
```

### Container name already exists

Check:

``` powershell
docker ps -a
```

If the old `cardexchange-service` container is no longer needed:

``` powershell
docker stop cardexchange-service
docker rm cardexchange-service
```

Then create it again.

### Database cannot be found

Confirm the Windows database folder contains:

``` text
sales_counselors.sqlite
```

Then make sure the `-v` path in `docker run` points to that exact
folder.

------------------------------------------------------------------------

## Quick New-Laptop Checklist

-   [ ] Install Docker Desktop
-   [ ] Enable Docker Desktop startup with Windows login
-   [ ] Install/configure CardExchange Producer
-   [ ] Copy `cardexchange-service` folder
-   [ ] Copy `sales_counselors.sqlite` and CardExchange files
-   [ ] Confirm `DB_PATH` is `/data/sales_counselors.sqlite`
-   [ ] Confirm `app.listen` uses `0.0.0.0`
-   [ ] Build `cardexchange-service` Docker image
-   [ ] Create container with the new laptop's database folder mounted
    to `/data`
-   [ ] Confirm restart policy is `unless-stopped`
-   [ ] Test `/connection-test`
-   [ ] Test `/database-test`
-   [ ] Test Sync CardExchange from `cclpi.com.ph`
-   [ ] Restart Windows once and verify the container starts
    automatically

------------------------------------------------------------------------

## Current Service Summary

**Service:** CardExchange Local Service\
**Container:** `cardexchange-service`\
**Docker image:** `cardexchange-service:latest`\
**Local port:** `3001`\
**Container database:** `/data/sales_counselors.sqlite`\
**SQLite table:** `sales_counselors`\
**Production website:** `https://cclpi.com.ph`\
**Restart policy:** `unless-stopped`

Keep this file together with the `cardexchange-service` project so the
setup can be restored on another laptop without having to reconstruct
the configuration from memory.
