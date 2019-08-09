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


const deleteDataFromStorage = (data) => new Promise((resolve) => {
  chrome.storage.sync.remove(data, () => {
    resolve();
  });
});


const updateView = async () => {
  let view = document.getElementById('torrents__list');
  let torrents = await getDataFromStorage('data');
  console.log(torrents);
  if(!torrents || !torrents.data || 
     !Array.isArray(torrents.data) || torrents.data.length === 0)  {
        view.innerHTML = "<h3>No torrents added yet ...</h3>";
        return;
  }


  function listItemTag(strings, number, title, size, url, index) {
    return `
    ${strings[0]} 
    ${number}
    ${strings[1]}
    ${title}
    ${strings[2]}
    ${size}
    ${strings[3]}
    ${url}
    ${strings[4]}
    ${index}
    ${strings[5]}
    `;
  }

  let innerHtml = '';
  let index = 0;

  for(const torrent of torrents.data) {

    let listItem = listItemTag`
        <div class="torrents__list-item"> 
          <div class="torrents__number">${index + 1}</div>
          <div class="torrents__info"> 
            <div class="torrents__title">${torrent.title}</div>
            <div class="torrents__size-url">
               ${torrent.size}
               <a target="_blank" class="torrents__link" href="${torrent.url}">
                <svg width="100%" height="100%">
                  <use xlink:href="img/icons.svg#link"></use>
                </svg></a></div>
          </div>
          <div data-index="${index}" class="torrents__delete-item"> 
            <svg class="torrents__delete-item">
              <use xlink:href="img/icons.svg#close"></use>
            </svg>
          </div>
        </div>`;

    innerHtml += listItem;
    index++;
  }

  view.innerHTML = innerHtml;
}



window.onload = async function() {
  updateView();

  const reset = document.getElementById('reset');

  reset.addEventListener('click', async function() {
    await deleteDataFromStorage('data');
    updateView();
  });
  

  const observer = new MutationObserver(function(mutationList, observer) {
    let listItems = [...mutationList[0].addedNodes]
      .filter(item => item.nodeType !== 3);

    let deleteButtons = listItems.map(item => item.children[2]);

    deleteButtons.forEach(button => button.addEventListener('click', async function(evt) {
      let index = parseInt(this.dataset.index);
      let torrents = await getDataFromStorage('data');
      const newTorrents = [...(torrents.data.slice(0, index)), ...torrents.data.slice(index + 1)];
      await saveDataToStorage(newTorrents);
      updateView();
    }));
  });

  let parent = document.getElementById('torrents__list');
  observer.observe(parent, {childList: true});
}
