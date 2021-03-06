/*
プラグイン側から以下のような ActXiv オブジェクトとしてデータが提供される

var ActXiv = {
 "Encounter": {...},
 "Combatant": {
   "PlayerName1": {...},
   "PlayerName2": {...},
   ...
 }
};

データの更新は 1 秒毎。

プラグインから onOverlayDataUpdate イベントが発行されるので、それを受信することもできる
イベントハンドラの第一引数の detail プロパティ内に上記のオブジェクトが入る



表示設定 (2)
*/



/* 順位を表示する（text に関数を指定する例）
 * 引数:
 *  combatant : キャラクターのデータ。combatant["..."]でデータを取得できる。
 *  index : キャラクターの並び順。一番上は 0 で、その後は 1 ずつ増える。
 * 戻り値:
 *  表示するテキスト。
 *  ACT のタグは展開されないので、展開したい場合は parseActFormat 関数を使用してください。
 */
function rankingText(combatant, index) {
  // 1 から始まる番号を返す
  return (index + 1).toString();
}

// 死亡奴を赤くする（effect の例）
// 引数:
//  cell : セルの DOM 要素
//  combatant : キャラクターのデータ。combatant["..."]でデータを取得できる。
//  index: キャラクターの並び順。一番上は 0 で、その後は 1 ずつ増える。
// 戻り値: なし
function deadYatsuEffect(cell, combatant, index) {
  // デス数を整数値に変換
  var deaths = parseInt(combatant["deaths"]);
  // デス数が 0 よりも大きいなら
  if (deaths > 0) {
    // 赤くする
    changeCellTextStyle(cell, "#FFA0A0", "#802020");
  }
}

// 以下表示用スクリプト

// onOverlayDataUpdate イベントを購読
document.addEventListener("onOverlayDataUpdate", function (e) {
  update(e.detail);
});

// 表示要素の更新
function update(data) {
  updateEncounter(data);
  if (document.getElementById("combatantTableHeader") == null) {
    updateCombatantListHeader();
  }
  updateCombatantList(data);
}

  // エンカウント情報を更新する
function updateEncounter(data) {
  // 要素取得
  var encounterElem = document.getElementById('encounter');

  // テキスト取得
  var elementText;
  if (typeof encounterDefine === 'function') {
    elementText = encounterDefine(data.Encounter);
  } else if (typeof encounterDefine === 'string') {
    elementText = parseActFormatMaxHit(encounterDefine, data);
  } else {
    console.log("updateEncounter: Could not update the encounter element due to invalid type.");
    return;
  }

  // テキスト設定
  if (!useHTMLEncounterDefine) {
    encounterElem.innerText = parseActFormatMaxHit(encounterDefine, data);
  } else {
    encounterElem.innerHTML = parseActFormatMaxHit(encounterDefine, data);
  }
}

// ヘッダを更新する
function updateCombatantListHeader() {
  var table = document.getElementById('combatantTable');
  var tableHeader = document.createElement("thead");
  tableHeader.id = "combatantTableHeader";
  var headerRow = tableHeader.insertRow();

  for (var i = 0; i < headerDefine.length; i++) {
    var cell = document.createElement("th");
    // テキスト設定
    if (typeof headerDefine[i].text !== 'undefined') {
      cell.innerText = headerDefine[i].text;
    } else if (typeof headerDefine[i].html !== 'undefined') {
      cell.innerHTML = headerDefine[i].html;
    }
    // 幅設定
    cell.style.width = headerDefine[i].width;
    cell.style.maxWidth = headerDefine[i].width;
    // 横結合数設定
    if (typeof headerDefine[i].span !== 'undefined') {
      cell.colSpan = headerDefine[i].span;
    }
    // 行揃え設定
    if (typeof headerDefine[i].align !== 'undefined') {
      cell.style["textAlign"] = headerDefine[i].align;
    }
    headerRow.appendChild(cell);
  }

  table.tHead = tableHeader;
}

const JOBS = [
  "YOU",
  "Gla", "Mrd", "Pld", "War", "Drk", "Gnb",
  "Cnj", "Whm", "Sch", "Ast",
  "Pgl", "Mnk", "Lnc", "Drg", "Rog", "Nin", "Sam",
  "Arc", "Brd", "Mch", "Dnc",
  "Thm", "Blm", "Acn", "Smn", "Rdm",
  "carbuncle", "Garuda", "Titan", "Ifrit", "Eos", "Selene", "Seraph", "Rook", "Bishop", "choco",
  "Alc", "Arm", "Bsm", "Crp", "Cul", "Gsm", "Ltw", "Wvr",
  "Btn", "Fsh", "Min"
]

