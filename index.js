


class ChessBord{
  constructor(el,domCB, wd=30) {

    this.el = el
    this.wd = wd
    this.chessBord = [];//棋盘
    
    this.chessCoor = [] // 棋子坐标
    this.chessBackCoor = [] // 悔棋坐标
    this.over = false
    this.allChess = [] // 对于dom，记录所有棋子
    this.domCB = domCB
    el.onclick = this.elOnClick.bind(this)
    this.back = this.back.bind(this)
    this.cancelBack = this.cancelBack.bind(this)
    this.init()
    
  }
  init () {
    //初始化棋盘界面
    this.domCB(this.el,this.wd)

    // 初始化虚拟棋盘
    for(let i = 0; i < 15; i++){
        this.chessBord[i] = [];
        for(let j = 0; j < 15; j++){
            this.chessBord[i][j] = 0;
        }
    }  
    //获取赢法
    let  wins = [];
    for(var i = 0; i < 15; i++){
        wins[i] = [];
        for(var j = 0; j < 15; j++){
            wins[i][j] = [];
        }
    }
    var count = 0; //赢法总数
    //横线赢法
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 11; j++){
            for(var k = 0; k < 5; k++){
                wins[i][j+k][count] = true;
            }
            count++;
        }
    }
    //竖线赢法
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 11; j++){
            for(var k = 0; k < 5; k++){
                wins[j+k][i][count] = true;
            }
            count++;
        }
    }
    //正斜线赢法
    for(var i = 0; i < 11; i++){
        for(var j = 0; j < 11; j++){
            for(var k = 0; k < 5; k++){
                wins[i+k][j+k][count] = true;
            }
            count++;
        }
    }
    //反斜线赢法
    for(var i = 0; i < 11; i++){ 
        for(var j = 14; j > 3; j--){
            for(var k = 0; k < 5; k++){
                wins[i+k][j-k][count] = true;
            }
            count++;
        }
    }
    this.wins = wins
    this.count = count
    this.total = 15 * 15
    this.myWin = Array(count).fill(0)
    this._myWin = Array(count).fill(0)
    this.computerWin = Array(count).fill(0)
    this._computerWin = Array(count).fill(0)
  }
  elOnClick(e) {
    if (this.over) return
    const x = Math.floor(e.offsetX / this.wd);
    const y = Math.floor(e.offsetY / this.wd);
    this.chessCoor.push({
      coorX:x,
      coorY:y
    })
    if(this.chessBord[x][y] == 0){
        this.chessBackCoor = []
        this.modifyCancelBack && this.modifyCancelBack(false)
        this.step(x,y,1)
        if (!this.over) {
        this.computerStep()
        }
    }
    if ( this.total-- === 1) {
      window.alert('和棋')
      this.over = true
    }
  }
  oneStep(context) {
    const self = this
    return function() {
    var fn = ChessBord.prototype.domStep
     self.allChess.push(fn(context,...arguments))
    }
  }
  destroyStep(context) {
    const self = this
    return function() {
      var fn = ChessBord.prototype.destroyDomStep
      fn(context,...arguments)
     }
 }   

  step(x,y,result) {
    this.modifyBack && this.modifyBack(true)
      this.oneStep(this.el)(x,y,result === 1,this.wd);
      this.chessBord[x][y] = result;       
                  
      for(let k in this.wins[x][y]){ // 将可能赢的情况都加1
        if(result === 1) {
            (this.myWin[k] < 5) &&this.myWin[k]++ 
            this._computerWin[k] = this.computerWin[k]
            this.computerWin[k] = 6
        } else {
            (this.computerWin[k] < 5) &&this.computerWin[k]++
            this._myWin[k] = this.myWin[k]
            this.myWin[k] = 6
        }
          if(this.myWin[k] == 5 ||this.computerWin[k] == 5){
               setTimeout(() => {
                window.alert('over')
               }, 0);
                this.over = true
          }
      }
  }

  back() {
    this.over = false
    const compCoor = this.chessCoor.pop()
    this.chessBackCoor.push(compCoor)
    const myCoor = this.chessCoor.pop()
    this.chessBackCoor.push(myCoor)
    if (this.chessCoor.length === 0) this.modifyBack && this.modifyBack(false)
    this.modifyCancelBack && this.modifyCancelBack(true)
     // 计算机相应的悔棋
     this.chessBord[compCoor.coorX][compCoor.coorY] = 0; //已占位置 还原
     this.destroyStep(this.el)(compCoor.coorX,compCoor.coorY,this.wd); //销毁棋子                                  
     for(let k in this.wins[compCoor.coorX][compCoor.coorY]){  // 将可能赢的情况都减1
      (this.computerWin[k] < 6) && this.computerWin[k]--;
       this.myWin[k] = this._myWin[k]
     }
    // 悔棋
    this.chessBord[myCoor.coorX][myCoor.coorY] = 0; //已占位置 还原
    this.destroyStep(this.el)(myCoor.coorX, myCoor.coorY,this.wd); //销毁棋子                                  
    for(let k in this.wins[myCoor.coorX][myCoor.coorY]){  // 将可能赢的情况都减1
        (this.myWin[k] < 6) && this.myWin[k]--;
      this.computerWin[k] = this._computerWin[k]
    }
   
  }
  cancelBack() {
    this.total += 2
    const myCoor = this.chessBackCoor.pop()
    this.chessCoor.push(myCoor)

    const compCoor = this.chessBackCoor.pop()
    this.chessCoor.push(compCoor)
    if (this.chessBackCoor.length === 0) this.modifyCancelBack && this.modifyCancelBack(false)
    this.step(myCoor.coorX, myCoor.coorY, 1)
    this.step(compCoor.coorX, compCoor.coorY,2)
  }
  reload(){
    window.location.reload();
  }
   computerStep (){
    if (this.over) return
   
    
    const myScore = [];
    const computerScore = [];
    for(let i = 0; i < 15; i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(let j = 0; j < 15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    let max = 0
    let x = 0
    let y = 0
    for(let i = 0; i < 15; i++){
        for(let j = 0; j < 15; j++){
            if(this.chessBord[i][j] == 0){
              for(let k in this.wins[i][j]){
                if(this.myWin[k] == 1){
                    myScore[i][j] += 200;
                }else if(this.myWin[k] == 2){
                    myScore[i][j] += 400;
                }else if(this.myWin[k] == 3){
                    myScore[i][j] += 2000;
                }else if(this.myWin[k] == 4){
                    myScore[i][j] += 10000;
                }
                
                if(this.computerWin[k] == 1){
                    computerScore[i][j] += 220;
                }else if(this.computerWin[k] == 2){
                    computerScore[i][j] += 420;
                }else if(this.computerWin[k] == 3){
                    computerScore[i][j] += 2100;
                }else if(this.computerWin[k] == 4){
                    computerScore[i][j] += 20000;
                }                        
              }
                
                if(myScore[i][j] > max){
                    max  = myScore[i][j];
                    x = i;
                    y = j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[x][y]){
                        x = i;
                        y = j;    
                    }
                }
                
                if(computerScore[i][j] > max){
                    max  = computerScore[i][j];
                    x = i;
                    y = j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[x][y]){
                        x = i;
                        y = j;    
                    }
                }
                
            }
        }
    }
    this.chessCoor.push({
      coorX:x,
      coorY:y
    })
    this.step(x,y,2)
    if ( this.total-- === 1) {
      window.alert('和棋')
      this.over = true
    }
}

}


