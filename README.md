# HyperCode

HyperCode is a Text editor written in JavaScript using the Electron.js framework,
meaning it's an app you can run natively on your Operating System without having to worry
too much about the backend.

# How to run

There are two ways to run HyperCode.

## Downloading Binaries (zip)

Download the zip file according to your OS and run the binary.<br />
Windows => <a href="https://github.com/FujiwaraChoki/hyper-code/releases/download/v2.0.0.0/HyperCode-win32-x64.zip">Download</a>
<br />
Linux => <a href="https://github.com/FujiwaraChoki/hyper-code/releases/download/v2.0.0.0-linux/HyperCode-linux-x64.zip">Download</a>

<br />
Alternitavely,

## Manually install and run

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

1. Clone the app:

```
git clone https://github.com/FujiwaraChoki/hyper-code.git
```

2. Install Dependencies

```
npm install
```

3. Use the following command in the `hyper-code` directory:

```
electron-packager . HyperCode --platform=<PLATFORM> --arch=<ARCHITECTURE> --out=dist
```
