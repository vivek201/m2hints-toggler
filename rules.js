function reloadRules(configs) {

    let rules = [];
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        rules.push(new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: config.url }
        }));
    }

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: rules,
                actions: [
                    new chrome.declarativeContent.ShowPageAction()
                ]
            }
        ]);
    });
}
