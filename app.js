const products=[
{id:1,name:"ক্লাসিক টি-শার্ট",category:"ফ্যাশন",price:399,old:599,emoji:"👕",tag:"জনপ্রিয়"},
{id:2,name:"ওয়্যারলেস ইয়ারবাড",category:"মোবাইল",price:899,old:1299,emoji:"🎧",tag:"ট্রেন্ডিং"},
{id:3,name:"ক্যাজুয়াল স্নিকার্স",category:"জুতা",price:1199,old:1599,emoji:"👟",tag:"নতুন"},
{id:4,name:"স্মার্টফোন কভার",category:"মোবাইল",price:249,old:399,emoji:"📱",tag:"দারুণ দাম"},
{id:5,name:"স্টাইলিশ ব্যাকপ্যাক",category:"ফ্যাশন",price:699,old:999,emoji:"🎒",tag:"জনপ্রিয়"},
{id:6,name:"ডেস্ক ল্যাম্প",category:"ঘর",price:549,old:799,emoji:"💡",tag:"ঘর সাজান"},
{id:7,name:"স্পোর্টস ক্যাপ",category:"ফ্যাশন",price:199,old:299,emoji:"🧢",tag:"বেস্ট সেলার"},
{id:8,name:"পানির বোতল",category:"ঘর",price:299,old:449,emoji:"🧴",tag:"দৈনন্দিন"}
];
let cart=JSON.parse(localStorage.getItem("ftmart-cart")||"[]"), category="সব", search="";
const $=id=>document.getElementById(id), money=n=>"₹"+n.toLocaleString("en-IN");
function save(){localStorage.setItem("ftmart-cart",JSON.stringify(cart));renderCart()}
function renderProducts(){
 const list=products.filter(p=>(category==="সব"||p.category===category)&&p.name.toLowerCase().includes(search.toLowerCase()));
 $("resultCount").textContent=list.length+"টি পণ্য";
 $("productGrid").innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-art">${p.emoji}</div><div class="product-info"><span class="tag">${p.tag} · ${p.category}</span><h3>${p.name}</h3><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span><button class="add-button" onclick="addToCart(${p.id})">＋ কার্টে যোগ করুন</button></div></article>`).join(""):'<p class="empty">কোনো পণ্য পাওয়া যায়নি। অন্য কিছু লিখে খুঁজুন।</p>';
}
function addToCart(id){let item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();toast("পণ্যটি কার্টে যোগ হয়েছে।")}
function changeQty(id,d){let item=cart.find(x=>x.id===id);if(!item)return;item.qty+=d;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save()}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(y=>y.id===x.id);return `<div class="cart-row"><span class="cart-emoji">${p.emoji}</span><div class="cart-row-info"><b>${p.name}</b><small>${money(p.price)} × ${x.qty}</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${x.qty}<button onclick="changeQty(${p.id},1)">＋</button></div></div>`}).join(""):'<p class="empty">আপনার কার্ট এখনো খালি।</p>';
 $("cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(){ $("cartDrawer").classList.add("open");$("overlay").classList.add("show")}
function closeCart(){ $("cartDrawer").classList.remove("open");$("overlay").classList.remove("show")}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
document.querySelectorAll(".categories button").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".categories .active").classList.remove("active");b.classList.add("active");category=b.dataset.category;renderProducts()}));
$("searchForm").addEventListener("submit",e=>{e.preventDefault();search=$("searchInput").value.trim();renderProducts()});
$("searchInput").addEventListener("input",()=>{search=$("searchInput").value.trim();renderProducts()});
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;
$("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length){toast("আগে কার্টে পণ্য যোগ করুন।");return}
 const name=$("customerName").value.trim(),phone=$("customerPhone").value.trim(),address=$("customerAddress").value.trim();
 const lines=cart.map(x=>{let p=products.find(y=>y.id===x.id);return `${p.name} × ${x.qty} = ${money(p.price*x.qty)}`});
 const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 const msg=`FT MART অর্ডার%0Aনাম: ${encodeURIComponent(name)}%0Aমোবাইল: ${encodeURIComponent(phone)}%0Aঠিকানা: ${encodeURIComponent(address)}%0A%0Aপণ্য:%0A${encodeURIComponent(lines.join("\n"))}%0Aমোট: ${money(total)}`;
 // Replace 91XXXXXXXXXX with the shop's WhatsApp number (country code + number, digits only).
 const shopWhatsApp="91XXXXXXXXXX";
 if(shopWhatsApp.includes("X")){toast("প্রথমে app.js ফাইলে আপনার WhatsApp নম্বর বসান।");return}
 window.open(`https://wa.me/${shopWhatsApp}?text=${msg}`,"_blank");
});
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();