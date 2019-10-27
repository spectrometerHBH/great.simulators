
window.buildinfo = document.querySelector("div.container-fluid pre").innerHTML;
window.k = Number(buildinfo.match(/[\d]+\n/));
processinfo = buildinfo.substr(buildinfo.search(/---SimulationProcess---/) + "---SimulationProcess---".length);
window.blockwidth = 50;
window.innerblockwidth = 44;
window.startline = 20;
window.interline = 100;
window.leftmost = 0;
window.rightmost = 1000;
window.stepframes = 0.05;
window.pnow = [];
window.stepnow = 0;
window.autoplaying = false;
window.playing = false;

$(".container-fluid>.dl-horizontal").after('  <table width="auto" border="0" style="margin: auto">\n' +
    '    <thead>\n' +
    '      <tr>\n' +
    '        <th id = "State" width="50%" style="text-align: center; font-size: 40px">\n' +
    '          State:\n' +
    '        </th>\n' +
    '        <th id = "Step" width="50%" style="text-align: center; font-size: 40px">\n' +
    '          Step:\n' +
    '        </th>\n' +
    '      </tr>\n' +
    '    </thead>\n' +
    '    <tbody>\n' +
    '      <tr>\n' +
    '        <td colspan="2">\n' +
    '          <canvas id="canvas" width=1000 height=350>\n' +
    '          你的浏览器居然不支持Canvas？！赶快换一个吧！！\n' +
    '          </canvas>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '     </tbody>\n' +
    '  </table>\n' +
    '  <table width="auto" style="margin: auto">\n' +
    '    <tbody>\n' +
    '      <td style="width: 30%">\n' +
    '        <div class="btn-group">\n' +
    '          <button type="button" class="btn btn-secondary" onclick="settostep(0);"><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>\n' +
    '          <button type="button" id=\'play\' class="btn btn-secondary" onclick="autoplay();"><span id=\'icon\' class="glyphicon glyphicon-play" aria-hidden="true"></span></button>\n' +
    '          <button type="button" class="btn btn-secondary" onclick="pauseit(); nextstepAnimation();"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>\n' +
    '        </div>\n' +
    '      </td>\n' +
    '      <td>\n' +
    '        <div class="progress" style="position: relative; width:600px;margin: auto;">\n' +
    '          <div class="progress-bar" role="progressbar" aria-valuenow="60"\n' +
    '               aria-valuemin="0" aria-valuemax="100" style="width: 0%;">\n' +
    '            <span class="sr-only">40% 完成</span>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </td>\n' +
    '    </tbody>\n' +
    '  </table>\n');


const canvas = document.getElementById('canvas');
/* 获得 2d 上下文对象 */
const ctx = canvas.getContext('2d');


$("#canvas").height = startline + k * interline;
function TMState(str, state, pointer) {
  this.str = str;
  this.state = state;
  this.pointer = pointer;
}

function drawstate(ss, snow) {
  $("#State").html("State:".concat(ss));
  $("#Step").html("Step:".concat(snow.toString()));
}

function drawtape(st, str, pt) {
  var h1 = st;
  var h2 = st + blockwidth;
  var hmid = h1 + blockwidth/2;
  var tmph = h1 + (blockwidth - innerblockwidth) / 2;
  var tmpl = (leftmost + rightmost) / 2 - innerblockwidth / 2;
  ctx.fillStyle = "#EBEBEB";
  ctx.fillRect(leftmost, h1, rightmost - leftmost, blockwidth);

  var tl = tmpl - pt * blockwidth;
  while (tl > 0) tl -= blockwidth;
  while (tl < rightmost) {
    ctx.fillStyle = "#B2DFEE";
    ctx.fillRect(tl, tmph, innerblockwidth, innerblockwidth);
    tl += blockwidth;
  }

  tl = (leftmost + rightmost) / 2 - pt * blockwidth;
  var len = str.length; var i = 0;
  for (i = 0; i < len; ++i) {
    if (str.charAt(i) !== '*') {
      ctx.fillStyle = "#000000";
      ctx.font = "20px Consolas";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(str.charAt(i).toString(), tl, hmid);
    }
    tl = tl + blockwidth;
  }

  ctx.beginPath();
  ctx.moveTo((leftmost + rightmost) / 2, h2 - 5);
  ctx.lineTo((leftmost + rightmost) / 2 + 20, h2 + 30);
  ctx.lineTo((leftmost + rightmost) / 2 - 20, h2 + 30);
  ctx.closePath();
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();
}

