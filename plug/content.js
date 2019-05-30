document.addEventListener("click", function(evt) {
  console.log("click");
  //Check if disc icon was clicked
  const classes = evt.target.getAttribute('class');
  if(!classes || !classes.includes('icon icon_disk')) {
    return;
  }

  const containerNode = getContainerNode(evt.target);
  const title = extractTitle(containerNode);

  const tags = extractTags(containerNode);

  fetch("http://localhost:3000/", {
    method: "POST",
    body: JSON.stringify({title, tags})
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
          acc += `${val.firstChild.innerText.replace(".", " ")}, `, "");
      }
    }
  return tags.substring(0, tags.length - 2);
}
