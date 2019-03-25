(function () {
  var itemList = [];
  var t = {
    location: [0, 0],
    type: 'none number mine',
    number: 5,
  }
  var oMain = document.getElementsByClassName('main')[0];
  var row = 15;
  var column = 15;
  var oItem = [];
  var len = row * column;
  var mineNum = Math.floor(len * 0.2);
  var mineArr = [];

  function init(){
    oMain.style.width = column * 40 + 'px';
    oMain.style.height = row * 40 + 'px';
    createDom();
    for(var i = 0; i < row; i ++){
      for(var j = 0; j < column; j ++){
        oMain.appendChild(oItem[i][j]);
      }
    }

    for(var i = 0; i < row; i ++){
      var rowList = []
      for(var j = 0; j < column; j ++){
        rowList.push({
          location: [j, i],
          positionX: j,
          positionY: i,
          id: i * column + j,
          type: 'normal',
          number: 0,
          marked: false,
          show: false,
        })
      }
      itemList.push(rowList);
    }
    createMine(mineNum);
    calculate();
    bindEvent();
  }

  function createRandomArr(num) {
    var len = 0;
    var arrayAll = [];
    var obj = {};
    while(len < num){
      var randomX = Math.floor(Math.random() * column);
      var randomY = Math.floor(Math.random() * row);
      var arr = [randomX, randomY];
      var str = arr.toString();
      if(!obj[str]){
        obj[str] = 'a';
        len ++;
      }
    }
    for(var prop in obj){
      var arrItem = prop.split(',');
      arrItem[0] = +arrItem[0];
      arrItem[1] = +arrItem[1];
      arrayAll.push(arrItem);
    }
    return arrayAll;
  }

  function createMine(num) {
    mineArr = createRandomArr(num);
    for(var i = 0; i < num; i ++){
      var X = mineArr[i][0];
      var Y = mineArr[i][1];
      itemList[Y][X].type = 'mine';
    }
  }

  function squareLocationList(positionX, positionY) {
    var squareLocation = {
      top: positionY - 1 < 0 ? null : [positionX, positionY - 1],
      left: positionX - 1 < 0 ? null : [positionX - 1, positionY],
      right: positionX + 1 > column - 1 ? null : [positionX + 1, positionY],
      bottom: positionY + 1 > row - 1 ? null : [positionX, positionY + 1]
    }
      squareLocation.topLeft =  squareLocation.top && squareLocation.left ? [positionX - 1, positionY - 1] : null;
      squareLocation.topRight =  squareLocation.top && squareLocation.right ? [positionX + 1, positionY - 1] : null;
      squareLocation.bottomLeft =  squareLocation.bottom && squareLocation.left ? [positionX - 1, positionY + 1] : null;
      squareLocation.bottomRight =  squareLocation.bottom && squareLocation.right ? [positionX + 1, positionY + 1] : null;
    return squareLocation;
  }

  function calculate() {
    for(var i = 0; i < mineNum; i ++){
      var locationObj = squareLocationList(mineArr[i][0], mineArr[i][1]);
      for(var prop in locationObj){
        if(locationObj[prop]){
          itemList[locationObj[prop][1]][locationObj[prop][0]].number ++;
        }
      }
    }
  }

  function show() {
    for(var i = 0; i < len; i ++){
      var x = i % column;
      var y = Math.floor(i / column);
      if(itemList[y][x].type != 'mine'){
        if(itemList[y][x].number > 0){
          oItem[y][x].innerHTML = itemList[y][x].number;
        }
      } else{
        oItem[y][x].classList.add('mine');
      }
    }
  }

  function createDom(){
    for(var i = 0; i < row; i ++){
      var rowList = [];
      for(var j = 0; j < column; j ++){
        var oDiv = document.createElement('div');
        oDiv.classList.add('item');
        rowList.push(oDiv);
      }
      oItem.push(rowList);
    }
  }

  function getLocation(ele) {
    var num = 0;
    var target = ele;
    var x, y;
    while(target.previousElementSibling){
      num ++;
      target = target.previousElementSibling;
    }
    var x = num % column;
    var y = Math.floor(num / column);
    return [x, y]
  }
  function bindEvent() { //global circle
    oMain.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false)
    oMain.addEventListener('mousedown', down, false)
  }
  function down(e) {
    var location = getLocation(e.target);
    var nowItem = itemList[location[1]][location[0]];
    if(e.which == 1){
      leftDown(nowItem);
    } else if(e.which == 3){
      mark(nowItem)
    }

  }
  function leftDown(item) {
    if(item.type == 'mine'){
      if(item.marked == false){
        end(item);
      }
    } else{
      extend(item);
    }
    if(judge()){
      success();
    }
  }

  function end(item) {
    show();
    oItem[item.positionY][item.positionX].style.background = 'red';
    oMain.removeEventListener('mousedown', down);
    setTimeout(function () {
      window.alert('失败');
      location.reload()
    }, 100)
  }

  function extend(item){
    var thisItem = oItem[item.positionY][item.positionX];
    thisItem.classList.add('click');
    item.show = true;
    if(item.number != 0){
      thisItem.innerHTML = item.number;
    } else{
      var locationList = squareLocationList(item.positionX, item.positionY)
      for(var prop in locationList){
        if(locationList[prop]){
          var x = locationList[prop][0];
          var y = locationList[prop][1];
          var nowItem = itemList[y][x];
          if(!nowItem.show){
            extend(nowItem);
          }
        }
      }
    }
  }
  function mark(item) {
    var x = item.positionX;
    var y = item.positionY;
    if(item.marked){
      oItem[y][x].classList.remove('flag');
      item.marked = false;
    } else{
      oItem[y][x].classList.add('flag');
      item.marked = true;
    }
  }

  function judge(){
    for(var i = 0; i < len; i ++){
      var X = i % column;
      var Y = Math.floor(i / column);
      var nowItem = itemList[Y][X];
      if(nowItem.type == 'mine'){
        if(nowItem.marked == false){
          return false;
        }
      } else{
        if(!nowItem.show){
          return false;
        }
      }
    }
    return true;
  }
  function success() {
    oMain.removeEventListener('mousedown', down)
    window.alert('win')
  }


  init();

}())
