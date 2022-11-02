# HyperCode

HyperCode is a Text editor written in JavaScript using the Electron.js framework,
meaning it's an app you can run natively on your Operating System without having to worry
too much about the backend.

# How to run

There are two ways to run HyperCode.

## Downloading Binaries (zip)

Download the zip file according to your OS and run the binary.
Windows => <a href="https://github.com/FujiwaraChoki/hyper-code/releases/download/Windows/HyperCode-win32-x64.zip">Download</a>
<br />
Linux => <a href="https://github.com/FujiwaraChoki/hyper-code/releases/download/Linux/HyperCode-linux-x64.zip">Download</a>

1. Clone the repo

```
git clone https://github.com/FujiwaraChoki/hyper-code.git
```

2. Install Dependencies

```
npm install
```

3. Start the application and enjoy it!

```
npm start
```

# Package the app

Use the following command in the `hyper-code` directory:

```
electron-packager . HyperCode --platform=win32 --arch=x64
```
