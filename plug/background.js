//Show / Hide extention button
chrome.runtime.onInstalled.addListener(function installSetup() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: "www.empornium.me"},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  });
});


const getDataFromStorage = (keys) => new Promise((resolve) => {
  chrome.storage.sync.get(keys, (data) => {
    resolve(data);
  });
});




chrome.downloads.onChanged.addListener(async function(downloadInfo) {
  if(!downloadInfo.filename) {
    return;
  }

  const filePath = downloadInfo.filename.current
  const { serverUrl, id } = await getDataFromStorage(['serverUrl', 'id']);

  fetch(`${serverUrl}/save-path`, {
    method: "POST",
    body: JSON.stringify({id2: id, filePath}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

