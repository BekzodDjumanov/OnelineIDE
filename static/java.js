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
    mode: "text/x-java",
    theme: "duotone-dark",
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    indentGuide: true,
    autofocus: true,
});

function runCode() {
  const runBtn = document.querySelector('.run');
  runBtn.disabled = true;
  runBtn.style.opacity = 0.6;

  const code = editor.getValue();

  fetch('/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code, language: 'java' })
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector(".output-code").textContent = data.output || "\n\n=== Code Execution Successful ===";
  })
  .catch(err => {
    document.querySelector(".output-code").textContent = `Error: ${err.message}`;
  })
  .finally(() => {
    runBtn.disabled = false;
    runBtn.style.opacity = 1;
  });
}



function clearOutput() {
    const outputEl = document.querySelector(".output-code");
    outputEl.innerHTML = "";
  }
  let initialCode = ``;
  
  function promptDelete() {
    if (typeof editor !== 'undefined' && editor !== null && editor.getValue().trim() !== ""){
        document.querySelector(".overlay").style.display = "block";
        document.querySelector(".disclaimer").style.display = "block";
        document.querySelector(".reject").style.display = "block";
  
        gsap.fromTo(".overlay",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" }
        );
  
        gsap.fromTo(".disclaimer",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", delay: 0.1 }
        );
  
        gsap.fromTo(".reject",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", delay: 0.1 }
        );
      }
  }
  
  function reject(){
    gsap.to(".disclaimer", {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        document.querySelector(".disclaimer").style.display = "none";
      }
    });
  
    gsap.to(".reject", {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        document.querySelector(".disclaimer").style.display = "none";
      }
    });
  
    gsap.to(".overlay", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        document.querySelector(".overlay").style.display = "none";
      }
    });
  }
  
  
  function refreshEditor() {
    if (typeof editor !== 'undefined' && editor !== null) {
      editor.setValue(initialCode);
      editor.refresh();
  
      gsap.to(".disclaimer", {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          document.querySelector(".disclaimer").style.display = "none";
        }
      });
  
      gsap.to(".reject", {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          document.querySelector(".disclaimer").style.display = "none";
        }
      });
  
      gsap.to(".overlay", {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          document.querySelector(".overlay").style.display = "none";
        }
      });
      
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
