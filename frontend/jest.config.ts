// import type { Config } from "jest";

// const config: Config = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   transform: {
//     "^.+\\.(ts|tsx)$": [
//       "ts-jest",
//       {
//         tsconfig: "tsconfig.app.json",
//       },
//     ],
//   },
// };

// export default config;


import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
  "\\.(css|scss|sass)$": "identity-obj-proxy",
},

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json"
      }
    ]
  }
};

export default config;