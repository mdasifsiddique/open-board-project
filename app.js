let optionsCont=document.querySelector(".options-cont");
let toolCont=document.querySelector(".tools-cont");
let pencilCont=document.querySelector(".pencil-tool-cont");
let eraserCont=document.querySelector(".eraser-tool-cont");
let pencilTool=document.querySelector(".pencil");
let eraserTool=document.querySelector(".eraser");
let sticky=document.querySelector(".sticky");
let upload=document.querySelector(".upload");
let download=document.querySelector(".download");
let redo=document.querySelector(".redo");
let undo=document.querySelector(".undo");
    //canvas
let canvasBoard=document.querySelector("canvas");
let pencilColor=document.querySelectorAll(".pencil-color");
let pencilWidthElem=document.querySelector(".pencil-width");
let eraserWidthElem=document.querySelector(".eraser-width");

let penColor="balck";
let eraserColor="white";
let penWidth=pencilWidthElem.value;
let eraserWidth=eraserWidthElem.value;

//undo redo

let undoRedoTracker=[];
let track=0;


//Flags
let optionFlag=false;
let pencilFlag=false;
let eraserFlag=false;
let mousedown=false;

canvasBoard.height = window.innerHeight;
 canvasBoard.width = window.innerWidth;
let tool=canvasBoard.getContext("2d");
let cTool="rectTool";
tool.strokeStyle="black";
tool.lineWidth="3";

optionsCont.addEventListener("click",(e)=>{
    optionFlag=!optionFlag;
        if(optionFlag){
            
        openTools();
        }else{
          
        closeTools();
        }

});

function openTools(){
    let iconItem=optionsCont.children[0];
    iconItem.classList.remove("fa-bars");
    iconItem.classList.add("fa-times");
    toolCont.style.display="flex";

}

function closeTools(){
    let iconItem=optionsCont.children[0];
    iconItem.classList.remove("fa-times");
    iconItem.classList.add("fa-bars"); 
    toolCont.style.display="none";
    pencilCont.style.display="none";
    eraserCont.style.display="none";
}

pencilTool.addEventListener("click",(e)=>{
    cTool="pencilToolElem";
    pencilFlag=!pencilFlag;
    if(pencilFlag){
        pencilCont.style.display="block";
        eraserCont.style.display="none";
        eraserFlag=false;

    }else{
        pencilCont.style.display="none";
    }
})


canvasBoard.addEventListener("mousedown",(e)=>{
    if(cTool==='pencilToolElem'){
        mousedown=true;
        tool.beginPath();
        tool.moveTo(e.clientX,e.clientY);
    }
})

canvasBoard.addEventListener("mousemove",(e)=>{
    if(mousedown){
        tool.lineTo(e.clientX,e.clientY);
        tool.stroke();
    }
})

canvasBoard.addEventListener("mouseup",(e)=>{
    mousedown=false;
    let url=canvasBoard.toDataURL(); //this returns and image
    undoRedoTracker.push(url); //image pushed
    track=undoRedoTracker.length-1;
})

eraserTool.addEventListener("click",(e)=>{
   eraserFlag=!eraserFlag
    if(eraserFlag){
       eraserCont.style.display="flex";
       pencilCont.style.display="none";
       pencilFlag=false;
       tool.strokeStyle=eraserColor;
       tool.lineWidth=eraserWidth;

    }else{
        eraserCont.style.display="none";
        tool.strokeStyle=penColor;
        tool.lineWidth=penWidth;
        cTool='pencilToolElem';
        
    }
})

sticky.addEventListener("click",(e)=>{
    let stickyCont=document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML=`
            <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
            </div>
             <div class="note-cont">
                <textarea spellcheck="false"></textarea>
            </div>
    `
    document.body.appendChild(stickyCont);

    //Minimize and remove logic

    let minimize=stickyCont.querySelector(".minimize");
    let remove=stickyCont.querySelector(".remove");
    noteAction(minimize,remove,stickyCont);

//    Drag and drop

    stickyCont.onmousedown = function(event) {

        dragAndDrop(stickyCont,event)
      
      };
      
      stickyCont.ondragstart = function() {
        return false;
      };

})

upload.addEventListener("click",(e)=>{
    let input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file=input.files[0];
        let url=URL.createObjectURL(file);


        //new Sticky

        let stickyCont=document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML=`
            <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
            </div>
             <div class="note-cont">
                <img src="${url}">
            </div>
    `
    document.body.appendChild(stickyCont);

    //Minimize and remove logic

    let minimize=stickyCont.querySelector(".minimize");
    let remove=stickyCont.querySelector(".remove");
    noteAction(minimize,remove,stickyCont);

//    Drag and drop

    stickyCont.onmousedown = function(event) {

        dragAndDrop(stickyCont,event)
      
      };
      
      stickyCont.ondragstart = function() {
        return false;
      };








    })
})

pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        let color=colorElem.classList[0];
        penColor=color;
        tool.strokeStyle=penColor;
    })
})

pencilWidthElem.addEventListener("change",(e)=>{
    penWidth=pencilWidthElem.value;
    tool.lineWidth=penWidth;
})

eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth=eraserWidthElem.value;
    tool.lineWidth=eraserWidth;
})

download.addEventListener("click",(e)=>{
    let url=canvasBoard.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})

undo.addEventListener("click",(e)=>{
    if(track>0){
        track--;
    }
    let trackObj={trackValue:track,
    undoRedoTracker};
    undoRedoFunction(trackObj);
});
redo.addEventListener("click",(e)=>{
    if(track<undoRedoTracker.length-1){
        track++;
    }
    let trackObj={trackValue:track,
    undoRedoTracker};
    undoRedoFunction(trackObj);
});

function undoRedoFunction(trackObj){
    track=trackObj.trackValue;
    undoRedoTracker=trackObj.undoRedoTracker;
    let img=new Image();
    let url=undoRedoTracker[track];
    img.src=url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvasBoard.width,canvasBoard.height)
    }
}

function noteAction(minimize,remove,stickyCont){
    //remove

    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    })

    //minimze

    minimize.addEventListener("click",(e)=>{
        let noteCont=stickyCont.querySelector(".note-cont");
        let display=getComputedStyle(noteCont).getPropertyValue("display");
        if(display==="none"){
            noteCont.style.display="block";
        }
        else{
            noteCont.style.display="none";
        }
    })
}

function dragAndDrop(element,event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
      
        moveAt(event.pageX, event.pageY);
      
        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the ball, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };

}
