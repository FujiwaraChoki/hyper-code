// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const fileSaver = require("file-saver");
const fs = require("fs");

let LoadOrNewWasClicked = false;
let saveWasClicked = false;

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

const createNewFile = () => {
  if (
    !LoadOrNewWasClicked &&
    document.querySelector("#editor-input").value === ""
  ) {
    saveOrLoadOrNewWasClicked = true;
    // Set file name to "Untitled"
    document.querySelector("#clear-button").click();
    document.querySelector("#file-name").value = "Untitled";
  } else {
    alert("You have unsaved changes. Please save or discard them first.");
  }
};

const clearTheme = () => {
  document.body.classList.remove("colored");
  document.body.classList.remove("light");
  document.body.classList.remove("dark");
};

window.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-button");
  const loadButton = document.getElementById("load-button");
  const fileNameTag = document.getElementById("file-name");

  saveButton.addEventListener("click", () => {
    if (!saveWasClicked) {
      saveWasClicked = true;
      const data = document.getElementById("editor-input").value;
      const currentFileName = fileNameTag.innerText;
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      fileSaver.saveAs(blob, currentFileName);
    } else {
      const currentFileName = fileNameTag.value;
      fs.readFile(currentFileName, "utf8", (err, fsData) => {
        const data = document.getElementById("editor-input").value;
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }
        fsData = data;
        fs.writeFile(currentFileName, fsData, (err) => {
          if (err) {
            alert("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
          }
          showSuccessAlert("Saved file successfully!");
        });
      });
    }
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

  const themeElements = document.querySelectorAll(".theme");
  themeElements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      clearTheme();
      document.body.classList.add(element.innerText.toLowerCase());
    });
  });

  const createFileButton = document.getElementById("new-button");
  createFileButton.addEventListener("click", () => {
    createNewFile();
  });

  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", () => {
    document.getElementById("file-name").value = "";
    document.getElementById("editor-input").value = "";
  });
});
