// ==UserScript==
// @name        BeatStage Volume Controller
// @namespace   https://hyrious.me/BeatStage-Volume-Controller
// @match       https://www.beatstage.com/play/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      hyrious
// @description BeatStage 的默认音量太吵啦
// @homepageURL https://github.com/hyrious/BeatStage-Volume-Controller
// @supportURL  https://github.com/hyrious/BeatStage-Volume-Controller/issues
// @downloadURL https://ghcdn.rawgit.org/hyrious/BeatStage-Volume-Controller/master/beatstage-volume-controller.user.js
// ==/UserScript==
(function () {
  function runBlockIf(condition, block) {
    if (condition()) block();
    else setTimeout(runBlockIf.bind(null, condition, block));
  }

  function isCreateJsExist() {
    return typeof unsafeWindow.createjs !== "undefined";
  }

  var V = {
    get() {
      return +GM_getValue("v", 0.5);
    },
    set(v) {
      GM_setValue("v", v);
      return this.get();
    },
  };

  runBlockIf(isCreateJsExist, function () {
    var sound = unsafeWindow.createjs.Sound;
    sound.volume = V.get();

    var uiholder = document.querySelector("#game-header > h2 > small");
    var uitext = document.createElement("span");
    var uiinput = document.createElement("input");
    uiinput.type = "range";
    uiinput.value = ~~(sound.volume * 100);
    uiinput.style.width = "200px";
    uiinput.style.display = "inline-block";
    uiinput.style.verticalAlign = "middle";
    function refresh() {
      V.set(+uiinput.value / 100);
      sound.volume = V.get();
      uitext.textContent = `  音量: ${~~uiinput.value}%  `;
    }
    uiinput.addEventListener("input", refresh);

    uiholder.append(uitext, uiinput);
    
    const once = () => {
      document.body.removeEventListener('click', once);
      setTimeout(() => {
        refresh();
      }, 200);
    };
    document.body.addEventListener('click', once);
  });
})();
