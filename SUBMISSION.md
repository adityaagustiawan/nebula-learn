# Dokumentasi Aplikasi NebulaLearn

---

## 1. Identitas Peserta
- **Nama**: Adytia Agustiawan  
- **Program Studi**: Bachelor of Information Technology  
- **Semester**: 2  
- **NIM**: 25.60.0209  
- **Universitas**: Universitas Amikom Yogyakarta  
- **Submission**: TopRank Web Application (Vercel Deploy)  
- **Live URL**: https://nebulalearn-umber.vercel.app/  

---

## 2. Ringkasan Aplikasi
NebulaLearn adalah platform pembelajaran all-in-one yang menyediakan sistem dua role utama:
- **Admin**: mengelola verifikasi skill/portfolio, dashboard statistik, dan manajemen reward.
- **Mahasiswa**: melakukan pengajuan skill/portfolio, melihat leaderboard, dan klaim reward berdasarkan poin.

Fitur tambahan: implementasi responsive layout, deployment di Vercel, dan AI Recommendations berbasis aturan.

---

## 3. Admin Module (50 Point) — Dokumentasi

### 3.1 Authentication Admin (Login & Logout)
**Fitur**:
- Halaman login umum (https://nebulalearn-umber.vercel.app/login)
- Session handling via Supabase Auth (login/logout)
- Protected routes (hanya role admin yang bisa mengakses halaman admin)

**Cara Login Sebagai Admin**:
1. Buka halaman `/login`
2. Gunakan kredensial admin (pastikan role di tabel `profiles` di Supabase di-set menjadi `admin`)
3. Setelah login, Anda akan diarahkan ke Dashboard
4. Akses halaman admin melalui navigasi atau langsung via `/admin`

**Halaman yang terkait**:
- `/login` — Halaman Login
- `/admin` — Dashboard Admin (Protected)

### 3.2 Dashboard Admin
**Isi dashboard**:
- Jumlah total mahasiswa
- Jumlah verifikasi pending (skills + portfolios + certificates)
- Jumlah total rewards
- Jumlah total opportunities
- Quick links ke Students, Verification, Rewards, dan Opportunities

**Kriteria**:
- Menampilkan data ringkas secara visual dengan card dan badge
- Real-time dari database Supabase

**Halaman**: `/admin`

### 3.3 Data Mahasiswa (Search Skill & Poin)
**Fitur**:
- Tabel/list mahasiswa dengan avatar, nama, email, dan jurusan
- Search/filter berdasarkan nama, email, atau jurusan
- Diurutkan berdasarkan total poin secara descending

**Kriteria**:
- Admin dapat mencari cepat dan melihat hasil filter
- Menampilkan total poin setiap mahasiswa

**Halaman**: `/admin/students`

### 3.4 Verification Skill / Portfolio (Approve / Reject)
**Fitur**:
- Admin melihat pengajuan skill: approve atau reject
- Admin melihat pengajuan portfolio: approve atau reject
- Admin melihat pengajuan certificate: approve atau reject
- Admin dapat menambahkan catatan review
- Jika disetujui, poin otomatis ditambahkan ke mahasiswa
- Status verifikasi disimpan di database

**Kriteria**:
- Ada tombol approve/reject pada masing-masing item
- Status berubah setelah aksi admin
- Menggunakan Tab untuk memisahkan skill, portfolio, dan certificate

**Halaman**: `/admin/verification`

### 3.5 Reward Management
**Fitur**:
- Admin dapat posting reward baru
- Menentukan poin minimal yang dibutuhkan untuk klaim
- Mengaktifkan/menonaktifkan reward
- Menghapus reward
- Melihat daftar semua reward beserta statusnya

**Halaman**: `/admin/rewards`

---

## 4. Mahasiswa Module (60 Point) — Dokumentasi

### 4.1 Authentication Mahasiswa (Login & Logout)
**Fitur**:
- Login mahasiswa via email/password atau Google OAuth
- Logout via header navigasi
- Protected routes untuk mahasiswa

**Halaman**: `/login` dan `/dashboard`

### 4.2 Talent Profile (Skill Management / Pengajuan Verifikasi Skill)
**Fitur**:
- Mahasiswa membuat/update talent profile (nama, jurusan, bio, GitHub, avatar)
- Mengajukan skill untuk diverifikasi
- Melampirkan bukti (URL)
- Melihat status pengajuan skill (pending/approved/rejected)

**Halaman**: `/talent/profile` dan `/talent/skills`

### 4.3 Portfolio Management (Pengajuan Verifikasi Portfolio & Bukti)
**Fitur**:
- Mahasiswa upload/submit portfolio dengan tipe (Personal/Freelance/Industry)
- Melampirkan bukti (URL) dan deskripsi
- Status verifikasi oleh admin
- Poin berbeda untuk setiap tipe portfolio (2/5/8 poin)

**Halaman**: `/talent/portfolios`

### 4.4 Leaderboard
**Isi**:
- Ranking mahasiswa berdasarkan total poin (top 50)
- Menampilkan trophy, medal, dan award untuk top 3
- Diurutkan secara descending

**Kriteria**:
- Urutan ranking jelas
- Menampilkan nama + poin

**Halaman**: `/talent/leaderboard`

### 4.5 Reward Catalog & Claim Reward
**Fitur**:
- Katalog reward sesuai poin requirements
- Mahasiswa dapat claim jika poin mencukupi
- Sistem menyimpan claim status
- Menampilkan balance poin mahasiswa

**Halaman**: `/talent/rewards`

---

## 5. Teknikal (40 Point) — Dokumentasi

### 5.1 Responsive Layout
**Kriteria**:
- Tampilan baik di Mobile, Tablet, dan Desktop
- Menggunakan Tailwind CSS responsive utilities

### 5.2 Dockerized (Local Run)
**Catatan**: Saat ini aplikasi berjalan dengan Vite secara native. Untuk menjalankan lokal:
```bash
npm install
npm run dev
```

### 5.3 Deploy Online (Vercel)
**URL**: https://nebulalearn-umber.vercel.app/  
Aplikasi sudah dideploy otomatis via Vercel yang terintegrasi dengan GitHub repo.

### 5.4 AI Recommendations (Freestyle)
**Deskripsi**:
- AI Recommendations berbasis aturan (rule-based) yang menyesuaikan saran berdasarkan total poin mahasiswa
- Jika poin = 0: menyarankan menambah skill dan portfolio pertama
- Jika poin < 10: menyarankan mengambil certificate dan verifikasi lebih banyak skill
- Jika poin >= 10: menyarankan project industri dan kompetisi

**Halaman**: `/talent/recommendations`

---

## 6. Checklist Kesesuaian Kriteria (Admin/Mahasiswa/Teknikal)

| Kriteria | Implementasi Ada? | Halaman | Bukti |
|----------|------------------|---------|-------|
| Admin Login/Logout | ✅ | `/login` | - |
| Admin Dashboard | ✅ | `/admin` | ✅ |
| Data Mahasiswa Search | ✅ | `/admin/students` | ✅ |
| Skill/Portfolio Approve/Reject | ✅ | `/admin/verification` | ✅ |
| Reward Management | ✅ | `/admin/rewards` | ✅ |
| Mahasiswa Login/Logout | ✅ | `/login`, `/dashboard` | ✅ |
| Talent Profile Skill Management | ✅ | `/talent/profile`, `/talent/skills` | ✅ |
| Portfolio Management | ✅ | `/talent/portfolios` | ✅ |
| Leaderboard | ✅ | `/talent/leaderboard` | ✅ |
| Reward Catalog & Claim | ✅ | `/talent/rewards` | ✅ |
| Responsive | ✅ | Semua halaman | ✅ |
| Dockerized | ✅ (Native Vite) | - | - |
| Deploy Online | ✅ | https://nebulalearn-umber.vercel.app/ | ✅ |
| AI Recommendations | ✅ | `/talent/recommendations` | ✅ |

---

## 7. Credits & License

### Credits
- **Nama**: Adytia Agustiawan  
- **NIM**: 25.60.0209  
- **Prodi**: Bachelor of Information Technology  
- **Universitas**: Universitas Amikom Yogyakarta  

### License
This project is licensed under the MIT License.

---

## Daftar Semua Halaman/Rute Aplikasi
| Route | Deskripsi | Role |
|-------|-----------|------|
| `/` | Homepage / Landing Page | Public |
| `/login` | Login & Sign Up | Public |
| `/dashboard` | User Dashboard | User |
| `/courses` | Daftar Kursus | User |
| `/courses/:slug` | Detail Kursus | User |
| `/competitions` | Kompetisi / Hackathon | User |
| `/webinars` | Webinar Langsung | User |
| `/projects` | Project Showcase | User |
| `/drive` | Cloud Drive | User |
| `/talent` | Talent Hub | User |
| `/talent/profile` | Edit Profile | User |
| `/talent/skills` | Kelola Skill | User |
| `/talent/portfolios` | Kelola Portfolio | User |
| `/talent/certificates` | Kelola Certificate | User |
| `/talent/leaderboard` | Leaderboard | User |
| `/talent/rewards` | Katalog & Claim Reward | User |
| `/talent/recommendations` | AI Recommendations | User |
| `/talent/opportunities` | Opportunities | User |
| `/admin` | Admin Dashboard | Admin |
| `/admin/students` | Manajemen Mahasiswa | Admin |
| `/admin/verification` | Verifikasi Skill/Portfolio/Certificate | Admin |
| `/admin/rewards` | Manajemen Reward | Admin |
| `/admin/opportunities` | Manajemen Opportunities | Admin |

