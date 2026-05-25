/* =========================================================
   UTILITY
   ========================================================= */
function copyText(text){
    navigator.clipboard.writeText(text)
        .then(()=>alert("Скопійовано: "+text))
        .catch(err=>console.error(err));
}

/* =========================================================
   HOVER GIF ICONS
   ========================================================= */
document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll(".card-icon").forEach(icon=>{
        const gif      = icon.dataset.gif;
        const original = icon.src;
        const parent   = icon.closest(".section-card");
        if(!parent) return;
        parent.addEventListener("mouseenter",()=>{ icon.src=gif; });
        parent.addEventListener("mouseleave",()=>{ icon.src=original; });
    });
});

/* =========================================================
   ACCOUNT SYSTEM
   ========================================================= */
function openAuth(){
    document.getElementById("authModal").style.display="flex";
}
function closeAuth(){
    document.getElementById("authModal").style.display="none";
}

function updateAuthUI(){
    const user        = localStorage.getItem("currentUser");
    const navLink     = document.getElementById("navAccountLink");
    const userGreeting= document.getElementById("userGreeting");

    if(user){
        if(navLink)      navLink.textContent = user;
        if(userGreeting) userGreeting.textContent = "👤 " + user;

        ["logoutBtnLogin","logoutBtnRegister"].forEach(id=>{
            const el=document.getElementById(id);
            if(el) el.style.display="block";
        });
        const userPanel=document.getElementById("userPanel");
        if(userPanel) userPanel.style.display="block";

    }else{
        if(navLink) navLink.textContent="Акаунт";

        ["logoutBtnLogin","logoutBtnRegister"].forEach(id=>{
            const el=document.getElementById(id);
            if(el) el.style.display="none";
        });
        const userPanel=document.getElementById("userPanel");
        if(userPanel) userPanel.style.display="none";

        const loginForm    = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");
        const tabLogin     = document.getElementById("tabLogin");
        const tabRegister  = document.getElementById("tabRegister");

        if(loginForm){
            loginForm.style.display="block";
            loginForm.classList.add("slide-in");
            loginForm.classList.remove("slide-out-left");
        }
        if(registerForm){
            registerForm.style.display="none";
            registerForm.classList.remove("slide-in");
            registerForm.classList.add("slide-out-right");
        }
        if(tabLogin)    tabLogin.classList.add("active");
        if(tabRegister) tabRegister.classList.remove("active");
    }
}

function showLogin(){
    const login    = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");
    const tabLogin    = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    if(login.style.display !== "none") return;
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    register.classList.remove("slide-in");
    register.classList.add("slide-out-right");
    setTimeout(()=>{
        register.style.display="none";
        login.style.display="block";
        login.classList.remove("slide-in","slide-out-left");
        void login.offsetWidth;
        login.classList.add("slide-in");
    }, 300);
}

function showRegister(){
    const login    = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");
    const tabLogin    = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    if(register.style.display !== "none") return;
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    login.classList.remove("slide-in");
    login.classList.add("slide-out-left");
    setTimeout(()=>{
        login.style.display="none";
        register.style.display="block";
        register.classList.remove("slide-in","slide-out-right");
        void register.offsetWidth;
        register.classList.add("slide-in");
    }, 300);
}

function register(){
    const u  = document.getElementById("regUser").value.trim();
    const p  = document.getElementById("regPass").value;
    const p2 = document.getElementById("regPass2").value;
    if(!u || !p){ alert("Заповніть всі поля"); return; }
    if(p !== p2){ alert("Паролі не співпадають"); return; }
    let users = JSON.parse(localStorage.getItem("users")||"{}");
    if(users[u]){ alert("Такий користувач вже існує"); return; }
    users[u] = p;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Реєстрація успішна! Тепер увійдіть.");
    showLogin();
}

function login(){
    const u = document.getElementById("loginUser").value.trim();
    const p = document.getElementById("loginPass").value;
    let users = JSON.parse(localStorage.getItem("users")||"{}");
    if(users[u] && users[u] === p){
        localStorage.setItem("currentUser", u);
        closeAuth();
        updateAuthUI();
        // refresh any open modal review sections
        if(window._currentModalId) renderReviews(window._currentModalId, window._currentModalType);
    }else{
        alert("Невірний логін або пароль");
    }
}

