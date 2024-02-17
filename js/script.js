alert("1");
// Text input variable
const textInput = document.getElementById('text-input'),
  textCounter = document.getElementById('text-counter'),
  sendBtn = document.getElementById('send-btn');
let maxText = 300;

// Alert function
const showAlert = (msg, time=2000) => {
  let html = document.body;
  html.innerHTML += `
  <div style="animation: show-alert ${time}ms ease-in-out alternate-reverse forwards;" class="alert z-[1000] mt-3 py-3 px-5 rounded-md bg-text-light border-2 border-text-dark fixed top-0 left-[50%] translate-x-[-50%]">
    <span class="text-text-dark text-[1rem] font-bold">${msg}</span>
  </div>
  `;
  /* setTimeout(function() {
    document.querySelectorAll(".alert").forEach((el) => el.remove());
  }, time); */
}

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

const sendMsg = async () => {
  if (textInput.value == null || textInput.value.length < 1) return;
  
  let msg = { msg: textInput.value},
    url = "https://ngl.glitch.me/?text="; //+textInput.value.replace(/\n/g, "\n");
  textInput.value = "";
  // window.location.href = url;
  // console.log(JSON.stringify(msg));
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg);
  })
    .then(response => response.json())
    .then(data => {
      showAlert(data.message);
      textInput.value = "";
    })
    .catch(error => {
      showAlert('Error sending data to server: ' + error);
      textInput.value = "";
    });
}

window.addEventListener("DOMContentLoaded", () => {
  // clear the text input value
  textInput.value = "";
  textCounter.innerText = textInput.value.length + "/" + maxText;
  
  sendBtn.onclick = sendMsg;
});
