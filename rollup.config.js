import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const external = ['axios'];

const config = [
  // ES Module build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              node: '14'
            }
          }]
        ]
      })
    ]
  },
  
  // CommonJS build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              node: '14'
            }
          }]
        ]
      })
    ]
  },

  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/beem-africa.umd.js',
      format: 'umd',
      name: 'BeemAfrica',
      sourcemap: true,
      globals: {
        axios: 'axios'
      }
    },
    external,
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions']
            }
          }]
        ]
      })
    ]
  },

  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/beem-africa.umd.min.js',
      format: 'umd',
      name: 'BeemAfrica',
      sourcemap: true,
      globals: {
        axios: 'axios'
      }
    },
    external,
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions']
            }
          }]
        ]
      }),
      terser()
    ]
  }
];

export default config;