// プレイヤーリストを更新する
function updateCombatantList(data) {
  // 要素取得＆作成
  var table = document.getElementById('combatantTable');
  var oldTableBody = table.tBodies.namedItem('combatantTableBody');
  var newTableBody = document.createElement("tbody");
  newTableBody.id = "combatantTableBody";

  // tbody の内容を作成
  var combatantIndex = 0;
  for (var combatantName in data.Combatant) {
    var combatant = data.Combatant[combatantName];
    combatant.JobOrName = combatant.Job || combatantName;

    var egiSearch = combatant.JobOrName.indexOf("-Egi (");
    var turretSearch = combatant.JobOrName.indexOf(" Autoturret (");
    var carbuncleSearch = combatant.JobOrName.indexOf(" Carbuncle (");
    if (egiSearch != -1) {
      combatant.JobOrName = combatant.JobOrName.substring(0, egiSearch);
    } else if (turretSearch != -1) {
      combatant.JobOrName = combatant.JobOrName.substring(0, turretSearch);
    } else if (carbuncleSearch != -1) {
      combatant.JobOrName = "carbuncle";
    } else if (combatant.JobOrName.indexOf("Eos (") == 0) {
      combatant.JobOrName = "Eos";
    } else if (combatant.JobOrName.indexOf("Selene (") == 0) {
      combatant.JobOrName = "Selene";
    } else if (combatant.JobOrName.indexOf("Seraph (") == 0) {
      combatant.JobOrName = "Seraph";
    } else if (combatant.JobOrName.indexOf(" (") != -1) {
      combatant.JobOrName = "choco";
    }
    combatant.newName = combatantName;

    if (FLAG_HIDE_NPCS && JOBS.indexOf(combatant.JobOrName) == -1) {
      // Don't add NPCs to table (add only JOBS).
      if (DEBUG) { console.log(`Skipping combatant: ${combatant.JobOrName}`); }
      continue;
    }

    if (combatant.newName.indexOf("YOU") == 0) {
      combatant.newName = PLAYER_NAME;
    }

    var tableRow = newTableBody.insertRow(newTableBody.rows.length);
    for (var i = 0; i < bodyDefine.length; i++) {
      var cell = tableRow.insertCell(i);
      // テキスト設定
      if (typeof bodyDefine[i].text !== 'undefined') {
        var cellText;
        if (typeof bodyDefine[i].text === 'function') {
          cellText = bodyDefine[i].text(combatant, combatantIndex);
        } else {
          cellText = parseActFormat(bodyDefine[i].text, combatant);
        }
        cell.innerText = cellText;
      } else if (typeof bodyDefine[i].html !== 'undefined') {
        var cellHTML;
        if (typeof bodyDefine[i].html === 'function') {
          cellHTML = bodyDefine[i].html(combatant, combatantIndex);
        } else {
          cellHTML = parseActFormat(bodyDefine[i].html, combatant);
        }
        cell.innerHTML = cellHTML;
      }
      // 幅設定
      cell.style.width = bodyDefine[i].width;
      cell.style.maxWidth = bodyDefine[i].width;
      // 行構え設定
      if (typeof (bodyDefine[i].align) !== 'undefined') {
        cell.style.textAlign = bodyDefine[i].align;
      }
      // エフェクト実行
      if (typeof bodyDefine[i].effect === 'function') {
        bodyDefine[i].effect(cell, combatant, combatantIndex);
      }
    }
    combatantIndex++;
  }

  // tbody が既に存在していたら置換、そうでないならテーブルに追加
  if (oldTableBody != void (0)) {
    table.replaceChild(newTableBody, oldTableBody);
  }
  else {
    table.appendChild(newTableBody);
  }
}

// Miniparse フォーマット文字列を解析し、表示文字列を取得する
function parseActFormat(str, dictionary) {
  var result = "";

  var currentIndex = 0;
  do {
    var openBraceIndex = str.indexOf('{', currentIndex);
    if (openBraceIndex < 0) {
      result += str.slice(currentIndex);
      break;
    } else {
      result += str.slice(currentIndex, openBraceIndex);
      var closeBraceIndex = str.indexOf('}', openBraceIndex);
      if (closeBraceIndex < 0) {
        // parse error!
        console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
        return "ERROR";
      } else {
        var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
        if (typeof dictionary[tag] !== 'undefined') {
          result += dictionary[tag];
        } else {
          console.log("parseActFormat: Unknown tag: " + tag);
          result += "ERROR";
        }
        currentIndex = closeBraceIndex + 1;
      }
    }
  } while (currentIndex < str.length);

  return result;
}

  // Momoko's custom maxhit formatting
