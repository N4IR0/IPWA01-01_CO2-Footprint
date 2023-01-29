import {onMount} from "svelte";
import {pageSettingStore} from "../stores/page-setting-store.js";

export function rtlSwitch() {
    onMount(() => {
        // RTL languages
        const rtl_languages = ["ar", "arc", "dv", "fa", "ha", "he", "khw", "ks", "ku", "ps", "ur", "yi"];
        let browser_language = window.navigator.language.split(/[-_]/, 1)[0];

        // Change direction to RTL if RTL language is detected
        if (rtl_languages.includes(browser_language)) {
            document.getElementsByTagName('body')[0].setAttribute('dir', 'rtl');
            pageSettingStore.update(settingStore => ({...settingStore, rtl: true}));
        }
    })
}