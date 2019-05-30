
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


chrome.downloads.onChanged.addListener(function(downloadInfo) {

  if(!downloadInfo.filename) {
    return;
  }

  const filePath = downloadInfo.filename.current
  
  fetch("http://localhost:3000/", {
    method: "POST",
    body: JSON.stringify({filePath})
  });
});