function parseActFormatMaxHit(str, data) {
  function formatMaxHitString(maxHitString) {
    return maxHitString.replace(/-/g, " - ").replace(",", "").replace(" ", "");
  }
  var result = "";

  var currentIndex = 0;

  var userMaxHitFlag;
  var userMaxHitValue = 0;
  var userMaxHitString = "";
  if (str.indexOf("{myMaxHitCustom}") > 0) {
    userMaxHitFlag = 1;
    var userMaxHit = "";
    var combatant = data.Combatant["YOU"];
    if (typeof combatant !== 'undefined') {
      userMaxHitString = combatant["maxhit"];
      var hitValueString = userMaxHitString.slice(userMaxHitString.lastIndexOf("-")+1);
      var hitValue = parseInt(hitValueString.replace(/,/g, ""));
      if (!isNaN(hitValue)) {
        userMaxHitValue = hitValue;
      }
    userMaxHitString = formatMaxHitString(userMaxHitString);
    }
  } else {
  userMaxHitFlag = 0;
  }

  var partyMaxHitFlag;
  var partyMaxHitValue = 0;
  var partyMaxHitString = "";
  if (str.indexOf("{maxHitCustom}") > 0) {
    partyMaxHitFlag = 1;
    for (var combatantName in data.Combatant) {
      if (noLBInPartyMaxHit == 1 && combatantName == "Limit Break") {
        continue;
      }
      if (noMyMaxHitInPartyMaxHit == 1 && combatantName == "YOU") {
        continue;
      }
      var combatant = data.Combatant[combatantName];

      if (typeof combatant === 'undefined') {
        continue;
      }
      var maxHitForCombatant = combatant["maxhit"];
      if (maxHitForCombatant !== 'undefined') {
        var hitValueString = maxHitForCombatant.slice(maxHitForCombatant.lastIndexOf("-")+1);
        var hitValue = parseInt(hitValueString.replace(/,/g, ""));
        if (!isNaN(hitValue)) {
          if (hitValue > partyMaxHitValue) {
            partyMaxHitValue = hitValue;
            if (combatantName == "YOU") {
              partyMaxHitString = PLAYER_NAME+"-"+maxHitForCombatant;
            } else {
              partyMaxHitString = combatantName+"-"+maxHitForCombatant;
            }
          }
          partyMaxHitString = formatMaxHitString(partyMaxHitString);
        }
      }
    }
  } else {
    partyMaxHitFlag = 0;
  }

  if (colorHigherMaxHit == 1 && partyMaxHitFlag == 1 && userMaxHitFlag == 1) {
    if (userMaxHitValue >= partyMaxHitValue) {
    userMaxHitString = "<font style='color:#ffcdd2;text-shadow:-1px 0 3px #fc5161, 0 1px 3px #fc5161, 1px 0 3px #fc5161, 0 -1px 3px #fc5161;font-weight:100;'>" + userMaxHitString + "</font>";
    } else {
      partyMaxHitString = "<font style='color:#ffcdd2;text-shadow:-1px 0 3px #fc5161, 0 1px 3px #fc5161, 1px 0 3px #fc5161, 0 -1px 3px #fc5161;font-weight:100;'>" + partyMaxHitString + "</font>";
    }
  }

  do {
    var openBraceIndex = str.indexOf('{', currentIndex);
    if (openBraceIndex < 0) {
      result += str.slice(currentIndex);
      break;
    } else {
      result += str.slice(currentIndex, openBraceIndex);
      var closeBraceIndex = str.indexOf('}', openBraceIndex);
      if (closeBraceIndex < 0) {
        // parse error!
        console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
        return "ERROR";
      } else {
        var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
        if (tag == "maxHitCustom") {
          result += partyMaxHitString;
        } else if (tag == "myMaxHitCustom") {
          result += userMaxHitString;
        } else if (typeof data.Encounter[tag] !== 'undefined') {
          result += data.Encounter[tag];
        } else {
          console.log("parseActFormat: Unknown tag: " + tag);
          result += "ERROR";
        }
        currentIndex = closeBraceIndex + 1;
      }
    }
  } while (currentIndex < str.length);

  return result;
}
