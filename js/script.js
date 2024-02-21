"use strict";

// Text input variable
const textInput = document.getElementById('text-input'),
  textCounter = document.getElementById('text-counter'),
  imgInput = document.getElementById('img-input'),
  imgPreview = document.getElementById('img-preview'),
  sendBtn = document.getElementById('send-btn');
let maxText = 300,
  maxSize = 5242880;

let imgIsLoading = false,
  imgData = null;
  

// function to check the letter of text
const handleTextCounter = (textEl, max=100) => {
  let textLet = textEl.value.split("").length;
  textEl.setAttribute("maxlength", max);
  return textLet + "/" + max;
}

// handle event when the text value is inputing
textInput.addEventListener("input", () => {
  textCounter.innerText = handleTextCounter(textInput, maxText);
});


const imgBox = {
  delete: () => {
    if (imgData == null) return;
    imgPreview.innerHTML = `
    <div class="img-loading w-full h-full grid place-items-center">
      <span class="text-[1rem] font-open-sans text-text-dark">Loading..</span>
    </div>
    `;
    imgPreview.style.display = "none";
  }
}

// Delete image function
const deleteImg = () => {
  imgData = null;
  imgBox.delete();
}


// Get image on img-input changed
const addImg = (img) => {
  imgIsLoading = true;
  imgPreview.style.display = "block";
  const fileReader = new FileReader();
  fileReader.readAsDataURL(img);
  fileReader.addEventListener("load", async (e) => {
    imgData = fileReader.result;
    
    imgIsLoading = false;
    
    imgPreview.innerHTML = `
    <div class="img-box flex flex-col relative">
      <button onclick="imgBox.delete()" class="z-[2] aspect-square block absolute top-0 right-0 w-[25px] rounded-[50%] aspect-square bg-text-light translate-x-[25%] translate-y-[-25%]" id="delete-img" type="button">
        <i class="text-text-dark fas fa-xmark"></i>
      </button>
      <img onclick="previewFunc(this)" class="rounded-t-2xl aspect-square object-cover" id="img-element" src="${imgData}"/>
        <div class="img-title py-2 px-3">
          <span id="img-title" class="text-text-dark font-open-sans text-[1rem]">${img.name}</span>
        </div>
      </div>
    `;
    
  });
  
}

// Define the msg box element
const msgBox = document.querySelector(".msg-box");
// Send message function
const sendMsg = async () => {
  if (textInput.value == null || textInput.value.length < 1) return;
  if (imgInput.files[0] == undefined) imgData = "";
  
  let url = "https://ngl.glitch.me/"; // + textInput.value.replace(/\n/g, "\n");
  
  const formData = new FormData();
  formData.append("myFile", imgInput.files[0]);
  formData.append("myMsg", textInput.value);
  
  imgPreview.style.display = "none";
  textInput.value = "";
  msgBox.innerHTML = `
  <div class="msg-header bg-text-dark py-3 px-4 flex-items-center justify-center gap-2">
    <span class="text-[1.3rem] font-open-sans">Memproses...</span>
  </div>
  `;
  
  
  console.log(formData.get("myFile"), formData.get("myMsg"));
  
  await fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      
      console.log(data);
      textInput.value = "";
      
      imgPreview.style.display = "none";
      imgData = null;
      
      msgBox.innerHTML = `
      <div class="msg-header bg-text-dark py-3 px-4 flex-items-center justify-center gap-2">
        <span class="text-[1.3rem] animate-bounce font-open-sans">Terkirim!</span>
      </div>
      `;
      console.log(data.message);
    })
    .catch(error => {
      alert('Error sending data to server: ' + error);
      textInput.value = "";
      imgPreview.style.display = "none";
      imgData = null;
      msgBox.innerHTML = `
      <div class="msg-header bg-text-dark py-3 px-4 flex-items-center justify-center gap-2">
        <span class="text-[1.3rem] font-open-sans">Gagal!</span>
      </div>
      `;
    });
}

window.addEventListener("DOMContentLoaded", () => {
  // clear the text input value
  textInput.value = "";
  textCounter.innerText = textInput.value.length + "/" + maxText;
  
  // send msg when the sendBtn onclick
  // send msg when the sendBtn onclick
  sendBtn.onclick = sendMsg;
  
  // add img when the imgInput on change
  imgInput.addEventListener("change", () => {
    
    let file = imgInput.files.item(0);
    if (file == null) {
      console.log("file empty!");
      return;
    }
    
    
    if (file.type !== "image/jpeg" && file.type !== "image/png"){
      alert("file type does'nt exist!");
      return;
    }
      
    if (file.size >= maxSize) {
      alert("the file size of image must less than 10MB!");
      return;
    }

    addImg(file);
  });
  
});

// convert bytes to human readable format function
function formatBytes(size, decimals = 2) {
  if (size === 0) return '0 bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const previewBox = document.getElementById("preview-overlay");

let pImgRect,
  elRect,
  beforeRect = {};

let animTime = 300;
function previewFunc(el) {
  previewBox.style.display = "block";
  
  let pImg = document.getElementById("preview-img");
  pImg.src = el.src;
  pImgRect = pImg.getBoundingClientRect();
  elRect = el.getBoundingClientRect();
  
  beforeRect = {
    x: elRect.x,
    y: elRect.y,
    w: elRect.width,
    h: elRect.height,
  };
  
  
  el.style.position = "fixed";
  el.style.zIndex = 10;
  document.getElementById("img-title").style.opacity = 0;
  
  anime({
    targets: el,
    top: [elRect.y, pImgRect.y],
    left: [elRect.x, pImgRect.x],
    width: [elRect.width, pImgRect.width],
    height: [elRect.height, pImgRect.height],
    duration: animTime,
    easing: "easeInOutQuad",
    complete: () => {
      el.style.display = "none";
      document.body.style.overflow = "hidden";
      previewBox.style.opacity = 1;
    }
  });
}

function closePreview(){
  
  document.body.style.overflow = "visible";
  previewBox.style.display = "none";
  document.getElementById("img-element").style.display = "block";
  
  anime({
    targets: document.getElementById("img-element"),
    top: [pImgRect.y, beforeRect.y],
    left: [pImgRect.x, beforeRect.x],
    width: [pImgRect.width, beforeRect.w],
    height: [pImgRect.height, beforeRect.h],
    duration: animTime,
    easing: "easeInOutQuad",
    complete: () => {
      document.getElementById("img-element").style.position = "static";
      document.getElementById("img-element").style.zIndex = 1;
      previewBox.style.opacity = 0;
      document.getElementById("img-title").style.opacity = 1;
    }
  });
  
}
