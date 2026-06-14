import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * 轻量双语助手。
 *
 * 站点只维护两种语言（简体中文 / English），自定义页面与组件中的文案
 * 直接内联两种语言，按当前 locale 选择，避免维护分散的 code.json。
 * 导航栏 / 页脚等主题渲染的文案仍走 Docusaurus 主题翻译 JSON。
 *
 * 用法：
 *   const t = useT();
 *   <h1>{t('步天工程社', 'Butian Engineering Club')}</h1>
 */
export function useT(): (zh: string, en: string) => string {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  return (zh, en) => (currentLocale === 'en' ? en : zh);
}

/** 返回当前是否为英文 locale，用于需要分支渲染的场景。 */
export function useIsEn(): boolean {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  return currentLocale === 'en';
}
