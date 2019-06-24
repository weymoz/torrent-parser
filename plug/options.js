const DEFAULT_SERVER_URL = "http://localhost:3000";
const save = document.getElementById("save");
const status = document.getElementById("status");

save.addEventListener("click", () => {
  
  let serverUrl = document.getElementById("server-url").value;
  
  if(serverUrl === "") {
    serverUrl = DEFAULT_SERVER_URL;
  }

  document.getElementById("server-url").value = serverUrl;

  chrome.storage.sync.set({serverUrl}, () => {
    status.textContent = "URL saved";
    setTimeout(() => status.textContent = "", 1000);
  });

});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({serverUrl: DEFAULT_SERVER_URL}, 
    ({ serverUrl }) => {
      document.getElementById("server-url").value = serverUrl;
    });
  }
);
