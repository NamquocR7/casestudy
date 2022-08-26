let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
let ROW =18 ;
let COL =10 ;
let SQ =30 ;
let COLOR ="DEEPPINK" ;
let score =0 ;

function music(){
    document.getElementById('mu').play();
}

function drawSquare(x , y, color){
    ctx.fillStyle = color;            //mauchohinh
    ctx.fillRect(x*SQ,y*SQ, SQ, SQ);

    ctx.strokeStyle = "#ccc"          //duong vien
    ctx.strokeRect( x*SQ, y*SQ, SQ, SQ);
}
let board = [];//mang 2 chieu chứa gane
for(r=0;r<ROW;r++){
    board[r]=[];
    for(c=0;c<COL;c++){
        board[r][c] = COLOR;
    }
}
//ve
function drawBoard(){
    for(r = 0 ; r < ROW; r++){
        for(c = 0 ; c <COL ; c++){
            drawSquare(c , r , board[r][c]) //ve hang va cot va mau tuong ung
        }
    }
}
drawBoard();
class Piece{ //random tao hinh
    constructor(tesseract,color){  //(hinh,mau hinh)
        this.tesseract = tesseract;
        this.color = color;

        this.tesseractT = 0;//goc quay dau tien
        this.activeTesseract = this.tesseract[this.tesseractT];//lay goc quay dua tren cai tren gan n vao
         this.x =3;
         this.y =-2;// toa do ngoai canvas
    }
    fill(color){
        for (let r =0 ; r < this.activeTesseract.length; r++){       //duyet qua hang va cot
            for (let c = 0;c < this.activeTesseract.length;c++){
                if(this.activeTesseract[r][c]){                   //hang va cot co gia tri
                    drawSquare(this.x +c, this.y+r, color);//chuyen gia tri
                }
            }
        }
    }
    draw() { //tao mau cho hinh
        this.fill(this.color)
    }
    unDraw(){//
        this.fill(COLOR) //mau trang
    }
    moveDown(){
        if(!this.collision(0, 1, this.activeTesseract)) { //th khong va cham
            this.unDraw();
            this.y++;
            this.draw();
        }else{
            this.lock();         //va cham khoa chubyen dong
            p = randomPiece();   //tao ra hinh moi
        }
    }
    //sangtrai phai
    moveLeft(){
        if(!this.collision(-1, 0, this.activeTesseract)) { // ktra co duoc sang trai khong
            this.unDraw();                                       // collision tra ve false
            this.x--;
            this.draw();
        }
    }
    moveRight(){
        if(!this.collision(1, 0, this.activeTesseract)) { //ktr co duoc sang phai khong
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    lock() {  //tao methol lock
        for(let r = 0 ; r < this.activeTesseract.length; r++){
            for(let c = 0 ; c < this.activeTesseract.length; c++ ) {
                if (!this.activeTesseract[r][c]) {  //ovitri rc k co du lieu
                    continue
                }
                if (this.y + r < 0) {     //va cham thanh tren
                    document.write('<center><h1>GA VL</h1> '+'<br>' +'<img src="http://dayve.vn/wp-content/uploads/2021/09/Buoc-9_-dung-quen-to-mau-cho-ga-con-nhe.png" alt=" "></center> ')
                    gameOver = true; // ve true tao game moi
                    break;
                }
                board[this.y + r][this.x + c] = this.color;
            }
        }
        //andiem
        for(let r = 0 ; r < ROW; r++){
            let isFull = true ;
            for(let c = 0 ;c < COL; c++){
                isFull = isFull && (board[r][c] != COLOR) //cap nhat lai isF
            }
            if(isFull){                           //row full
                for(let y=r; y>1; y--){
                    for(let c = 0;c < COL;c++){
                        board[y][c]=board[y-1][c];//vitri cua row =>row-1
                    }
                }
                for(let c = 0;c < COL; c++){  //tao hang moi tren board
                    board[0][c]= COLOR;
                }
                score +=10;
            }
        }
        drawBoard();
        document.querySelector('#score').innerText = score;
    }
    rotatory(){ //quay hinh
        let nextRota = this.tesseract[(this.tesseractT + 1) % this.tesseract.length]//tu3ve0
        let move = 0;
        if(this.collision(0,0,nextRota)){    //TH va cham khi xoay
            if(this.x > COL/2){ //va cham phai
                move = -1        //giam this.x di 1
            } else {
                move = 1
            }
        }
        if(!this.collision(0,0,nextRota)){   //TH khong va cham
            this.unDraw();                          //ve mau trang
            this.x +=move;                          //tang toa do
            this.tesseractT = (this.tesseractT +1) % this.tesseract.length;
            this.activeTesseract = this.tesseract[this.tesseractT];
            this.draw();

        }
    }
    //ktr va cham trai phai
    collision(x , y, piece){ //hinh
        for(let r = 0; r< piece.length; r++){
            for(let c= 0; c<piece.length; c++){
                if(!piece[r][c]){               //false
                    continue
                }
                //toa do moi
                let newX = this.x +c +x;
                let newY = this.y +r +y;
                // va cham trai, phai, duoi
                if(newX <0 || newX >= COL || newY >=ROW){
                    return true
                }
                // va cham thanh tren
                if (newY<0){
                    continue
                }
                //mang
                if(board[newY][newX] != COLOR){
                    return true
                }
            }
        }
        return false
    }
}
let PIECES = [
    [I, "red" ],
    [L, "green"],
    [O, "blue"],
    [S, "yellow"],
    [T, "orange"]
];
//2
function randomPiece(){//tao hinh moi
    let r = Math.floor(Math.random()* PIECES.length);
    return new Piece(PIECES[r][0],PIECES[r][1]);// hinh o vi tri 0, mau o vitri 1
}
let p = randomPiece();
console.log(p);
//sang trai phai xuong
document.addEventListener('keydown', function(e){
    if(e.keyCode == 37){
        p.moveLeft();
    }else if(e.keyCode == 39) {
        p.moveRight();
    }else if(e.keyCode == 38) {
        p.rotatory()
    }else if(e.keyCode == 40) {
        p.moveDown();
    }
})

//tao loop cho hinh chay lai
let gameOver = false;
let interval;//khoang thoi gian
function drop(){
    interval = setInterval(function (){
        if(!gameOver){
        p.moveDown(); //di chuyen hinh xuong
        }else{
            clearInterval(interval)
        }
    },1000)//lap lai cong viec trong 1 giay
}
drop();
//sang trai phai
// kiem tra va cham trai phai54