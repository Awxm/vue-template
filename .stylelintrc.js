module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties', 'stylelint-scss'],
  rules: {
    // 开启属性冲突提示插件
    // 针对::v-deep
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep', 'deep'] }],
    'plugin/declaration-block-no-ignored-properties': true,
    'font-family-no-missing-generic-family-keyword': null,
    // 具体规则配置参见：https://cloud.tencent.com/developer/section/1489630
    'function-name-case': ['lower', { ignoreFunctions: ['/colorPalette/'] }],
    'selector-pseudo-class-no-unknown': null,
    'no-invalid-double-slash-comments': null,
    'no-descending-specificity': null,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    // 颜色格式如 rgba(255, 255, 255, 0.5)
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    // 开放scss内置规则，如mixin、extend、if、else等
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // 取消命名校验
    'selector-id-pattern': '',
    'selector-class-pattern': '',
    'keyframes-name-pattern': 'string',
    // 不要使用已被 autoprefixer 支持的浏览器前缀
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'property-no-unknown': null,
    'keyframes-name-pattern': null,
    'media-feature-range-operator-space-after': null,
    'media-feature-range-operator-space-before': null,
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.vue', '**/*.html'],
      customSyntax: 'postcss-html',
    },
  ],
};
