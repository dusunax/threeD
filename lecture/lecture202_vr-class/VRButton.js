/**
 * # 소스 코드 from
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author NikLever / http://niklever.com
 */

class VRButton {
  constructor(renderer) {
    this.renderer = renderer;

    if ("xr" in navigator) {
      // 버튼 스타일
      const button = document.createElement("button");
      button.style.height = "100px";
      button.style.width = "100px";

      button.style.position = "fixed";

      button.style.cursor = "pointer";
      button.style.transition = "opacity 0.3s ease-in-out";

      document.body.appendChild(button);

      // is XR supported?
      // navigator의 xr에 isSessionSupported('');
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        supported ? this.showEnterVR(button) : this.showWebXRNotFound(button);
      });
    } else {
      const msg = document.createElement("a");
      msg.style.position = "absolute";
      msg.style.left = "0px";
      msg.style.top = "0px";
      msg.style.color = "#FFFFFF";

      if (window.isSecureContext === false) {
        msg.href = document.location.href.replace(/^http:/, "https:");
        msg.innerHTML = "WebVR is not available. need to be secure.";
      } else {
        msg.innerHTML = "WebVR is not available.";
      }
      document.body.appendChild(msg);
    }
  }

  disableButton(button) {
    button.style.cursor = "";

    button.onmouseenter = null;
    button.onmouseleave = null;

    button.onclick = null;
  }

  showEnterVR(button) {
    let currentSessions = null;
    this.stylizeElement(button, true, 30);

    button.style.right = "50%";
    button.style.bottom = "50%";
    button.style.transform = "translate(50%, 50%)";

    const btnIcon = "<i class='fas fa-vr-cardboard' /> ";
    const msgVRStart = "VR<div />Start!";
    const msgVREnd = "VR<div />End.";

    button.innerHTML = btnIcon;

    button.onmouseenter = () => {
      button.style.fontSize = "24px";
      button.innerHTML = currentSessions ? msgVREnd : msgVRStart;
      button.style.opacity = "0.9";
    };
    button.onmouseleave = () => {
      button.style.fontSize = "30px";
      button.innerHTML = btnIcon;
      button.style.opacity = "0.5";
    };

    const self = this;

    // 각 onSession 이벤트 핸들
    function onSessionStarted(session) {
      session.addEventListener("end", onSessionEnded);

      self.renderer.xr.setSession(session);
      self.stylizeElement(button, false);

      button.style.right = "10%";
      button.style.bottom = "10%";
      button.style.fontSize = "30px";
      button.innerHTML = btnIcon;

      currentSessions = session;
    }

    function onSessionEnded(session) {
      currentSessions.removeEventListener("end", onSessionEnded);

      self.stylizeElement(button, true);

      button.style.right = "50%";
      button.style.bottom = "50%";
      button.style.fontSize = "30px";
      button.innerHTML = btnIcon;

      currentSessions = null;
    }

    // onClick Event
    button.onclick = () => {
      if (currentSessions === null) {
        const sessionInit = {
          optionalFeatures: ["local-floor", "bounded-floor"],
        };
        navigator.xr
          .requestSession("immersive-vr", sessionInit)
          .then(onSessionStarted);
      } else {
        currentSessions.end();
      }
    };
  }

  showWebXRNotFound(button) {
    this.stylizeElement(button, false, 20);
    this.disableButton(button);

    button.style.display = "";
    button.innerHTML =
      "no VR!\n<i class='fas fa-vr-cardboard' style='font-size: 30px;' /> ";

    const msg = document.createElement("a");
    msg.style.position = "absolute";
    msg.style.width = "100%";
    msg.style.padding = "5px 0";
    msg.style.color = "#aaa";
    msg.style.background = "rgba(0,0,0,0.4)";
    msg.style.textAlign = "center";
    msg.style.fontSize = "13px";

    msg.innerHTML = "VR를 제공하지 않는 환경입니다.";
    document.body.prepend(msg);
  }

  stylizeElement(element, green = true, fontSize = 13, ignorePadding = false) {
    element.style.position = "absolute";
    element.style.bottom = "20px";
    if (!ignorePadding) element.style.padding = "12px 6px";
    element.style.border = "none";
    element.style.borderRadius = "6px";
    element.style.background = green
      ? "rgba(20,150,80,1)"
      : "rgba(180,20,20,1)";
    element.style.color = "#fff";
    element.style.textAlign = "center";
    element.style.opacity = "0.5";
    element.style.outline = "none";
    element.style.zIndex = "99999";
    element.style.font = `normal ${fontSize}px sans-serif`;
    element.style.fontWeight = "700";
  }
}

export { VRButton };
