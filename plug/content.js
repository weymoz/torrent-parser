document.addEventListener("click", function(evt) {

  //Check if disc icon was clicked
  const classes = evt.target.getAttribute('class');

  if(!classes || !classes.includes('torrent_icons')) {
    return;
  }

  const containerNode = getContainerNode(evt.target);


  const title = extractTitle(containerNode);

  const tags = extractTags(containerNode);



  chrome.storage.sync.get('serverUrl', ({ serverUrl }) => {
    fetch(`${serverUrl}/save-title-tags`, {
      method: "POST",
      body: JSON.stringify({title, tags})
    });
  });
});


/**
 * Get container TD node from the clicked save torrent icon
 */
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
      console.log(element.innerText);
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
  console.log(tags);
  return tags.substring(0, tags.length - 2);
}
