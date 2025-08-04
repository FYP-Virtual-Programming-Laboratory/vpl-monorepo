import { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
  schema: "../../apps/collab-server/src/schema.gql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
