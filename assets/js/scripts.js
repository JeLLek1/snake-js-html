const segmentcss = 'snike__segment';
const mapWallHtml = '<div class="snike__map snike__map--wall"></div>';
const mapPathcHtml = '<div class="snike__map snike__map--path"></div>';
const clearFix = '<div class="snike__sclearFix"></div>';
const foodClass = 'snike__food';
const dir = [[-1,0],[0,-1],[1,0],[0,1]];
class Map{
    constructor(data){
        this.size_x = 10;
        this.size_y = 10;
        if(data.size_x){
            this.size_x = data.size_x;
        }
        if(data.size_y){
            this.size_y = data.size_y;
        }
    }
    buildMap(){
        var map = "";
        for(var i=0; i<this.size_x+2; i++){
            map+=mapWallHtml;
        }
        map+=clearFix;
        for(var i=0; i<this.size_y; i++){
            map+=mapWallHtml;
            for(var j=0; j<this.size_x; j++){
                map+=mapPathcHtml;
            }
            map+=mapWallHtml;
            map+=clearFix;
        }
        for(var i=0; i<this.size_x+2; i++){
            map+=mapWallHtml;
        }
        map+=clearFix;
        return map;
    }
    returnWidth(){
        return this.size_x;
    }
    returnHeight(){
        return this.size_y;
    }
}

class Segment{
    constructor(x,y){
        this.el = document.createElement("div");
        this.el.className = segmentcss;
        this.x;
        this.y;
        this.setPos(x,y);
    }
    setPos(x,y){
        this.x = x;
        this.y = y;
    }
    changePos(offX, offY){
        this.x+=offX;
        this.y+=offY;
    }
    update(elWidth){
        this.el.style.setProperty('left', elWidth+elWidth*this.x + "px");
        this.el.style.setProperty('top', elWidth+elWidth*this.y + "px");
    }
    returnEl(){
        return this.el;
    }
    returnX(){
        return this.x;
    }
    returnY(){
        return this.y;
    }
    remove(){
        this.el.remove();
    }
}
class Food{
    constructor(mapWidth, mapHeight){
        this.el = document.createElement("div");
        this.el.className = foodClass;
        this.x;
        this.y;
    }
    returnEl(){
        return this.el;
    }
    setPos(mapWidth, mapHeight){
        this.x = Math.floor(Math.random() * mapWidth);
        this.y = Math.floor(Math.random() * mapHeight);
    }
    update(elWidth){
        this.el.style.setProperty('left', elWidth+elWidth*this.x + "px");
        this.el.style.setProperty('top', elWidth+elWidth*this.y + "px");
    }
    returnX(){
        return this.x;
    }
    returnY(){
        return this.y;
    }
}
class Snike{
    constructor(el, menu, counter, data){
        this.counter=counter;
        this.segments = [];
        this.container = el;
        this.menu = menu;
        this.startButton = menu.querySelector("#snike_start");
        this.elementWidth = 20;
        this.interval;
        this.input;
        if(data.el_width){
            this.elementWidth = data.el_width;  
        }
        this.speed = 500;
        if(data.speed){
            this.speed = data.speed;
        }
        this.map = new Map(data);
        this.container.innerHTML = this.map.buildMap();
        if(data.el_width){
            document.documentElement.style.setProperty('--segment-width', data.el_width + "px");
        }
        
        this.food = new Food(this.map.returnWidth(), this.map.returnHeight());
        
        this.eventListener();
    }
    prepare(){
        this.input = 0;
        for(var i = 0; i<this.segments.length; i++){
            this.segments[i].remove();
        }
        this.food.setPos(this.map.returnWidth(), this.map.returnHeight());
        this.food.update(this.elementWidth);
        
        this.segments = [];
        this.container.appendChild(this.food.returnEl());
        this.food.update(this.elementWidth);
        
        this.segments.push(new Segment(Math.floor(this.map.returnWidth()/2),Math.floor(this.map.returnHeight()/2)));
        this.container.appendChild(this.segments[0].returnEl());
        this.segments[0].update(this.elementWidth);
        this.updateCounter();
    }
    updateCounter(){
        this.counter.innerHTML = this.segments.length-1;
    }
    eventListener(){
        window.addEventListener('keyup', (e)=>{
            switch(e.keyCode){    
            case 37:
                if(this.input != 2)
                    this.input = 0;
                break;
            case 38:
                if(this.input != 3)
                    this.input = 1;
                break;    
            case 39:
                if(this.input != 0)
                    this.input = 2;
                break;
            case 40:
                if(this.input != 1)
                    this.input = 3;
                break;
                
            }
        });
        this.startButton.addEventListener('click', (e)=>{
            this.start(); 
        });
    }
    start(){
        this.prepare();
        this.menu.className="snike_menu--hidden";
        this.loop();
    }
    stop(){
        clearInterval(this.interval);
        
        this.menu.className="snike_menu";
    }
    handeInput(){
        if(this.food.returnX()==this.segments[0].returnX() && this.food.returnY()==this.segments[0].returnY()){
            this.segments.push(new Segment(this.segments[this.segments.length-1].returnX(), this.segments[this.segments.length-1].returnY()));
            this.container.appendChild(this.segments[this.segments.length-1].returnEl());
            
            this.food.setPos(this.map.returnWidth(), this.map.returnHeight());
            this.food.update(this.elementWidth);
            this.updateCounter();
        }
        for(var i = this.segments.length-1; i>0; i--){
            this.segments[i].setPos(this.segments[i-1].returnX(),this.segments[i-1].returnY());
        }
        this.segments[0].changePos(dir[this.input][0], dir[this.input][1]);
    }
    update(){
        for(var i = 0; i<this.segments.length; i++){
            this.segments[i].update(this.elementWidth);
        }
        var stop = false;
        for(var i=1; i<this.segments.length; i++){
            if(this.segments[0].returnX()==this.segments[i].returnX() && this.segments[0].returnY()==this.segments[i].returnY()){
                stop = true;
            }
        }
        if(this.segments[0].returnX()<0 || this.segments[0].returnX()>=this.map.returnWidth() || this.segments[0].returnY()<0 || this.segments[0].returnY()>=this.map.returnHeight()){
            stop = true;
        }
        if(stop){
            this.stop();
        }
    }
    loop(){
        this.interval = window.setInterval(()=>{
            this.handeInput();
            this.update();
        }, this.speed);
    }
}

var snike = new Snike(document.querySelector('#snike'), document.querySelector("#snike_menu"), document.querySelector("#snike_counter"),
                      {size_x:21,
                       size_y:21,
                       el_width: 20,
                      speed: 120});