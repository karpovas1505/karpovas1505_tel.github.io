const oJoinFlag = document.querySelector('#join'); 
const oLeftFlag = document.querySelector('#left'); 
let oCanv;
let oCanvSel;
let aJSON;
let oChartData = {};

const loadJSON = function () {
  return fetch('chart_data.json').then((response => response.json())).then(json => json);
};

const drawChart = function (oChartData, oCnv) {
  clearCanvas(oCnv);

// Calculate maximum followers value
  const yMax = Math.max( Math.max(...oChartData.y0), Math.max(...oChartData.y1) );
// Draw grid 
  drawGrid(oCnv, yMax);
// Draw lines
  if (oJoinFlag.checked) {
    drawLine(oChartData, 'y0', oCnv, yMax);
  } 
  if (oLeftFlag.checked){
    drawLine(oChartData, 'y1', oCnv, yMax);
  }

};

const drawLine = function (oChartData, yName, oCnv, yMax) {
  // Time data
  let y = oChartData[yName];
  // Followers data
  let x = oChartData.x;
  // Calculate time period
  let iTimeWidth = x[x.length - 1] - x[0];
  let iTimeAtPix = iTimeWidth / oCnv.width;
  let iTimePrev = 0;

  let iFollAtPix = yMax / oCnv.height;

  if (oCnv.getContext) {
    let ctx = oCnv.getContext('2d');
    ctx.beginPath();

    ctx.strokeStyle = oChartData.colors[yName];
    y.forEach((val, ind) => {
      if (ind == 0) {
        ctx.moveTo(0, oCnv.height - val/iFollAtPix);
        iTimePrev = x[ind];
      } else {
        ctx.lineTo((x[ind] - iTimePrev) / iTimeAtPix, oCnv.height - val/iFollAtPix);
      }
    });

    ctx.stroke();
    ctx.closePath();

  }
};

const drawGrid = function (oCnv, yMax) {
  let iFollAtPix = yMax / oCnv.height;

  if (oCnv.getContext) {
    let ctx = oCnv.getContext('2d');
    ctx.beginPath();
    let iCountLines = yMax / 50;
    ctx.font ='20px Arial';
    ctx.strokeStyle = 'black';
    for (let i = 0; i < iCountLines; i++) {
      ctx.moveTo(0, oCnv.height - i * 50 / iFollAtPix);
      ctx.lineTo(oCnv.width, oCnv.height - i * 50 / iFollAtPix);
      ctx.fillText((i * 50).toString(),0,oCnv.height - i * 50 / iFollAtPix - 5 );
    }

    ctx.stroke();
    ctx.closePath();

  }
};

const onLoad = async function () {
  if (!oCanv){
    oCanv = document.querySelector('#idCanv');
  }
  if (!oCanvSel){
    oCanvSel = document.querySelector('#idCanvSel');
  }
  if (!aJSON){
    aJSON = await loadJSON().then(oJSON => oJSON);
    let oJSONData = aJSON[0];
    if (oJSONData.columns) {
      for (indCol in oJSONData.columns) {
        oChartData[oJSONData.columns[indCol][0]] = oJSONData.columns[indCol].splice(1);
      }
      if (oJSONData.colors) {
        oChartData.colors = oJSONData.colors;
      }
    }
  
  }

  drawChart(oChartData, oCanv);
  drawSelRect(oCanvSel);
  drawChart(oChartData, oCanvSel);

}

window.addEventListener('load', onLoad());

oJoinFlag.addEventListener('click',onLoad);
oLeftFlag.addEventListener('click',onLoad);

function clearCanvas(oCnv) {
  if (oCnv.getContext) {
    let ctx = oCnv.getContext('2d');
    ctx.clearRect(0, 0, oCnv.width, oCnv.height);
  }
}

function drawSelRect(oCnv) {
  if (oCnv.getContext) {
    let ctx = oCnv.getContext('2d');
    ctx.fillRect(0, 0, oCnv.width/10, oCnv.height);
  }
}

