#!/bin/bash

echo "WARNING: This will remove all containers and container data, and will reset the .env file. This action cannot be undone!"
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Operation cancelled."
    exit 1
fi

echo "Stopping and removing all containers..."
docker compose down -v --remove-orphans

echo "Cleaning up volumes..."
rm -rf ./volumes/db/data

echo "Resetting .env file..."
if [ -f ".env" ]; then
  rm -f .env
fi

if [ -f ".env.example" ]; then
  cp .env.example .env
fi

echo "Cleanup complete!"