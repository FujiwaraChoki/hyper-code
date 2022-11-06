// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const fileSaver = require("file-saver");
const fs = require("fs");

window.addEventListener("DOMContentLoaded", () => {
  let LoadOrNewWasClicked = false;
  let saveWasClicked = false;
  let infoAlertWasShown = false;
  const editorInput = document.querySelector("#editor-input");
  const currentFileName = document.getElementById("file-name");
  const createFileButton = document.getElementById("new-button");
  const saveButton = document.getElementById("save-button");
  const loadButton = document.getElementById("load-button");
  const clearButton = document.querySelector("#clear-button");
  const notificationButton = document.createElement("button");
  const saveSettingsButton = document.getElementById("save-settings-button");
  const themeSelectElement = document.querySelector(".theme");
  const fontSizeElement = document.querySelector("#font-size");
  const fontFamilyElement = document.querySelector(".font-family");

  const chooseFile = async () => {
    return await window.showOpenFilePicker({ multiple: false });
  };

  const showSuccessAlert = (message) => {
    notificationButton.style.display = "none";
    message = `notifier.success('${message}');`;
    notificationButton.setAttribute("onclick", message);
    document.body.appendChild(notificationButton);
    notificationButton.click();
    document.body.removeChild(notificationButton);
  };

  const showErrorAlert = (message) => {
    notificationButton.style.display = "none";
    message = `notifier.alert('${message}');`;
    notificationButton.setAttribute("onclick", message);
    document.body.appendChild(notificationButton);
    notificationButton.click();
    document.body.removeChild(notificationButton);
  };

  const showInfoAlert = (message) => {
    notificationButton.style.display = "none";
    message = `notifier.info('${message}');`;
    notificationButton.setAttribute("onclick", message);
    document.body.appendChild(notificationButton);
    notificationButton.click();
    document.body.removeChild(notificationButton);
  };

  const createNewFile = () => {
    if (!LoadOrNewWasClicked && editorInput.value === "") {
      LoadOrNewWasClicked = true;
      clearButton.click();
      currentFileName.value = "Untitled";
    } else {
      showErrorAlert(
        "You have unsaved changes. Please save or discard them first."
      );
    }
  };

  const clearTheme = () => {
    document.body.classList.remove("colored");
    document.body.classList.remove("dark");
  };

  const clearFont = () => {
    document.body.classList.remove("ubuntu");
    document.body.classList.remove("roboto");
    document.body.classList.remove("cascadia-code");
  };

  const clearFontSize = () => {
    document.body.style.fontSize = "1.3rem";
  };

  saveButton.addEventListener("click", () => {
    if (!saveWasClicked) {
      saveWasClicked = true;
      const data = editorInput.value;
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      fileSaver.saveAs(blob, currentFileName.value);
    } else {
      fs.readFile(currentFileName.value, "utf-8", (err, fsData) => {
        const data = editorInput.value;
        if (err) {
          showErrorAlert("An error ocurred reading the file :" + err.message);
          return;
        }
        fsData = data;
        fs.writeFile(currentFileName, fsData, (err) => {
          if (err) {
            showErrorAlert("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
          }
          showSuccessAlert("Saved file successfully!");
        });
      });
    }
  });

  loadButton.addEventListener("click", async () => {
    if (!LoadOrNewWasClicked) {
      LoadOrNewWasClicked = true;
      const file = await chooseFile();
      const fileName = file[0].name;
      const content = await file[0].getFile();
      const text = await content.text();
      editorInput.value = text;
      currentFileName.value = fileName;
      showSuccessAlert(`Successfully loaded ${fileName}!`);
    } else {
      showErrorAlert(
        "You have unsaved changes. Please save or discard them first."
      );
    }
  });

  saveSettingsButton.addEventListener("click", (event) => {
    event.preventDefault();
    clearTheme();
    clearFont();
    clearFontSize();
    const theme = themeSelectElement.value;
    const font = fontFamilyElement.value;
    const fontSize = fontSizeElement.value;
    document.body.classList.add(theme);
    document.body.classList.add(font);
    if (parseFloat(fontSize) > 30) {
      showErrorAlert("Please choose a font size smaller than 1.3rem");
    }
    document.body.style.fontSize = fontSize + "px";
    showSuccessAlert("Successfully saved settings!");
  });

  createFileButton.addEventListener("click", () => {
    createNewFile();
  });

  clearButton.addEventListener("click", () => {
    currentFileName.value = "";
    editorInput.value = "";
    saveWasClicked = false;
    LoadOrNewWasClicked = false;
  });

  window.onload = () => {
    if (infoAlertWasShown === false) {
      infoAlertWasShown = true;
      showInfoAlert(
        "Please make sure to load a file in a directory, where HyperCode has access to."
      );
    } else {
      return;
    }
  };
});
