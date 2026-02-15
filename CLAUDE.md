NEVER write code comments

This is a NextJS, typescript, React 19 (with compiler) project with biome linting and formatting. It uses Supabase database.

Follow best practices for NextJS in 2025 and avoid common footguns. Also follow all React 19 compiler best practices.

For functions with error cases use the effect library. There is additional documentation under llm/ folder. Use effect.txt to start, then search for categories in effectFullDocs for specific complex use cases.

Emphasize simplicity. Less code is better. When you need to run the server use server functions, NEVER create externally accessible api routes

Uses a custom error handling library as defined in lib/result.ts to get around serialization requirements for server functions
