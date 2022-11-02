// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const fileSaver = require("file-saver");

const chooseFile = async () => {
  return await window.showOpenFilePicker({ multiple: false });
};

const showSuccessAlert = (message) => {
  const notificationButton = document.createElement("button");
  notificationButton.style.display = "none";
  notificationButton.setAttribute("onclick", message);
  document.body.appendChild(notificationButton);
  notificationButton.click();
  document.body.removeChild(notificationButton);
};

window.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-button");
  const loadButton = document.getElementById("load-button");
  const fileNameTag = document.getElementById("file-name");

  saveButton.addEventListener("click", () => {
    const data = document.getElementById("editor-input").value;
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    fileSaver.saveAs(blob, "data.txt");
  });

  loadButton.addEventListener("click", async () => {
    const file = await chooseFile();
    const fileName = file[0].name;
    const content = await file[0].getFile();
    const text = await content.text();
    document.getElementById("editor-input").value = text;
    fileNameTag.innerText = fileName;
    // Create an invisible button, when it is clicked, it will trigger the notifciation
    showSuccessAlert(
      `notifier.success('Successfully loaded ${fileName}!', {title: 'Loaded successfully.'});`
    );
  });
});
