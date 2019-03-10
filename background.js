chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get('configs', function (data) {
        reloadRules(data.configs);
    });

    chrome.pageAction.onClicked.addListener(function (tabs) {
        chrome.storage.sync.get('configs', function (data) {
            let currentUrl = new URL(tabs.url);
            
            let currentConfigs = data.configs.filter(x => currentUrl.href.toLowerCase().includes(x.url.toLowerCase()));
            if (currentConfigs.length > 0) {
                let currentConfig = currentConfigs[0];
                if (currentUrl.searchParams.has('templatehints')) {
                    currentUrl.searchParams.delete('templatehints');
                } else {
                    currentUrl.searchParams.set('templatehints', currentConfig.code);
                }

                chrome.tabs.executeScript({
                    code: `window.location.replace('${currentUrl.href}')`
                });
            }
        });
    });
})