function logout(){
    localStorage.removeItem("currentUser");
    closeAuth();
    updateAuthUI();
}

function togglePass(id){
    const input = document.getElementById(id);
    input.type  = (input.type === "password") ? "text" : "password";
}

document.addEventListener("DOMContentLoaded", function(){
    updateAuthUI();
});

/* =========================================================
   MUSIC PAGE
   ========================================================= */
function toggleMusic(wrapper){
    const user = localStorage.getItem("currentUser");
    if(!user){
        showLoginPrompt();
        return;
    }
    const isOpen = wrapper.classList.contains("open");
    document.querySelectorAll(".music-wrapper.open").forEach(w=>{
        const audio = w.querySelector("audio");
        if(audio) audio.pause();
        w.classList.remove("open");
    });
    if(!isOpen){
        wrapper.classList.add("open");
        const id = wrapper.dataset.id;
        if(id) renderReviews(id, "music");
    }
}

/* =========================================================
   BOOK PAGE
   ========================================================= */
function toggleBook(wrapper){
    const isOpen = wrapper.classList.contains("open");
    document.querySelectorAll(".book-wrapper.open").forEach(w=>{
        w.classList.remove("open");
    });
    if(!isOpen){
        wrapper.classList.add("open");
        const id = wrapper.dataset.id;
        if(id){
            renderReviews(id, "book");
            renderBookBuyArea(wrapper);
        }
    }
}

/* =========================================================
   TRANSPARENT HEADER SCROLL
   ========================================================= */
document.addEventListener("DOMContentLoaded",function(){
    const header = document.querySelector("header");
    if(!header) return;
    function checkScroll(){
        if(window.scrollY > 10) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
    }
    window.addEventListener("scroll", checkScroll, {passive:true});
    checkScroll();
});

/* =========================================================
   BURGER MENU (mobile)
   ========================================================= */
