# Set up for firebase
1. `cd app`
2. `firebase experiments:enable webframeworks`
3. `firebase emulators:start`
4. open `hosting[chro-plus]: Local server:http://127.0.0.1:5002`

* if console say`⚠  ui: Port 50000 is not open on 0.0.0.0, could not start Emulator UI.`
run code below
```
lsof -i:5000
kill <PID>
```

# SetUp for node js(first time)
1. install Node.js
   1. `nvm install 20`
   2. `nvm use 20` 
2. open localhost
   1. `npm run dev`
   2. access `http://localhost:3000/`

# more than second time
1. select version of Node.js
   1. `nvm use 20`
2. open localhost
   1. `npm run dev`
   2. access `http://localhost:3000/`
