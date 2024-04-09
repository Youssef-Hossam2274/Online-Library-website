let header = `
            <header class="website-header">
                <div class="logo">
                    <a href="Home.html"
                        ><img src="../img/ICON.png" alt="ICON eror path" width="70"
                    /></a>
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
            `;
document.write(header);