//process log
processlen = processinfo.length;
tmp = 0;
log = [];
while (tmp < processlen) {
  while ((processinfo.charAt(tmp) === ' ' || processinfo.charAt(tmp) === '\n' || processinfo.charAt(tmp) === ']') && (tmp < processlen)) tmp++;
  if (tmp >= processlen) break;
  if (processinfo.charAt(tmp) !== '[') {
    str = "";
    while (processinfo.charAt(tmp) !== ' ' && processinfo.charAt(tmp) !== '\n' && tmp < processlen) {
      str = str + processinfo.charAt(tmp);
      ++tmp;
    }
    log.push(str);
    // console.log(str);
  } else {
    ++tmp;
    ary = [];
    while (tmp < processlen) {
      str = "";
      while (processinfo.charAt(tmp) !== ',' && processinfo.charAt(tmp) !== ' ' && processinfo.charAt(tmp) !== ']' && tmp < processlen) {
        str = str + processinfo.charAt(tmp);
        ++tmp;
      }
      ary.push(Number(str));
      while ((processinfo.charAt(tmp) === ' ' || processinfo.charAt(tmp) === ',') && (tmp < processlen)) tmp++;
      if (processinfo.charAt(tmp) === ']' || tmp >= processlen) break;
    }
    log.push(ary);
    // console.log(ary);
  }
}

window.SimulationLog = log;

var stateary = []; var j, str, state, pointer, totstate = 0;
for (i = 0; i < log.length; i += k + 2) {
  str = [];
  for (j = 0; j < k; ++j) str[j] = log[i + j];
  state = log[i + k];
  pointer = log[i + k + 1];
  stateary[totstate] = new TMState(str, state, pointer);
  ++totstate;
}

//init
canvas.setAttribute("height", (startline+(k)*interline).toString());
for (i = 0; i < k; ++i) {
  drawtape(startline + interline * i, stateary[0].str[i], stateary[0].pointer[i]);
  pnow[i] = stateary[0].pointer[i];
}
drawstate(stateary[0].state, 0);
setProcess(0);
stepnow = 0;

function settostep(kth) {
  playing = false;
  autoplaying = false;
  $('#play').attr('onclick', 'autoplay();');
  $('#icon').attr('class', 'glyphicon glyphicon-play');
  if (kth < 0 || kth >= totstate) {
    alert("Invalid Step!");
    return;
  }
  stepnow = kth;
  for (j = 0; j < k; ++j) {
    pnow[j] = stateary[kth].pointer[j];
    drawtape(startline + j * interline, stateary[kth].str[j], pnow[j]);
  }
  drawstate(stateary[kth].state, kth);
  setProcess(kth);
}

function endAnimation() {
}

function nextstepAnimation() {
  if (playing) return;
  var remainframe;
  function step() {
    if (playing === false) return;
    if (remainframe - stepframes > 0) {
      remainframe -= stepframes;
      for (j = 0; j < k; ++j) {
        if (Math.abs(pnow[j] - stateary[stepnow].pointer[j]) < stepframes) pnow[j] = stateary[stepnow].pointer[j];
        else if (pnow[j] < stateary[stepnow].pointer[j]) pnow[j] += stepframes;
        else if (pnow[j] > stepframes) pnow[j] -= stepframes;
        drawtape(startline + j * interline, stateary[stepnow].str[j], pnow[j]);
      }
      requestAnimationFrame(step);
      return;
    }
    for (j = 0; j < k; ++j) {
      pnow[j] = stateary[stepnow].pointer[j];
      drawtape(startline + j * interline, stateary[stepnow].str[j], pnow[j]);
    }
    playing = false;
    if (autoplaying)
      setTimeout(function () {if (autoplaying) nextstepAnimation();}, 500);
  }
  if (stepnow >= totstate - 1) {
    endAnimation();
    return;
  }
  ++stepnow;
  drawstate(stateary[stepnow].state, stepnow);
  remainframe = 1;
  playing = true;
  requestAnimationFrame(step);
  setProcess(stepnow);
}

function autoplay() {
  autoplaying = true;
  $('#play').attr('onclick', 'pauseit();');
  $('#icon').attr('class', 'glyphicon glyphicon-pause');
  nextstepAnimation();
}

function pauseit() {
  autoplaying = false;
  $('#play').attr('onclick', 'autoplay();');
  $('#icon').attr('class', 'glyphicon glyphicon-play');
}


//slider

function setProcess(kth) {
  $('.progress-bar').css("width", (kth * 100 / (totstate - 1)).toString().concat("%"));
}