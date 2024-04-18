let header = `
            <link rel="shortcut icon" type="x-icon" href="../img/ICON.png">
            <header class="website-header">
                <div class="logo">
                    <a href="Home.html">
                        <img src="../img/ICON.png" alt="ICON eror path" width="70"/>
                    </a>
                    <h1>OnlineLibrary</h1>
                </div>

                <nav class="nav-links">
                    <ul>
                        <li><a href="Home.html">Home</a></li>
                        <li><a href="../HTML/all_books.html">Books</a></li>
                        <li>
                            <a href="../HTML/borrowed_books.html">borrowed books (User)</a>
                        </li>
                        <li>
                            <a href="../HTML/admin_book.html">list of added books (Admin)</a>
                        </li>
                        <li class="profile-icon"><a href="../HTML/profile.html"><img src="../img/man.png" alt="profile" width="30"></a></li>
                        <li><button class="login-btn" onclick="location.href='../HTML/Login.html'">Login</button></li>
                    </ul>
                </nav>

            </header>

            <div class="scroll-up" id="scroll-up">
                <img src="../img/arrow-up.svg" alt="">
            </div>
            `;
document.write(header);


let scroll_up = document.getElementById("scroll-up");
window.onscroll = function(){
    if(this.scrollY >= 600)
        scroll_up.classList.add("show");
    else
        scroll_up.classList.remove("show");
}

scroll_up.onclick = function(){
    window.scrollTo({top: 0, behavior: "smooth"})
}
