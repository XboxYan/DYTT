import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

import cn from '../src/translations/cn.json';
import en from '../src/translations/en.json';

import Storage from './storage';

i18n.locale = RNLocalize.getLocales().languageCode;
i18n.fallbacks = true;
i18n.translations = {
    en,
    'zh-CN': cn
};

console.log('i18n', i18n);

export const configure = async () => {
    const settings = await Storage.get('settings')
    const defaultLang = settings.enableEng ? 'en' : 'zh-CN';

    i18n.locale = defaultLang;
}

export default i18n;