var form = document.querySelector('.form');
var i;

chrome.storage.sync.get('configs', function(data) {
    let configs = data.configs;
    
    let div = document.createElement('div');
    for (i = 0; i < configs.length; i++) {
        const config = configs[i];
        div.appendChild(getFieldSet(i, config));
    }

    let saveBtn = document.createElement('button');
    saveBtn.classList.add('primary');
    saveBtn.classList.add('save');
    saveBtn.innerText = 'Save';
    saveBtn.addEventListener('click', saveRules);

    form.appendChild(div);
    form.parentElement.appendChild(saveBtn);
});

var addBtn = document.querySelector('button.plus-icon');
addBtn.addEventListener('click', function () {
    form.firstElementChild.appendChild(getFieldSet(i));
    i++;
})

function getFieldSet(i, config) {
    let str = `
        <legend>Rule</legend>
        <div class="row responsive-label">
            <div class="col-sm-12 col-md-3">
                <label for="url{i}">URL</label>
            </div>
            <div class="col-sm-12 col-md">
                <input type="text" id="url{i}" class="url" placeholder="Enter the URL here">
            </div>
        </div>
        <div class="row responsive-label">
            <div class="col-sm-12 col-md-3">
                <label for="code{i}">Code</label>
            </div>
            <div class="col-sm-12 col-md">
                <input type="text" id="code{i}" class="code" placeholder="Enter the template code here">
            </div>
        </div>
        <div class="row responsive-label">
            <button class="secondary remove">x Remove rule</button>
        </div>
        `;
    str = str.replace(/\{i\}/g, i);
    let fieldset = document.createElement('fieldset');
    fieldset.innerHTML = str.trim();
    if (config) {
        fieldset.querySelector(`#url${i}`).value = config.url;
        fieldset.querySelector(`#code${i}`).value = config.code;
    }
    fieldset.querySelector('button.remove').addEventListener('click', function() { removeRule(i); });
    return fieldset;
}

function removeRule(i) {
    let url = document.getElementById(`url${i}`);
    url.parentElement.parentElement.parentElement.remove();
}

function saveRules() {
    let urls = document.querySelectorAll('.url');
    let codes = document.querySelectorAll('.code');

    let configs = [];

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const code = codes[i];
        if (url && code) {
            let urlVal = url.value.trim();
            let codeVal = code.value.trim();
            if (urlVal && codeVal) {
                configs.push({
                    url: urlVal,
                    code: codeVal
                });
            }
        }
    }    

    chrome.storage.sync.set({configs: configs}, function () {
        reloadRules(configs);
        let toast = document.querySelector('.toast.hide');
        if (toast) {
            toast.innerText = 'Settings saved';
            toast.classList.remove('hide');
            setTimeout(() => {
                toast.classList.add('hide');
            }, 4000);
        }
    });
}