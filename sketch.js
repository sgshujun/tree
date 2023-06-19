
const serial = new p5.WebSerial();

let portButton;

function setup() {
  // createCanvas(800,800); // make the canvas
  
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
  
}

// function draw() {

// }


const container = document.querySelector('#container');
const videoBackground = document.querySelector('#video-background');
const videoLayers = document.querySelectorAll('.video-layer');
const videoCover = document.querySelector('#video-cover');
const info = document.querySelector('#info');

function findVideoLayer(key) {
  const num = parseInt(key);
	if (Number.isInteger(num)) {
		return videoLayers[num - 1];
	}
}

function playVideoLayer(videoLayer) {
  if (videoLayer && !videoLayer._playing) {
    videoLayer.playbackRate = 1;
    videoLayer.play();
    videoLayer._playing = true;
  }
}

function pauseVideoLayer(videoLayer) {
  if (videoLayer && videoLayer._playing) {
    videoLayer.pause();
    videoLayer.currentTime = 0;
    videoLayer._playing = false;
  }
}

document.addEventListener('keydown', (e) => {
  console.log(e);
  const videoLayer = findVideoLayer(e.key);
  if (videoLayer) {
    playVideoLayer(videoLayer);
  }
  switch (e.key) {
    case 'f':
      document.body.requestFullscreen();
      break;
    // case 'p':
    //   video.play();
    //   break;
    // case 's':
    //   video.pause();
    //   break;
    // case ']':
    //   video.playbackRate += 0.1;
    //   info.textContent = video.playbackRate;
    //   break;
    // case '[':
    //   video.playbackRate -= 0.1;
    //   info.textContent = video.playbackRate;
    //   break;
    // case '.':
    //   video.currentTime = (video.currentTime + 1) % video.duration;
    //   break;
    default:
      break;
  }
});

document.addEventListener('keyup', (e) => {
  const videoLayer = findVideoLayer(e.key);
  pauseVideoLayer(videoLayer);
});


// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
    serial.write("x");
   
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  
  if (inString){ 
     
    
    let sensors = split(inString , "," );
    const values = sensors.map(Number);

    // console.log(values);
    

    // locH = map(int(sensors[0]), 0,1023, 0, width);
    // locV = map(int(sensors[1]), 0, 1023,0, height);
    serial.write("x");

    for (let i = 0; i < values.length; i++) {
      if (values[i] < 150) {
        playVideoLayer(videoLayers[i]);
      } else {
        pauseVideoLayer(videoLayers[i]);
      }
    } 
    
  }
}



// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

