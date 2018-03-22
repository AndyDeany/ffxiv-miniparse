function blueText(text) {
  return "<span class='enc'>" + text + "</span>";
}

var encounterDefine = `
  Time: ${blueText("{duration}")} &nbsp; Party DPS: ${blueText("{ENCDPS}")}<br>
  ${PARTY_MAX_HIT_TITLE}: ${blueText("{maxHitCustom}")}<br>
  ${PLAYER_MAX_HIT_TITLE}: ${blueText("{myMaxHitCustom}")}
`
var useHTMLEncounterDefine = true;  // Must be true for encounterDefine to render HTML

// ヘッダの定義
var headerDefine = [];

// 表示するデータの定義
var bodyDefine = [];
// bodyDefine.push({ text: "#", width: "5%", align: "center" },
// bodyDefine.push({ text: rankingText, width: "", align: "center"});

headerDefine.push({text: "Name", width: "10%", align: "left"});
if (FLAG_COMBINE_NAME_AND_JOB) {
  userHTML = "<img src='./images/{JobOrName}.png' style='margin-bottom:-5px;'/> {newName}"
  bodyDefine.push({html: userHTML, width: "", effect: userTextEffect});
} else {
  bodyDefine.push({text: "{newName}", width: "", effect: userTextEffect});
  headerDefine.push({text: "Job", width: "5%", align: "center"});
  bodyDefine.push({html: "<img src='./images/{JobOrName}.png' onError=\"this.onerror=null;this.src='./images/error.png';\" />", width: "5%", align: "center"});
}

headerDefine.push({text: "DPS", width: "5%", align: "center"});
bodyDefine.push({text: "{encdps}", width: "", align: "center", effect: dpsTextEffect});

// headerDefine.push({text: "DPS %", width: "5%", align: "center"});
// bodyDefine.push({text: "{damage%}", width: "", align: "center"});

// headerDefine.push({text: "HPS", width: "5%", align: "center"});
// bodyDefine.push({text: "{enchps}", width: "", align: "center"});

headerDefine.push({text: "Heal %", width: "5%", align: "center"});
bodyDefine.push({text: "{healed%}", width: "", align: "center", effect: healTextEffect});

headerDefine.push({text: "Crit %", width: "5%", align: "center"});
bodyDefine.push({text: "{crithit%}", width: "", align: "center"});

headerDefine.push({text: "DH %", width: "5%", align: "center"});
bodyDefine.push({text: "{DirectHitPct}", width: "", align: "center"});

// headerDefine.push({text: "Misses", width: "5%", align: "center"});
// bodyDefine.push({text: "{misses}", width: "", align: "center", effect: redTextEffect});

headerDefine.push({text: "RIP", width: "5%", align: "center"});
bodyDefine.push({text: "{deaths}", width: "", align: "center", effect: redTextEffect});

headerDefine.push({text: "+Heal %", width: "5%", align: "center"});
bodyDefine.push({text: "{OverHealPct}", width: "", align: "center"});

// headerDefine.push({text: "Max Hit", width: "14%", align: "center"});
// bodyDefine.push({text: "{maxhit}", width: "", align: "left"});

var partyMaxHitBuffer = "";
var myMaxHitBuffer = "";

function changeCellTextStyle(cell, color, textShadowColor) {
  cell.style.color = color;
  cell.style.textShadow = `
    -1px 0 3px ${textShadowColor}, 0 1px 3px ${textShadowColor},
    1px 0 3px ${textShadowColor}, 0 -1px 3px ${textShadowColor};
  `
}

function dpsTextEffect(cell) {
  cell.innerText = cell.innerText.split(",")[0].split(".")[0];
}

function userTextEffect(cell) {
  switch (cell.innerText.trim()) {
    case "Sara Neko":
      var textColor = "#ffdbea";
      var textShadowColor = "#ff68a9";
      break;
    case "Andrew Neko":
      var textColor = "#e1d3ff";
      var textShadowColor = "#7d49ff";
      break;
  }
  changeCellTextStyle(cell, textColor, textShadowColor);
}

function redTextEffect(cell) {
  var num = parseInt(cell.innerText)
  if (num > 0) {
      changeCellTextStyle(cell, "#ffcdd2", "#fc5161");
  }
}

function healTextEffect(cell) {
  var num = parseInt(cell.innerText)
  if (num >= 10) {
    if (num < 30) {
      changeCellTextStyle(cell, "#eef5e2", "#83ad20");
    } else {
      changeCellTextStyle(cell, "#E2EBF5", "#23af4f");
    }
  }
}
