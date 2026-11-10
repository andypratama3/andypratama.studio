export type FaqGroup = "work" | "sakolentra" | "dualbrand" | "about";
export type FaqItem = {
  id: string;
  group: FaqGroup;
  home?: boolean; // tampil di Home (maksimal 6)
  requiresSetting?: string; // tampil hanya bila site_settings terisi
  pendingOwner?: boolean; // sembunyikan sampai Owner mengonfirmasi
  q: { en: string; id: string };
  a: { en: string; id: string };
};

export const faq: FaqItem[] = [
  // ---- Work with me ----
  {
    id: "build",
    group: "work",
    home: true,
    q: {
      en: "What can you help me with?",
      id: "Apa yang bisa Anda bantu?",
    },
    a: {
      en: "Day-to-day operations your team actually uses: billing and payments, matching bank transfers, WhatsApp updates, dashboards, and connecting the tools you already have. I handle the work from first conversation to launch.",
      id: "Operasional harian yang benar-benar dipakai tim Anda: tagihan dan pembayaran, pencocokan transfer bank, kabar WhatsApp, dasbor, dan menyambungkan alat yang sudah ada. Saya kerjakan dari percakapan pertama sampai siap dipakai.",
    },
  },
  {
    id: "availability",
    group: "work",
    home: true,
    q: {
      en: "Do you take projects or full-time roles?",
      id: "Apakah Anda menerima proyek atau kerja penuh waktu?",
    },
    a: {
      en: "Both. I'm open to full-time roles (remote, Jakarta onsite, or international teams hiring from Indonesia) and to selected projects. Choose a topic on the contact page so your message goes to the right place.",
      id: "Keduanya. Saya terbuka untuk peran penuh waktu (jarak jauh, onsite Jakarta, atau tim internasional yang merekrut dari Indonesia) dan untuk proyek terpilih. Pilih topik di halaman kontak agar pesan Anda sampai ke tempat yang tepat.",
    },
  },
  {
    id: "pricing",
    group: "work",
    home: true,
    q: {
      en: "How does pricing work?",
      id: "Bagaimana soal harga?",
    },
    a: {
      en: "Packages with a clear, fixed scope—like connecting payments and WhatsApp—get a fixed quote. Custom work is priced after we talk through the problem. There is no public price list yet.",
      id: "Paket dengan lingkup jelas dan tetap—misalnya menyambungkan pembayaran dan WhatsApp—mendapat harga tetap. Pekerjaan khusus dihitung setelah kita bahas masalahnya. Belum ada daftar harga publik.",
    },
  },
  {
    id: "start",
    group: "work",
    pendingOwner: true,
    q: {
      en: "What do you need from me to start?",
      id: "Apa yang perlu saya siapkan untuk mulai?",
    },
    a: {
      en: "A short note about the problem, who will use the system, how payments or messages work today, and any deadline that matters. I'll reply with questions or a simple plan.",
      id: "Catatan singkat tentang masalahnya, siapa yang memakai sistem, bagaimana pembayaran atau pesan berjalan hari ini, dan tenggat yang penting. Saya balas dengan pertanyaan atau rencana sederhana.",
    },
  },
  {
    id: "remote",
    group: "work",
    home: true,
    q: {
      en: "Can we work remotely?",
      id: "Bisakah kerja jarak jauh?",
    },
    a: {
      en: "Yes. I'm based in Samarinda, Indonesia (UTC+8) and work with teams in other time zones.",
      id: "Ya. Saya tinggal di Samarinda, Indonesia (UTC+8) dan terbuka bekerja dengan tim di zona waktu lain.",
    },
  },
  {
    id: "stack",
    group: "work",
    q: {
      en: "What tools do you use?",
      id: "Alat apa yang Anda pakai?",
    },
    a: {
      en: "Reliable tools for web systems and day-to-day operations—including payment and WhatsApp connections when needed. The exact mix depends on your project; we pick what fits, not what is trendy.",
      id: "Alat yang andal untuk sistem web dan operasional harian—termasuk sambungan pembayaran dan WhatsApp bila diperlukan. Kombinasi pastinya mengikuti proyek Anda; dipilih yang cocok, bukan yang sedang tren.",
    },
  },
  {
    id: "ai",
    group: "work",
    pendingOwner: true,
    q: {
      en: "Do you use AI?",
      id: "Apakah Anda memakai AI?",
    },
    a: {
      en: "Yes, as a helper for drafts and repetitive tasks. Final decisions, review, and testing stay with me. Anything that uses an AI voice or character is clearly labeled.",
      id: "Ya, sebagai pembantu untuk draf dan pekerjaan berulang. Keputusan akhir, pengecekan, dan pengujian tetap di tangan saya. Apa pun yang memakai suara atau karakter AI diberi label jelas.",
    },
  },

  // ---- SAKOLENTRA ----
  {
    id: "sakolentra-what",
    group: "sakolentra",
    q: {
      en: "What is SAKOLENTRA?",
      id: "Apa itu SAKOLENTRA?",
    },
    a: {
      en: "Helps school admin and finance: tuition billing, bank payments, automatic matching, and WhatsApp updates for parents. It runs at SD Muhammadiyah 3 Samarinda with {fact:students} students. I built it and I own it.",
      id: "Membantu administrasi dan keuangan sekolah: tagihan SPP, pembayaran lewat bank, pencocokan otomatis, dan kabar WhatsApp ke orang tua. Berjalan di SD Muhammadiyah 3 Samarinda dengan {fact:students} siswa. Saya yang membangunnya dan saya pemiliknya.",
    },
  },
  {
    id: "sakolentra-school",
    group: "sakolentra",
    home: true,
    q: {
      en: "Can my school use it?",
      id: "Bisakah sekolah saya memakainya?",
    },
    a: {
      en: "I'm opening a small pilot with a few schools. Fit depends on how your school collects fees today and which payment channels you use—we check that first. The public demo only uses sample data.",
      id: "Saya membuka pilot kecil dengan beberapa sekolah. Kecocokan bergantung pada cara sekolah menagih biaya hari ini dan kanal pembayaran yang dipakai—itu kita cek dulu. Demo publik hanya memakai data contoh.",
    },
  },
  {
    id: "sakolentra-data",
    group: "sakolentra",
    q: {
      en: "What happens to student data?",
      id: "Bagaimana dengan data siswa?",
    },
    a: {
      en: "Student data belongs to the school. The public demo never uses real data. A pilot needs a written agreement before any real data is loaded.",
      id: "Data siswa milik sekolah. Demo publik tidak pernah memakai data asli. Pilot membutuhkan perjanjian tertulis sebelum data asli dimuat.",
    },
  },
  {
    id: "sakolentra-name",
    group: "sakolentra",
    q: {
      en: "Is SAKOLENTRA the same as ProductSchool?",
      id: "Apakah SAKOLENTRA sama dengan ProductSchool?",
    },
    a: {
      en: "Yes. ProductSchool was the earlier name of the same system.",
      id: "Ya. ProductSchool adalah nama lama dari sistem yang sama.",
    },
  },

  // ---- DualBrand ----
  {
    id: "dualbrand-what",
    group: "dualbrand",
    q: {
      en: "What is DualBrand?",
      id: "Apa itu DualBrand?",
    },
    a: {
      en: "A ready-made website template for a business with one parent brand and two child brands—without building three separate sites.",
      id: "Template website siap pakai untuk bisnis dengan satu merek induk dan dua merek anak—tanpa membangun tiga situs terpisah.",
    },
  },
  {
    id: "dualbrand-license",
    group: "dualbrand",
    home: true,
    q: {
      en: "Can I use DualBrand for client projects?",
      id: "Bolehkah DualBrand dipakai untuk proyek klien?",
    },
    a: {
      en: "The license page lists exactly what you can and can't do, including client work. Please read it before you buy.",
      id: "Halaman lisensi menjelaskan apa yang boleh dan tidak boleh, termasuk pekerjaan klien. Baca dulu sebelum membeli.",
    },
  },
  {
    id: "dualbrand-contents",
    group: "dualbrand",
    q: {
      en: "What do I get after buying?",
      id: "Apa yang saya dapat setelah membeli?",
    },
    a: {
      en: "The product page lists the package contents and setup needs. If something you expected is missing, tell me on the contact page.",
      id: "Halaman produk memuat isi paket dan kebutuhan pemasangan. Jika ada yang Anda harapkan tetapi tidak ada, kabari saya lewat halaman kontak.",
    },
  },
  {
    id: "dualbrand-where",
    group: "dualbrand",
    q: {
      en: "Where can I buy it?",
      id: "Di mana saya bisa membelinya?",
    },
    a: {
      en: "On Gumroad for international buyers, and on Lynk.id for buyers in Indonesia.",
      id: "Di Gumroad untuk pembeli internasional, dan di Lynk.id untuk pembeli di Indonesia.",
    },
  },
  {
    id: "dualbrand-refund",
    group: "dualbrand",
    q: {
      en: "What about support and refunds?",
      id: "Bagaimana soal bantuan dan pengembalian dana?",
    },
    a: {
      en: "Purchases go through Gumroad or Lynk.id, and the refund terms shown at checkout apply. For setup questions, use the contact page.",
      id: "Pembelian lewat Gumroad atau Lynk.id, dan ketentuan pengembalian yang tampil saat checkout berlaku. Untuk pertanyaan pemasangan, gunakan halaman kontak.",
    },
  },

  // ---- About ----
  {
    id: "series",
    group: "about",
    q: {
      en: "What is the weekly series?",
      id: "Apa itu catatan mingguan?",
    },
    a: {
      en: "Every week I share one thing that worked and one problem I hit while building the studio in public.",
      id: "Setiap minggu saya bagikan satu hal yang berhasil dan satu masalah yang ditemui selagi membangun studio secara terbuka.",
    },
  },
  {
    id: "cv",
    group: "about",
    q: {
      en: "Where can I get your CV?",
      id: "Di mana saya bisa mendapatkan CV Anda?",
    },
    a: {
      en: "On the CV page, in English and Indonesian.",
      id: "Di halaman CV, dalam bahasa Inggris dan Indonesia.",
    },
  },
  {
    id: "reply",
    group: "about",
    requiresSetting: "reply_time", // tersembunyi sampai Andy mengisi
    q: {
      en: "How fast do you reply?",
      id: "Seberapa cepat Anda membalas?",
    },
    a: {
      en: "{setting:reply_time}",
      id: "{setting:reply_time}",
    },
  },
];
