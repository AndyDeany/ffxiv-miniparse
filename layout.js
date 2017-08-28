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
var headerDefine = [
  //{ text: "#", width: "5%", align: "center" },
  { text: "Name", width: "10%", align: "left" },
  { text: "Job", width: "5%", align: "center" },
  { text: "DPS", width: "5%", align: "center"},
  //{ text: "DPS %", width: "5%", align: "center"},
  //{ text: "HPS", width: "5%", align: "center"},
  { text: "Heal %", width: "5%", align: "center"},
  { text: "Crit %", width: "5%", align: "center" },
  { text: "DH %", width: "5%", align: "center" },
  //{ text: "Misses", width: "5%", align: "center" },
  { text: "RIP", width: "5%", align: "center" },
  { text: "+Heal %", width: "5%", align: "center"},
  //{ text: "Max Hit", width: "14%", align: "center" },
];

// 表示するデータの定義
var bodyDefine = [];
// bodyDefine.push({ text: rankingText, width: "", align: "center"});
bodyDefine.push({text: "{newName}", width: "", effect: userTextEffect});
bodyDefine.push({html: "<img src='./images/{JobOrName}.png' onError=\"this.onerror=null;this.src='./images/error.png';\" />", width: "5%", align: "center"});
bodyDefine.push({text: "{encdps}", width: "", align: "center", effect: dpsTextEffect});
// bodyDefine.push({text: "{damage%}", width: "", align: "center"});
// bodyDefine.push({text: "{enchps}", width: "", align: "center"});
bodyDefine.push({text: "{healed%}", width: "", align: "center", effect: healTextEffect});
bodyDefine.push({text: "{crithit%}", width: "", align: "center"});
bodyDefine.push({text: "{DirectHitPct}", width: "", align: "center"});
// bodyDefine.push({text: "{misses}", width: "", align: "center", effect: redTextEffect});
bodyDefine.push({text: "{deaths}", width: "", align: "center", effect: redTextEffect});
bodyDefine.push({text: "{OverHealPct}", width: "", align: "center"});
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
  if (cell.innerText === "_userFlag") {
    cell.innerText = PLAYER_NAME;
  }

  var playerName = cell.innerText;
  switch (playerName) {
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
