// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const fileSaver = require("file-saver");
const fs = require("fs");

window.addEventListener("DOMContentLoaded", () => {
  let LoadOrNewWasClicked = false;
  let saveWasClicked = false;
  const editorInput = document.querySelector("#editor-input");
  const currentFileName = document.getElementById("file-name");
  const createFileButton = document.getElementById("new-button");
  const saveButton = document.getElementById("save-button");
  const loadButton = document.getElementById("load-button");
  const clearButton = document.querySelector("#clear-button");
  const notificationButton = document.createElement("button");
  const fileSizeP = document.getElementById("file-size");
  const fileTypeP = document.getElementById("file-type");

  const setFileInfo = (fileName) => {
    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;
    const fileType = fileName.split(".").pop();
    fileSizeP.innerHTML = `Size (in Bytes): ${fileSizeInBytes}`;
    fileTypeP.innerHTML = `Type:            ${fileType}`;
  };

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

  showInfoAlert(
    "Please make sure to load a file in a directory, where HyperCode has access to."
  );

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
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
  };

  saveButton.addEventListener("click", () => {
    if (!saveWasClicked) {
      saveWasClicked = true;
      const data = editorInput.value;
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      fileSaver.saveAs(blob, currentFileName.value);
      setFileInfo(currentFileName.value);
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
          setFileInfo(currentFileName);
          showSuccessAlert("Saved file successfully!");
        });
      });
    }
  });

  loadButton.addEventListener("click", async () => {
    if (!LoadOrNewWasClicked) {
      LoadOrNewWasClicked = true;
      const file = await chooseFile();
      const fileName = file[0].path;
      const content = await file[0].getFile();
      const text = await content.text();
      editorInput.value = text;
      currentFileName.value = fileName;
      setFileInfo(fileName);
      showSuccessAlert(`Successfully loaded ${fileName}!`);
    } else {
      showErrorAlert(
        "You have unsaved changes. Please save or discard them first."
      );
    }
  });

  const themeElements = document.querySelectorAll(".theme");
  themeElements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      clearTheme();
      document.body.classList.add(element.innerText.toLowerCase());
    });
  });

  const fontElements = document.querySelectorAll(".font");
  fontElements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("ubuntu");
      document.body.classList.remove("roboto");
      document.body.classList.remove("cascadia-code");
      const fontName = element.innerText.toLowerCase().replace(/\s/g, "-");
      document.body.classList.add(fontName);
    });
  });

  createFileButton.addEventListener("click", () => {
    createNewFile();
  });

  clearButton.addEventListener("click", () => {
    currentFileName.value = "";
    editorInput.value = "";
    fileSizeP.innerHTML = "Size (in Bytes): Unkown";
    fileTypeP.innerHTML = "Type: Unkown";
    saveWasClicked = false;
    LoadOrNewWasClicked = false;
  });
});
