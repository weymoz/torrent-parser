document.addEventListener("click", async function(evt) {

  //Check if disc icon was clicked
  const classes = evt.target.getAttribute('class');

  if(!classes || !classes.includes('torrent_icons')) {
    return;
  }

  const containerNode = getContainerNode(evt.target);
  const title = extractTitle(containerNode);
  const tags = extractTags(containerNode);
  const size = getTorrentSize(containerNode);
  const url = getTorrentUrl(containerNode);
  sendMessage({title, tags, size, url});
});


function sendMessage(message) {
  chrome.runtime.sendMessage(message, function(response) {
  });
}


function getId() {
  return Math.floor(Date.now() * Math.random());
}


function saveId(id) {
  return new Promise(function(resolve) {
    chrome.storage.sync.set({id}, function() {
      resolve(id); 
    });
  });
}


function getServerUrl() {
  return new Promise(function(resolve) {
    chrome.storage.sync.get('serverUrl', function({ serverUrl }) {
      resolve(serverUrl);
    });
  });
}


function getContainerNode(clickedNode) {
  let containerNode = clickedNode.parentNode;

  while(containerNode.nodeName !== "TD") {
    containerNode = containerNode.parentNode;
  }
  return containerNode;
}


function extractTitle(containerNode) {
  for (let element of containerNode.children) {
    if (element.nodeName === "A") {
      return element.innerText;
    }
  }
}


function extractTags(containerNode) {
  let tags;
  for(let element of containerNode.children) {

    if(element.nodeName === 'DIV' && element.getAttribute('class').includes('tags')) {

      tags = [...element.children]
        .reduce((acc, val) => 
          acc += `${val.innerText.replace(".", " ")}, `, "");
    }
  }
  return tags.substring(0, tags.length - 2);
}


function getTorrentSize(containerNode) {
  return containerNode
    .nextElementSibling
    .nextElementSibling
    .nextElementSibling
    .nextElementSibling
    .innerText;
}


function getTorrentUrl(containerNode) {
  for(element of containerNode.children) {
    if(element.nodeName === 'A') {
      return 'https://empornium.me' + element.getAttribute('href');
    }
  }
}
