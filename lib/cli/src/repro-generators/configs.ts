import type { StorybookConfig } from '@storybook/core-common';
import type { SupportedFrameworks } from '../project_types';

export interface Parameters {
  framework: SupportedFrameworks;
  /** E2E configuration name */
  name: string;
  /** framework version */
  version: string;
  /** CLI to bootstrap the project */
  generator: string;
  /** Use storybook framework detection */
  autoDetect?: boolean;
  /** Dependencies to add before building Storybook */
  additionalDeps?: string[];
  /** Add typescript dependency and creates a tsconfig.json file */
  typescript?: boolean;
  /** Merge configurations to main.js before running the tests */
  mainOverrides?: Partial<StorybookConfig> & Record<string, any>;
}

const fromDeps = (...args: string[]): string =>
  [
    'mkdir {{appName}}',
    'cd {{appName}}',
    // Create `yarn.lock` to force Yarn to consider adding deps in this directory
    // and not look for a yarn workspace in parent directory
    'touch yarn.lock',
    'yarn init --yes',
    args.length && `yarn add ${args.join(' ')}`,
  ]
    .filter(Boolean)
    .join(' && ');

// #region  React
export const cra: Parameters = {
  framework: 'react',
  name: 'cra',
  version: 'latest',
  generator: [
    // Force npm otherwise we have a mess between Yarn 1, Yarn 2 and NPM
    'npm_config_user_agent=npm npx -p create-react-app@{{version}} create-react-app {{appName}}',
    'cd {{appName}}',
    'echo "FAST_REFRESH=true" > .env',
    'echo "SKIP_PREFLIGHT_CHECK=true" > .env',
  ].join(' && '),
};

export const cra_typescript: Parameters = {
  framework: 'react',
  name: 'cra_typescript',
  version: 'latest',
  generator: [
    // Force npm otherwise we have a mess between Yarn 1, Yarn 2 and NPM
    'npm_config_user_agent=npm npx -p create-react-app@{{version}} create-react-app {{appName}} --template typescript',
  ].join(' && '),
};

export const react: Parameters = {
  framework: 'react',
  name: 'react',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
  additionalDeps: ['prop-types'],
};

export const react_legacy_root_api: Parameters = {
  framework: 'react',
  name: 'react_legacy_root_api',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
  additionalDeps: ['prop-types'],
  mainOverrides: {
    reactOptions: {
      legacyRootApi: true,
    },
  },
};

export const react_typescript: Parameters = {
  framework: 'react',
  name: 'react_typescript',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
  typescript: true,
};

export const webpack_react: Parameters = {
  framework: 'react',
  name: 'webpack_react',
  version: 'latest',
  generator: fromDeps('react', 'react-dom', 'webpack@webpack-4'),
};

export const vite_react: Parameters = {
  framework: 'react',
  name: 'vite_react',
  version: 'latest',
  generator: 'npx -p create-vite@{{version}} create-vite {{appName}} --template react-ts',
};

export const react_in_yarn_workspace: Parameters = {
  framework: 'react',
  name: 'react_in_yarn_workspace',
  version: 'latest',
  generator: [
    'mkdir {{appName}}',
    'cd {{appName}}',
    'echo "{ \\"name\\": \\"workspace-root\\", \\"private\\": true, \\"workspaces\\": [] }" > package.json',
    'touch yarn.lock',
    `yarn add react react-dom`,
  ].join(' && '),
};

// #endregion

// #region Angular
const baseAngular: Parameters = {
  framework: 'angular',
  name: 'angular',
  version: 'latest',
  generator: `npx -p @angular/cli@{{version}} ng new {{appName}} --routing=true --minimal=true --style=scss --skipInstall=true --strict`,
};

export const angular10: Parameters = {
  ...baseAngular,
  name: 'angular10',
  version: 'v10-lts',
};

export const angular11: Parameters = {
  ...baseAngular,
  name: 'angular11',
  version: 'v11-lts',
};

export const angular12: Parameters = {
  ...baseAngular,
  name: 'angular12',
  version: 'v12-lts',
};

export const angular130: Parameters = {
  ...baseAngular,
  name: 'angular130',
  version: '13.0.x',
};

export const angular13: Parameters = {
  ...baseAngular,
  name: 'angular13',
  version: '13.1.x',
};

export const angular_modern_inline_rendering: Parameters = {
  ...baseAngular,
  name: 'angular_modern_inline_rendering',
  additionalDeps: ['jest', '@storybook/test-runner'],
  mainOverrides: {
    features: {
      storyStoreV7: true,
      modernInlineRender: true,
    },
  },
};

export const angular: Parameters = baseAngular;
// #endregion

// #region  web components
export const web_components: Parameters = {
  framework: 'web-components',
  name: 'web_components',
  version: '2',
  generator: fromDeps('lit-element'),
};

export const web_components_typescript: Parameters = {
  ...web_components,
  name: 'web_components_typescript',
  typescript: true,
};

export const web_components_lit2: Parameters = {
  ...web_components,
  version: 'next',
  name: 'web_components_lit2',
  generator: fromDeps('lit'),
  typescript: true,
};

// #endregion

// #region  vue

export const vue: Parameters = {
  framework: 'vue',
  name: 'vue',
  // Be careful here, the latest versions of vue cli are bootstrapping a vue 3  project
  version: '4',
  generator: [
    // Force npm otherwise we have a mess between Yarn 1 and Yarn 2
    `npx -p @vue/cli@{{version}} vue create {{appName}} --default --packageManager=npm --no-git --force`,
  ].join(' && '),
};

export const vue3: Parameters = {
  framework: 'vue3',
  name: 'vue3',
  version: 'next',
  // Vue CLI v4 utilizes webpack 4, and the 5-alpha uses webpack 5 so we force ^4 here
  generator: [
    // Force npm otherwise we have a mess between Yarn 1 and Yarn 2
    `npx -p @vue/cli@^4 vue create {{appName}} --preset=__default_vue_3__ --packageManager=npm --no-git --force`,
  ].join(' && '),
};

// #endregion

export const html: Parameters = {
  framework: 'html',
  name: 'html',
  version: 'latest',
  generator: fromDeps(),
  autoDetect: false,
};

export const preact: Parameters = {
  framework: 'preact',
  name: 'preact',
  version: 'latest',
  generator:
    'npx preact-cli@{{version}} create preactjs-templates/default {{appName}} --install=false --git=false',
};

export const sfcVue: Parameters = {
  framework: 'vue',
  name: 'sfcVue',
  version: 'latest',
  //
  generator: fromDeps(
    'vue@2.6',
    'vue-loader@15.9',
    'vue-template-compiler@2.6',
    'webpack@webpack-4'
  ),
};

export const svelte: Parameters = {
  framework: 'svelte',
  name: 'svelte',
  version: 'latest',
  generator: 'npx degit sveltejs/template {{appName}}',
};
