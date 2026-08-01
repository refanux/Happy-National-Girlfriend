const btn = document.getElementById("openBtn");

const letter = document.querySelector(".letter");

const typing = document.getElementById("typing");

const text = `

Hai Sayang 🤍

Happy National Girlfriend Day.

Terima kasih sudah selalu ada.

Terima kasih sudah bertahan sampai hari ini.

Aku mungkin belum sempurna,

tapi aku akan terus belajar menjadi laki-laki terbaik untuk kamu.

Aku sayang kamu.

❤️

`;

btn.onclick=()=>{

letter.classList.remove("hidden");

type();

}

let i=0;

function type(){

if(i<text.length){

typing.innerHTML+=text.charAt(i);

i++;

setTimeout(type,40);

}

}

function createHeart(){

let heart=document.createElement("div");

heart.className="heart";

heart.innerHTML="🤍";

heart.style.left=Math.random()*100+"vw";

heart.style.animationDuration=Math.random()*3+3+"s";

heart.style.fontSize=Math.random()*20+15+"px";

document.body.appendChild(heart);

setTimeout(()=>heart.remove(),7000);

}

setInterval(createHeart,300);