document.addEventListener("DOMContentLoaded", function(){
    const nav = document.querySelector(".nav");
    if(!nav) return;

    const burger = document.createElement("button");
    burger.className = "burger";
    burger.setAttribute("aria-label","Меню");
    burger.innerHTML = "<span></span><span></span><span></span>";
    nav.appendChild(burger);

    const overlay = document.createElement("div");
    overlay.className = "mobile-nav-overlay";

    const menuItems = document.querySelectorAll(".menu li");
    menuItems.forEach(li => {
        const a = li.querySelector("a");
        if(!a) return;
        const link = document.createElement("a");
        link.href      = a.href;
        link.textContent = a.textContent.trim();
        if(a.id === "navAccountLink"){
            link.id = "mobileNavAccountLink";
            link.href = "#";
            link.addEventListener("click", function(e){
                e.preventDefault();
                closeOverlay();
                openAuth();
            });
        }
        overlay.appendChild(link);
    });

    document.body.appendChild(overlay);

    function openOverlay(){
        burger.classList.add("active");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function closeOverlay(){
        burger.classList.remove("active");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    burger.addEventListener("click", function(){
        overlay.classList.contains("open") ? closeOverlay() : openOverlay();
    });

    overlay.querySelectorAll("a:not(#mobileNavAccountLink)").forEach(a => {
        a.addEventListener("click", closeOverlay);
    });

    const origObserver = new MutationObserver(function(){
        const orig = document.getElementById("navAccountLink");
        const mob  = document.getElementById("mobileNavAccountLink");
        if(orig && mob) mob.textContent = orig.textContent;
    });
    const navAccountLink = document.getElementById("navAccountLink");
    if(navAccountLink){
        origObserver.observe(navAccountLink, {childList:true, characterData:true, subtree:true});
    }
});

/* =========================================================
   ITEM MODAL (Art / Photo / Music / Book)
   ========================================================= */
window._currentModalId   = null;
window._currentModalType = null;

function openItemModal(id, type, mediaSrc, author, desc, audioSrc){
    window._currentModalId   = id;
    window._currentModalType = type;

    const modal     = document.getElementById("itemModal");
    const imgEl     = modal.querySelector(".im-img");
    const audioWrap = modal.querySelector(".im-audio-wrap");

    imgEl.style.display = "";
    imgEl.src = mediaSrc || "";
    if(audioWrap) audioWrap.innerHTML = "";

    if(type === "music"){
        imgEl.style.display = "none";
        if(audioWrap){
            if(audioSrc){
                audioWrap.innerHTML = `<audio class="im-audio" controls src="${audioSrc}"></audio>`;
                const audioEl = audioWrap.querySelector("audio");
                if(audioEl) audioEl.volume = 0.5;
            } else {
                audioWrap.innerHTML = `<div class="im-audio-placeholder">🎧 Аудіо буде додано пізніше</div>`;
            }
        }
    }

    modal.querySelector(".im-author").textContent = author;
    modal.querySelector(".im-desc").textContent   = desc;

    renderReviews(id, type);
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeItemModal(){
    const modal = document.getElementById("itemModal");
    const audio = modal ? modal.querySelector("audio") : null;
    if(audio){ audio.pause(); audio.src = ""; }
    if(modal) modal.style.display = "none";
    document.body.style.overflow = "";
    window._currentModalId   = null;
    window._currentModalType = null;
}

// Close on backdrop click
document.addEventListener("DOMContentLoaded", function(){
    const modal = document.getElementById("itemModal");
    if(!modal) return;
    modal.addEventListener("click", function(e){
        if(e.target === modal) closeItemModal();
    });
});

/* =========================================================
   REVIEW SYSTEM (shared for all pages)
   ========================================================= */

// Storage key: reviews__{type}__{id}  → object { username: {rating, comment} }
function getReviews(id, type){
    const key = "reviews__"+type+"__"+id;
    return JSON.parse(localStorage.getItem(key)||"{}");
}
function saveReviews(id, type, data){
    const key = "reviews__"+type+"__"+id;
    localStorage.setItem(key, JSON.stringify(data));
}

function renderReviews(id, type){
    const container = document.querySelector("#itemModal .review-section");
    if(!container) return;

    const user    = localStorage.getItem("currentUser");
    const reviews = getReviews(id, type);
    const existing = user ? reviews[user] : null;

    // Build rating stars row
    const selectedRating = existing ? existing.rating : 0;
    let starsHTML = '<div class="rating-row">';
    for(let i=1;i<=10;i++){
        starsHTML += `<span class="rating-num${i<=selectedRating?' selected':''}" data-val="${i}" 
            onmouseenter="highlightRating(this)" onmouseleave="resetRating(this,'${id}','${type}')"
            onclick="selectRating(this,'${id}','${type}')">${i}</span>`;
    }
    starsHTML += '</div>';

    const formHTML = user ? `
        <div class="review-form">
            <p class="review-form-title">${existing ? 'Ваш відгук (редагувати):' : 'Залишити відгук:'}</p>
            ${starsHTML}
            <textarea class="review-textarea" id="reviewText_${type}_${id}" 
                placeholder="Ваш коментар...">${existing ? existing.comment : ''}</textarea>
            <div class="review-actions">
                <button class="review-submit-btn" onclick="submitReview('${id}','${type}')">
                    ${existing ? 'Оновити відгук' : 'Надіслати відгук'}
                </button>
                ${existing ? `<button class="review-delete-btn" onclick="deleteReview('${id}','${type}')">🗑 Видалити</button>` : ''}
            </div>
        </div>
    ` : `
        <div class="review-login-prompt">
            <p>Щоб залишити відгук, потрібно <strong>увійти в акаунт</strong>.</p>
            <button class="review-login-btn" onclick="openAuth()">Увійти / Зареєструватись</button>
        </div>
    `;

    // List reviews
    const entries = Object.entries(reviews);
    let listHTML = '<div class="reviews-list">';
    if(entries.length === 0){
        listHTML += '<p class="no-reviews">Ще немає відгуків. Будьте першим!</p>';
    } else {
        entries.forEach(([username, rv])=>{
            const stars = Array.from({length:10}, (_,i) =>
                `<span class="rating-num-display${i < rv.rating ? ' selected' : ''}">${i+1}</span>`
            ).join('');
            listHTML += `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user">👤 ${username}</span>
                    <span class="review-rating">⭐ ${rv.rating}/10</span>
                </div>
                <div class="rating-row-display">${stars}</div>
                ${rv.comment ? `<p class="review-comment">${rv.comment}</p>` : ''}
            </div>`;
        });
    }
    listHTML += '</div>';

    container.innerHTML = `
        <h4 class="reviews-title">Відгуки</h4>
        ${formHTML}
        ${listHTML}
    `;
}

function highlightRating(el){
    const val = parseInt(el.dataset.val);
    const row = el.closest(".rating-row");
    row.querySelectorAll(".rating-num").forEach(n=>{
        n.classList.toggle("hover", parseInt(n.dataset.val) <= val);
    });
}

function resetRating(el, id, type){
    const row = el.closest(".rating-row");
    // Use temp DOM selection if user clicked but hasn't submitted yet
    const tempSelected = row.dataset.selected ? parseInt(row.dataset.selected) : 0;
    const reviews = getReviews(id, type);
    const user = localStorage.getItem("currentUser");
    const existing = user ? reviews[user] : null;
    const selectedRating = tempSelected || (existing ? existing.rating : 0);
    row.querySelectorAll(".rating-num").forEach(n=>{
        n.classList.remove("hover");
        n.classList.toggle("selected", parseInt(n.dataset.val) <= selectedRating);
    });
}

function selectRating(el, id, type){
    const val = parseInt(el.dataset.val);
    const row = el.closest(".rating-row");
    // store temporarily in DOM
    row.dataset.selected = val;
    row.querySelectorAll(".rating-num").forEach(n=>{
        n.classList.toggle("selected", parseInt(n.dataset.val) <= val);
        n.classList.remove("hover");
    });
}

function submitReview(id, type){
    const user = localStorage.getItem("currentUser");
    if(!user){ openAuth(); return; }

    const container = document.querySelector("#itemModal .review-section");
    const row = container.querySelector(".rating-row");
    const rating = parseInt(row ? row.dataset.selected || 
        [...row.querySelectorAll(".rating-num.selected")].length : 0);
    const comment = (document.getElementById("reviewText_"+type+"_"+id)||{}).value || "";

    if(!rating){ alert("Будь ласка, оберіть оцінку від 1 до 10."); return; }

    const reviews = getReviews(id, type);
    reviews[user] = { rating, comment: comment.trim() };
    saveReviews(id, type, reviews);
    renderReviews(id, type);
}

function deleteReview(id, type){
    const user = localStorage.getItem("currentUser");
    if(!user) return;
    if(!confirm("Видалити ваш відгук?")) return;
    const reviews = getReviews(id, type);
    delete reviews[user];
    saveReviews(id, type, reviews);
    renderReviews(id, type);
}

/* =========================================================
   LOGIN PROMPT MODAL
   ========================================================= */
function showLoginPrompt(){
    document.getElementById("loginPromptModal").style.display="flex";
}
function closeLoginPrompt(){
    document.getElementById("loginPromptModal").style.display="none";
}

document.addEventListener("DOMContentLoaded", function(){
    const lp = document.getElementById("loginPromptModal");
    if(!lp) return;
    lp.addEventListener("click", function(e){
        if(e.target === lp) closeLoginPrompt();
    });
});

/* =========================================================
   BOOK BUY LINKS — render per-book based on login state
   (Called from toggleBook, or when user logs in)
   Add book buy links here: bookBuyLinks['1'] = { url, label }
   ========================================================= */
const bookBuyLinks = {
    // '1': { url: 'https://example.com', label: '📖 Читати онлайн' },
};

function renderBookBuyArea(wrapper){
    const id = wrapper.dataset.id;
    const area = wrapper.querySelector(".book-buy-area");
    if(!area) return;
    const user = localStorage.getItem("currentUser");
    if(!user){
        area.innerHTML = '<span class="book-buy-locked">🔒 Увійдіть, щоб отримати посилання для читання/купівлі</span>';
        return;
    }
    const linkData = bookBuyLinks[id];
    if(linkData){
        area.innerHTML = `<a href="${linkData.url}" class="book-buy-link" target="_blank">${linkData.label}</a>`;
    } else {
        area.innerHTML = '<span class="book-buy-locked" style="color:rgba(125,157,139,.5)">Посилання буде додано пізніше</span>';
    }
}