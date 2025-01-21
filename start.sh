#!/bin/sh -ex

npm exec prisma migrate deploy
npm exec prisma generate
npm run start
