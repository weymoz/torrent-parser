//Message stack
let messages = [];
let filesCounter = 0;

const getDataFromStorage = (keys) => new Promise((resolve) => {
  chrome.storage.sync.get(keys, (data) => {
    resolve(data);
  });
});


const saveDataToStorage = (data) => new Promise((resolve) => {
  chrome.storage.sync.set({data}, () => {
    resolve();
  });
});


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    messages.push(message);
});



chrome.downloads.onChanged.addListener(async function(downloadInfo) {
  if(!downloadInfo.filename) {
    return;
  }

  let torrent = { ...messages[filesCounter] };
  filesCounter++;

  torrent.filePath = downloadInfo.filename.current;
  let data = (await getDataFromStorage('data')).data;
  data = !data ? [torrent] : [...data, torrent];
  await saveDataToStorage(data);

  
    /*
  const filePath = downloadInfo.filename.current
  const { serverUrl, id } = await getDataFromStorage(['serverUrl', 'id']);

  fetch(`${serverUrl}/save-path`, {
    method: "POST",
    body: JSON.stringify({id2: id, filePath}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  */
});

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

