// =========================================
// ANIMASI GSAP & SCROLLTRIGGER
// =========================================
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Efek melayang halus pada gambar
    gsap.to(".paper-plane img", {
        y: -12,
        rotation: 2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".dove img", {
        y: -14,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Pesawat terbang ke kanan saat di-scroll
    gsap.to(".paper-plane", {
        x: () => window.innerWidth * 0.8,
        y: -150,
        rotation: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "center top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Burung merpati terbang ke kiri saat di-scroll
    gsap.to(".dove", {
        x: () => -window.innerWidth * 0.6,
        y: -120,
        rotation: -10,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "15% top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Bunga tertiup angin
    gsap.to(".daisy img", {
        rotation: 8,
        transformOrigin: "bottom center",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// =========================================
// LOGIKA POPUP INTERAKTIF
// =========================================
const popupData = {
    plane: `
        <div class="modal-top-header">
            <img src="assets/images/pesawat_kertas.png" alt="Paper Plane">
            <span class="modal-kicker">WHERE IT BEGAN</span>
        </div>

        <div class="weekly-list">
            <div class="weekly-item">
                <div class="weekly-day">2007 — 2012</div>
                <div class="weekly-detail">
                    <h3>Our First Flight</h3>
                    <p>Ini bukanlah kisah seribu satu malam. Penempatan balok pertama Youth English Society dimulai sejak tahun 2007. Awalnya Youth English Society hanyalah sebuah komunitas debat bahasa Inggris. Namun, karena semangat yang luar biasa dari para dosen dan mahasiswa, pada tanggal 4 September 2012, pilar pertamanya pun diresmikan sebagai Unit Kegiatan Mahasiswa.</p>
                    <span class="time-badge"><i class="fa-solid fa-paper-plane"></i> Diresmikan 4 September 2012</span>
                </div>
            </div>

            <div class="weekly-item">
                <div class="weekly-day">Fondasi<br>Utama</div>
                <div class="weekly-detail">
                    <h3>Satu-Satunya UKM Bahasa di UNIKOM</h3>
                    <p>UKM YES adalah satu-satunya UKM berbasis bahasa di UNIKOM. Kami berdiri dengan fondasi yang sangat kuat, yaitu Pancasila, rasa Kekeluargaan, dan tentu saja pedoman kampus kita tercinta, PIQIE (Professionalism, Integrity, Quality, Information Technology, and Excellence).</p>
                    <span class="time-badge"><i class="fa-solid fa-award"></i> PIQIE &amp; Kekeluargaan</span>
                </div>
            </div>
        </div>
    `,

    dove: `
        <div class="modal-top-header">
            <img src="assets/images/burung_merpati.png" alt="Flying Dove">
            <span class="modal-kicker">OUR LITTLE WORLD</span>
        </div>

        <div class="weekly-list">
            <div class="weekly-item">
                <div class="weekly-day">3 Pilar<br>Utama</div>
                <div class="weekly-detail">
                    <h3>English Skills, Communication &amp; Leadership</h3>
                    <p>Visi kami di sini sangat jelas. YES hadir sebagai wadah bagi mahasiswa UNIKOM untuk mengembangkan tiga pilar utama: English Skills, Communication, and Leadership. Setiap periode kepengurusan mempunyai visi misi yang berbeda.</p>
                    <span class="time-badge"><i class="fa-solid fa-dove"></i> Youth Empowerment</span>
                </div>
            </div>

            <div class="weekly-item">
                <div class="weekly-day">Visi<br>Periode Ini</div>
                <div class="weekly-detail">
                    <h3>A Safe Space to Grow (“Sanctuary”)</h3>
                    <p>Pada periode kali ini, visinya adalah menciptakan “Sanctuary” yaitu tempat aman bagi kita dari segala bentuk kenegatifan seperti diskriminasi SARA, celaan, hujatan, dan sebagainya. Visi ini pun selaras dengan visi YES itu sendiri, sebab tanpa adanya rasa aman dan kenyamanan, kita akan kesulitan untuk bisa mengembangkan kemampuan kita dari tiga pilar utama yang disebutkan tadi.</p>
                </div>
            </div>

            <div class="weekly-item">
                <div class="weekly-day">Tujuan<br>Kami</div>
                <div class="weekly-detail">
                    <h3>Berpikir Logis, Kritis &amp; Sistematis</h3>
                    <p>Di era digital ini, kami ingin membentuk mahasiswa yang tidak hanya jago bicara, tapi juga mampu berpikir logis, kritis, dan sistematis. Untuk bisa mencapai tujuan itu, kita di sini mempunyai Core Activities atau kegiatan rutin yang wajib, aman, dan pastinya seru banget buat kalian ikuti.</p>
                </div>
            </div>
        </div>
    `,

    daisy: `
        <div class="modal-top-header">
            <img src="assets/images/bunga.png" alt="Daisy Flower">
            <span class="modal-kicker">WHAT WE DO &bull; KEGIATAN RUTIN (WEEKLY)</span>
        </div>

        <div class="weekly-list">
            <div class="weekly-item">
                <div class="weekly-day">Kamis</div>
                <div class="weekly-detail">
                    <h3>Forum Group Discussion (FGD)</h3>
                    <p>Membedah isu global, melatih critical thinking, dan keberanian berargumen.</p>
                    <span class="time-badge"><i class="fa-regular fa-clock"></i> 15.30 - 17.00 WIB</span>
                </div>
            </div>

            <div class="weekly-item">
                <div class="weekly-day">Jumat</div>
                <div class="weekly-detail">
                    <h3>Public Speaking Class</h3>
                    <p>Belajar menyusun pidato, storytelling, dan teknik berbicara di depan umum.</p>
                    <span class="time-badge"><i class="fa-regular fa-clock"></i> 15.30 - 17.00 WIB</span>
                </div>
            </div>

            <div class="weekly-item">
                <div class="weekly-day">Flexible<br>Day</div>
                <div class="weekly-detail">
                    <h3>Debate Class and TOEFL Preparation Class</h3>
                    <p>Di kelas Debate, kalian akan berlatih menyusun argumen logis berbasis data, membantah lawan, dan berbicara sistematis di depan umum. Sementara di kelas TOEFL Preparation, kalian akan mempelajari materi, format soal, serta strategi efektif untuk menaklukkan ujian TOEFL.</p>
                    <span class="time-badge"><i class="fa-regular fa-clock"></i> 15.30 - 17.00 WIB</span>
                </div>
            </div>
        </div>

        <div class="monthly-section">
            <div class="monthly-header">
                <div class="monthly-icon-box"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                <span>MONTHLY EVENTS</span>
            </div>

            <div class="monthly-grid">
                <div class="monthly-card">
                    <h4>YES Goes Out</h4>
                    <p>Program rutin setiap bulan untuk jalan-jalan, hangout, dan bonding di luar kampus untuk mempererat rasa kekeluargaan.</p>
                </div>

                <div class="monthly-card">
                    <h4>Sharing Session</h4>
                    <p>Wadah terbuka untuk berkeluh kesah, berbagi pengalaman, dan saling mendukung antar anggota YES.</p>
                </div>
            </div>
        </div>
    `
};

const modal = document.getElementById("infoModal");
const modalBox = modal ? modal.querySelector(".modal-box") : null;
const closeModalBtn = document.getElementById("closeModalBtn");
const modalBody = document.getElementById("modalBody");
const popupTriggers = document.querySelectorAll("[data-popup]");

popupTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const key = trigger.getAttribute("data-popup");
        const htmlContent = popupData[key];

        if (htmlContent && modal && modalBody) {
            modalBody.innerHTML = htmlContent;
            if (modalBox) modalBox.scrollTop = 0;
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        }
    });
});

function closePopup() {
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closePopup);
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closePopup();
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
        closePopup();
    }
});

// Tombol FLY UP untuk kembali ke atas
const flyUpBtn = document.getElementById("flyUpBtn");
if (flyUpBtn) {
    flyUpBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}