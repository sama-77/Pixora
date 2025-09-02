(function(){
  const grayLayer=document.querySelector(".gray-layer");
let loading=false;
let sorasArray=[];
let currentIndex=0;
const titleRemovableWords=["of", "the", "a", "an", "in", "on", "at", "with"];
let favImageList=[];
const currentPage = window.location.pathname.split("/").pop();
const selectedImg=document.querySelector(".selected-img img");
let darkMode=false;
const col1=document.getElementById("column1");
const col2=document.getElementById("column2");
const col3=document.getElementById("column3");
const col4=document.getElementById("column4");
const columns=[col1,col2,col3,col4];
let clear=true;
let currentQuery="random";



//activeClass
const items=document.querySelectorAll(".header-ul .header-li a i");
items.forEach(item => {
  item.addEventListener("click",function()
{
  items.forEach(item=>{
    item.classList.remove("active");
  })
  this.classList.add("active");
})
  
});
//homeIcon
const homeIcon=document.querySelector("#home");
homeIcon.classList.add("active");
homeIcon.addEventListener("click",getImage);





//darkMode
const mode=document.getElementById("mode");
mode.addEventListener("click",function(){

  darkMode=!darkMode;
  let moonIcon=document.querySelector("#mode i");
  document.body.classList.toggle("dark-mode");
  let header=document.querySelector("header");
  header.classList.toggle("dark-mode");
  let list=document.querySelector(".nav-ul")
  list.classList.toggle("dark-mode");
  header.classList.toggle("d-shadow");
  moonIcon.classList.toggle("active");
  moonIcon.classList.toggle("fa-solid");
  document.querySelectorAll(".fav,.download,.liked-msg").forEach(el=>{
    
    if(darkMode) el.classList.add("dark-mode");
    else el.classList.remove("dark-mode");

  })
  document.querySelectorAll("#prev,#next").forEach(el=>{ if(darkMode) el.classList.add("dark-arrow");
    else el.classList.remove("dark-arrow");})

});

//loadMoreImgs
async function loadMore()
{
    window.addEventListener("scroll",function(){
        if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100 && !loading) 
        {
            getImage(currentQuery,false);
        }


    })
}
//getImgs
async function getImage(query="random" , clear=true)
{

 
  currentQuery=query;
  if(loading) return;
  loading=true;
  if(clear) columns.forEach(col => col.innerHTML = "");
  let API =`https://api.unsplash.com/photos/random?count=30&query=${encodeURIComponent(query)}&client_id=7cz_YTwfcBbBFPpSQUMlKPQ-qqIt-1WhA373pptb10U`;
  let response=await fetch(API);
  let finalResponse=await response.json();
  if(parseInt(response.headers.get("X-Ratelimit-Remaining"))===0)
  {
    API=`https://api.unsplash.com/photos/random?count=30&query=${encodeURIComponent(query)}&client_id=21_Y3On97LbxVISNuG9X9bu3pcAFQPWaSsnALH8w36o`;
    response=await fetch(API);
    finalResponse=await response.json();
  }

  await displayImg(finalResponse,columns,selectedImg);

  loading=false;

};

//displayImg
function displayImg(data,columns,selectedImg)
{
    for(let i=0 ;i<data.length;i++)
  {

  let sora=document.createElement("div")
  sora.className="sora";

  const placeholder=document.createElement("div");
  placeholder.className="placeholder";
  sora.appendChild(placeholder)

  let img=document.createElement("img");
  img.src=data[i].urls.regular;

    img.onload=function()
  {
    placeholder.remove();
    img.style.opacity="1";
  };

  sora.appendChild(img);


  let transparentLayer=document.createElement("div");
  transparentLayer.className=("transparentLayer");

  let upSection = document.createElement("div");
  upSection.className = "up-section flex";

  let fav = document.createElement("div");
  fav.className = "fav squared-background";
  if(darkMode)
  {
    fav.classList.add("dark-mode");
  }else
  {
    fav.classList.remove("dark-mode");
  }
  let favIcon = document.createElement("i");
  favIcon.className = "fa-solid fa-heart";
  fav.appendChild(favIcon);

  let favMsg=document.createElement("span");
  favMsg.className="liked-msg";
  favMsg.textContent="Liked ❤️!";
  if(darkMode)
  {
    favMsg.classList.add("dark-mode");
  }else
  {
    favMsg.classList.remove("dark-mode");
  }

  fav.appendChild(favMsg);

  let isliked=false;

  
        let id=data[i].id;
        for(let i=0 ;i<favImageList.length;i++)
        {
          if(id == favImageList[i].id )
          {
            favIcon.style.color="red";
          }
        }

  favIcon.addEventListener("click" , function(){

    isliked=!isliked;
    if(isliked)
    {
    favIcon.style.color="red";
    favImageList.push(data[i]);
    localStorage.setItem("favImgs",JSON.stringify(favImageList));
        favMsg.textContent = "Liked ❤️!";
        favMsg.style.display = "block";

    }
    else
    {
      favIcon.style.color="";
      favImageList=favImageList.filter(img=>img.id!==data[i].id);
      localStorage.setItem("favImgs",JSON.stringify(favImageList));
        favMsg.textContent = "Removed 💔";
        favMsg.style.display = "block";
        if(heart.classList.contains("active"))
        {


          let card = favIcon.closest(".sora"); 
          if(card) card.remove();
        }

    }
            setTimeout(function(){
      favMsg.style.display="none";

    }, 1500)


    
  });



  favIcon.addEventListener("mouseover", function(){
    if(isliked) favMsg.style.display="block";
    
  })
  favIcon.addEventListener("mouseleave", function(){
    favMsg.style.display="none";
  })


if(heart.classList.contains("active"))
{
  favIcon.style.color="red";
}

if(favImageList.find(img => img.id === data[i].id))
{
  favIcon.style.color="red";
}



  upSection.appendChild(fav);
  // upSection.appendChild(add);


  let downSection = document.createElement("div");
  downSection.className = "down-section flex";

  let title = document.createElement("div");
  title.className = "title";

  let str=data[i].alt_description;
  let regex= new RegExp(`\\b(${titleRemovableWords.join("|")})\\b`,"gi");
  let newStr=str.replace(regex,"").replace(/\s+/g, " ").trim();
  
  title.textContent = newStr;

  let download = document.createElement("div");
  download.className = "download squared-background";
    if(darkMode)
  {
    download.classList.add("dark-mode");
  }else
  {
    download.classList.remove("dark-mode");
  }
  let downloadIcon = document.createElement("i");
  downloadIcon.className = "fa-solid fa-arrow-down fa-fw";
  download.appendChild(downloadIcon);


  downSection.appendChild(title);
  downSection.appendChild(download);




  let downloadingMsg=document.createElement("span");
  downloadingMsg.className="liked-msg";
  downloadingMsg.textContent="downloading...";
  download.appendChild(downloadingMsg);
  if(darkMode)
  {
    downloadingMsg.classList.add("dark-mode");
  }else
  {
    downloadingMsg.classList.remove("dark-mode");
  }
  download.addEventListener("click",function(){

    fetch(data[i].links.download_location, {
    headers: {
    Authorization: "Client-ID 21_Y3On97LbxVISNuG9X9bu3pcAFQPWaSsnALH8w36o"
  }
});


    setTimeout(function(){
      downloadingMsg.style.display="block";

    }, 1000)

    setTimeout(function(){
      downloadingMsg.style.display="none";

    }, 4000)

 fetch(data[i].urls.full)
    .then(res => res.blob())
    .then(blob => {
      let url = URL.createObjectURL(blob);
      let anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `photo_${i}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url); 
    });

})

  
  transparentLayer.appendChild(upSection);
  transparentLayer.appendChild(downSection);
  sora.appendChild(transparentLayer);


  let colIndex=i%4;
  columns[colIndex].appendChild(sora);

  sora.addEventListener("click" , function(e)
  {
        if (e.target.closest(".fav") || e.target.closest(".add") || e.target.closest(".download")) return; 
    let img=sora.querySelector("img");
    grayLayer.style.display="flex";
    document.body.style.overflow="hidden";
    let imgSrc=img.src;
    sorasArray=Array.from(document.querySelectorAll(".sora"));
    selectedImg.src=imgSrc;
    currentIndex=sorasArray.indexOf(sora);
  });
  

}
}

//whatQuery
let category=document.querySelectorAll(".nav-li a");
category.forEach(cat =>{
  cat.addEventListener("click",async function () {
    let query=cat.textContent.trim();
    await getImage(query,true);
    
  });

});
//inrementDecrementFunction
function slid(x)
{
    currentIndex+=x;
    if(currentIndex >= sorasArray.length) currentIndex=0;
    if (currentIndex < 0) currentIndex=sorasArray.length -1;
    let nextImg=sorasArray[currentIndex].querySelector("img");
    selectedImg.src=nextImg.src;
}

//sliderArrows
let prevArrow=document.getElementById("prev")
let nextArrow=document.getElementById("next")
nextArrow.addEventListener("click", function(e){
  if(darkMode)
  {
    nextArrow.classList.add("dark-arrow");
  }else{ nextArrow.classList.remove("dark-arrow");}

  slid(1);

})
prevArrow.addEventListener("click", function(e){
  if(darkMode)
  {
    prevArrow.classList.add("dark-mode-arrow");
  }
  else
  {
    prevArrow.classList.remove("dark-mode-arrow")
  };
  slid(-1);
})

//keyboardSliding
document.addEventListener("keydown",function(e)
  {
    if(grayLayer.style.display=="flex")
      {
         if(e.key==="ArrowLeft" || e.key==="ArrowRight")
          {
             e.key=="ArrowLeft"? slid(-1) : slid(1);
          }
          else if (e.key==="Escape")
          {
            grayLayer.style.display="none";
            document.body.style.overflow="auto";
          }
      }
  }
);



//grayLayerUnderViewUp
grayLayer.addEventListener("click",function(e)
  {

    if(e.target === grayLayer)
    {

    grayLayer.style.display="none";
    document.body.style.overflow="auto";
    }

});

//navList
const categories=document.querySelector(".nav-list");
const navIcon=document.getElementById("nav");
let clicked=false

navIcon.addEventListener("mouseenter",function(){if(!clicked)categories.classList.add("show")});
categories.addEventListener("mouseenter",function(){if(!clicked)categories.classList.add("show")});
navIcon.addEventListener("mouseleave",function(){if(!clicked)categories.classList.remove("show")});
categories.addEventListener("mouseleave" ,function(){if(!clicked)categories.classList.remove("show")});
navIcon.addEventListener("click" ,function(){ clicked=!clicked;
  if(clicked)
    {
      categories.classList.add("show");


      
    
    }
  else 
    {categories.classList.remove("show");

    }
      });



//displayFav
let heart=document.getElementById("heart");
heart.addEventListener("click", function()
{
    columns.forEach(col => col.innerHTML = "");
    let getFavImg=JSON.parse(localStorage.getItem("favImgs"));
    displayImg(getFavImg,columns,selectedImg); 
});

//pinclick

let pin=document.querySelector(".pin");
pin.addEventListener("click" ,function(){
  clicked=!clicked;
  if(clicked)
  {

  
    pin.style.color="black";
    pin.style.webtikTextStroke="black";
     document.querySelector("header").style.position="static";
      document.querySelector(".grid").style.paddingTop="20px";
      if(darkMode)
      {
        pin.style.color="#e0e0e0";
        pin.style.webtikTextStroke="#e0e0e0";

      }
  

  }
  else
  {

  document.querySelector("header").style.position="fixed";
  document.querySelector("header").style.zIndex="99999";
  document.querySelector("header").style.right="0";
  document.querySelector("header").style.left="0";
  document.querySelector(".grid").style.paddingTop="100px";
  pin.style.color="#f88ea4";
  pin.style.webtikTextStroke="#f88ea4";
        if(darkMode)
      {
          pin.style.color="#f88ea4";
  pin.style.webtikTextStroke="#f88ea4";
      }


  }

});



//self invoked function
(async function(){
  await getImage("random",true);
  await loadMore();
})();
 

})();





























































