how to install all stuff:

cd to: server/add-dynamic-files
npm install

back to: server/startup
npm install

how to activate:
1. run the configuration 'Dynamic Index Creator' (or grunt start at the /server/ folder) // will create the index.html from index_template.html the first time and will initiate a watcher for recreation of index.html every time file is changed
2. run the configuration 'Run Node' (or 'node StartServer.js') // this will create the app server that serves the index.html created before
