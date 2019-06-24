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


const getServerUrl = () => new Promise((resolve) => {
  chrome.storage.sync.get("serverUrl", ({ serverUrl }) => {
    resolve(serverUrl);
  });
});


chrome.downloads.onChanged.addListener(async function(downloadInfo) {

  if(!downloadInfo.filename) {
    return;
  }

  const filePath = downloadInfo.filename.current
  const serverUrl = await getServerUrl();
  
  fetch(`${serverUrl}/save-path`, {
    method: "POST",
    body: JSON.stringify({filePath})
  });
});
