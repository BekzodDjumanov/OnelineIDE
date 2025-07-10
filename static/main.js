document.querySelectorAll('.submenu-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); 
    const theme = this.getAttribute('data-theme');

    if (theme) {
      editor.setOption("theme", theme); 
      console.log("Theme changed to:", theme);
    }
  });
});

const editor = CodeMirror.fromTextArea(document.getElementById("code-input"), {
    mode: "python",
    theme: "material-darker",
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    indentGuide: true,
    autofocus: true,
});



async function runCode() {
  const code = editor.getValue();
  const outputEl = document.querySelector(".output-code");


  try {
    const response = await fetch('/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: code })
    });

    if (!response.ok) {
      
      const errorText = await response.text();
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

   
    outputEl.textContent = result.output || "⚠️ No output.";
  } catch (err) {
   
    outputEl.innerHTML = `<span style="color: red;">❌ ${err.message}</span>`;
  }
}

function clearOutput() {
  const outputEl = document.querySelector(".output-code");
  outputEl.innerHTML = "";
}
let initialCode = ``;

function refreshEditor() {
  if (typeof editor !== 'undefined' && editor !== null) {
    editor.setValue(initialCode);
    editor.refresh();
  } else {
    console.warn("CodeMirror editor instance not found.");
  }
}



const menu = document.querySelector('.menu');
const outputIcon = document.querySelector('.output-icon');
const inputIcon = document.querySelector('.run');
const refreshIcon = document.querySelector('.refresh-btn');
const clearIcon = document.querySelector('.clear');

function fadeOut(element, duration = 500) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = 0;
}

function fadeIn(element, duration = 500) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = 1;
}

menu.addEventListener('mouseenter', () => {
  fadeOut(outputIcon, 300);
  fadeOut(inputIcon, 100);
  fadeOut(refreshIcon, 100);
  fadeOut(clearIcon, 300);
});

menu.addEventListener('mouseleave', () => {
  fadeIn(outputIcon, 300);
  fadeIn(inputIcon, 100);
  fadeIn(refreshIcon, 100);
  fadeIn(clearIcon, 300);
});

