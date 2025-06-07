document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('openButton');
    const initialScreen = document.querySelector('.initial-screen');
    const animationContainer = document.querySelector('.animation-container');
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');

    let animationStarted = false;
    let flowers = [];
    let hearts = [];
    let butterflies = []; // Placeholder untuk kupu-kupu

    // --- UTILITIES ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Panggil saat pertama kali dimuat

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // --- FLOWER CLASS (Lebih kompleks) ---
    class Flower {
        constructor(x, y, stemHeight, flowerSize, petalColor, stemColor) {
            this.baseX = x;
            this.baseY = y;
            this.stemHeight = 0; // Mulai dari 0 untuk tumbuh
            this.maxStemHeight = stemHeight;
            this.flowerSize = 0; // Mulai dari 0 untuk mekar
            this.maxFlowerSize = flowerSize;
            this.petalColor = petalColor;
            this.stemColor = stemColor;

            this.growthProgress = 0; // 0-1 untuk fase tumbuh
            this.swayAngle = 0;
            this.swaySpeed = random(0.01, 0.03);
            this.swayMagnitude = random(0.05, 0.1); // Sudut goyangan

            this.phase = 'growingStem'; // growingStem -> growingFlower -> swaying
            this.delay = random(0, 100); // Penundaan agar bunga tidak tumbuh bersamaan
        }

        drawStem(currentHeight) {
            ctx.strokeStyle = this.stemColor;
            ctx.lineWidth = random(3, 5); // Ketebalan batang
            ctx.beginPath();
            ctx.moveTo(this.baseX, this.baseY);
            ctx.lineTo(this.baseX, this.baseY - currentHeight);
            ctx.stroke();
        }

        drawPetals(currentFlowerSize, stemTopY) {
            ctx.fillStyle = this.petalColor;
            ctx.strokeStyle = this.petalColor;
            ctx.lineWidth = 1;

            // Pusat bunga
            ctx.beginPath();
            ctx.arc(this.baseX, stemTopY, currentFlowerSize * 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Beberapa kelopak
            for (let i = 0; i < 5; i++) { // 5 kelopak
                ctx.save();
                ctx.translate(this.baseX, stemTopY);
                ctx.rotate(Math.PI * 2 / 5 * i);
                // Bentuk kelopak elips
                ctx.beginPath();
                ctx.ellipse(0, -currentFlowerSize * 0.8, currentFlowerSize * 0.4, currentFlowerSize * 0.9, Math.PI / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        drawLeaves(currentHeight) {
            ctx.fillStyle = this.stemColor; // Warna daun sama dengan batang
            // Daun 1
            ctx.beginPath();
            ctx.ellipse(this.baseX - currentHeight * 0.05, this.baseY - currentHeight * 0.3, currentHeight * 0.05, currentHeight * 0.15, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            // Daun 2
            ctx.beginPath();
            ctx.ellipse(this.baseX + currentHeight * 0.05, this.baseY - currentHeight * 0.5, currentHeight * 0.05, currentHeight * 0.15, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        draw() {
            ctx.save();
            ctx.translate(0, 0); // Reset transformasi
            // Terapkan goyangan ke seluruh bunga
            ctx.translate(this.baseX, this.baseY);
            ctx.rotate(this.swayAngle);
            ctx.translate(-this.baseX, -this.baseY);

            // Batang
            this.drawStem(this.stemHeight);
            // Daun
            this.drawLeaves(this.stemHeight);

            // Bunga
            this.drawPetals(this.flowerSize, this.baseY - this.stemHeight);
            ctx.restore();
        }

        update() {
            if (this.delay > 0) {
                this.delay--;
                return;
            }

            if (this.phase === 'growingStem') {
                this.stemHeight += 3; // Kecepatan tumbuh batang
                if (this.stemHeight >= this.maxStemHeight) {
                    this.stemHeight = this.maxStemHeight;
                    this.phase = 'growingFlower';
                }
            } else if (this.phase === 'growingFlower') {
                this.flowerSize += 1; // Kecepatan mekar bunga
                if (this.flowerSize >= this.maxFlowerSize) {
                    this.flowerSize = this.maxFlowerSize;
                    this.phase = 'swaying';
                }
            } else if (this.phase === 'swaying') {
                this.swayAngle = Math.sin(this.swaySpeed * Date.now() * 0.1) * this.swayMagnitude;
            }
        }
    }

    // --- HEART CLASS ---
    class Heart {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.opacity = 1;
            this.vx = random(-0.8, 0.8); // Kecepatan horizontal
            this.vy = random(-1.5, -0.5); // Kecepatan ke atas
            this.rotation = random(0, Math.PI * 2);
            this.rotationSpeed = random(-0.02, 0.02);
            this.lifetime = random(100, 250); // Jumlah frame sebelum menghilang
            this.age = 0;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;

            ctx.beginPath();
            ctx.moveTo(0, this.size / 4);
            ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
            ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, this.size / 4);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.age++;

            // Memudar seiring waktu
            this.opacity = 1 - (this.age / this.lifetime);
            if (this.opacity < 0) this.opacity = 0;
        }
    }

    // --- BUTTERFLY CLASS (Placeholder - sangat sulit digambar secara programatik) ---
    // Untuk kupu-kupu yang bagus seperti di gambar, Anda sangat disarankan menggunakan
    // gambar PNG atau SVG yang transparan, lalu memuatnya di Canvas dan menganimasikannya.
    // Contoh sederhana:
    class Butterfly {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = random(20, 40);
            this.vx = random(-1, 1);
            this.vy = random(-0.5, -1.5);
            this.flapSpeed = random(0.1, 0.3);
            this.flap = 0;
            this.opacity = 1;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = `rgba(200, 150, 255, ${this.opacity})`; // Warna ungu kebiruan
            
            // Body
            ctx.fillRect(-this.size * 0.1, -this.size * 0.5, this.size * 0.2, this.size);
            
            // Wings (sederhana)
            const wingWidth = this.size * 0.6;
            const wingHeight = this.size * 0.8;
            
            ctx.beginPath();
            // Left wing
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-wingWidth, -wingHeight * Math.sin(this.flap) * 0.5, -wingWidth * 0.5, -wingHeight, -this.size * 0.1, -this.size * 0.2);
            ctx.lineTo(-this.size * 0.1, this.size * 0.2);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            // Right wing
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(wingWidth, -wingHeight * Math.sin(this.flap) * 0.5, wingWidth * 0.5, -wingHeight, this.size * 0.1, -this.size * 0.2);
            ctx.lineTo(this.size * 0.1, this.size * 0.2);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.flap += this.flapSpeed;
            
            // Sedikit perubahan arah
            this.vx += random(-0.05, 0.05);
            this.vy += random(-0.05, 0.05);
            this.vx = Math.min(Math.max(this.vx, -2), 2);
            this.vy = Math.min(Math.max(this.vy, -2), 2);
            
            this.opacity -= 0.005; // Memudar
        }
    }


    // --- ANIMATION LOOP ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas

        // Update dan Draw Flowers
        flowers.forEach(flower => {
            flower.update();
            flower.draw();
        });

        // Update dan Draw Hearts
        hearts.forEach((heart, index) => {
            heart.update();
            heart.draw();
            if (heart.opacity <= 0.05) { // Hapus hati yang sudah sangat transparan
                hearts.splice(index, 1);
            }
        });

        // Update dan Draw Butterflies
        butterflies.forEach((butterfly, index) => {
            butterfly.update();
            butterfly.draw();
            if (butterfly.opacity <= 0.05) {
                butterflies.splice(index, 1);
            }
        });

        // Spawn Hearts
        if (animationStarted && random(0, 1) < 0.08) { // Peluang 8% per frame
            const heartColor = { r: 255, g: random(100, 150), b: random(150, 200) }; // Variasi pink-purple
            hearts.push(new Heart(random(0, canvas.width), canvas.height, random(10, 25), heartColor));
        }
        
        // Spawn Butterflies (lebih jarang)
        if (animationStarted && random(0, 1) < 0.01) { // Peluang 1% per frame
            butterflies.push(new Butterfly(random(0, canvas.width), canvas.height));
        }


        requestAnimationFrame(animate); // Lanjutkan animasi di frame berikutnya
    }

    // --- EVENT LISTENER ---
    openButton.addEventListener('click', () => {
        initialScreen.classList.remove('active'); // Sembunyikan layar awal
        animationContainer.classList.add('active'); // Tampilkan kontainer animasi

        animationStarted = true;

        // Buat beberapa bunga (posisi acak di bagian bawah)
        const numFlowers = 5;
        for (let i = 0; i < numFlowers; i++) {
            flowers.push(new Flower(
                canvas.width / (numFlowers + 1) * (i + 1) + random(-50, 50), // Tersebar di lebar canvas
                canvas.height - random(50, 100), // Sedikit di atas bawah
                random(canvas.height * 0.4, canvas.height * 0.7), // Tinggi bunga acak
                random(30, 60), // Ukuran bunga acak
                `hsl(${random(300, 350)}, 70%, 70%)`, // Warna kelopak pinkish-purplish
                `hsl(${random(80, 140)}, 60%, 40%)` // Warna batang kehijauan
            ));
        }

        // Mulai animasi
        animate(); 
    });
});