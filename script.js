const video = document.querySelector("video");
const textElement = document.querySelector("[data-text]");

async function setup() {
  //get video stream from the webcam
  // user has to accept permission for website to use webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  //Set up event listener for when video starts playing so that
  // we can start using OCR image recognition from tessaract library
  video.addEventListener("playing", async () => {
    //set uo a worker (how you interact with tessaract and start doing
    //Image recognition)
    const worker = await Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    //make worker recognize the image - get image from video
    // using canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;
    //get image from video
    document.addEventListener("keypress", async (e) => {
      if (e.code !== "Space") return;
      canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height);
      const {
        data: { text },
      } = await worker.recognize(canvas);
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
      );
      textElement.textContent = text;
    });
  });
}

setup();
