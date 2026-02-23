NEVER write code comments

This is a NextJS, typescript, React 19 (with compiler) project with biome linting and formatting. It uses Supabase database.

Follow best practices for NextJS in 2025 and avoid common footguns. Also follow all React 19 compiler best practices.

For functions with error cases use the effect library. There is additional documentation under llm/ folder. Use effect.txt to start, then search for categories in effectFullDocs for specific complex use cases.

Emphasize simplicity. Less code is better. When you need to run the server use server functions, NEVER create externally accessible api routes

Uses a custom error handling library as defined in lib/result.ts to get around serialization requirements for server functions

If you write new migration files run the following commands:
* `pnpx supabase db reset` apply new migrations to the local database
* `pnpm run types` generate the database types
* if either command fails run `pnpx supabase start`

Uses shadcdn as a headless ui component library, if you are missing a basic component element, try adding through the shadcdn cli.
