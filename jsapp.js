// ============================================================
// APP.JS - Core Logic, Data Storage, Referensi
// ============================================================

const App = {
    // ---- REFERENSI DATA ----
    ref: {
        wilayah: {
            'DU': 'Danukusuman Utara',
            'DS': 'Danukusuman Selatan',
            'JJ': 'Joyosuran Joyotakan',
            'SM': 'Semanggi Mojo'
        },
        status_dalam_keluarga: ['Kepala Keluarga', 'Istri', 'Anak', 'Anggota Lain'],
        status_anggota: ['Aktif', 'Pindah', 'Meninggal'],
        jenis_kelamin: ['Laki-laki', 'Perempuan'],
        golongan_darah: ['A', 'B', 'O', 'AB'],
        pendidikan: ['SD', 'SLTP', 'SLTA', 'Diploma 1', 'Diploma 3', 'Sarjana', 'Magister', 'Doktor', 'Lain-lain'],
        pekerjaan: ['PNS', 'Swasta', 'Wiraswasta', 'TNI/Polri', 'Pensiunan', 'Lain-lain'],
        status_pernikahan: ['Belum Menikah', 'Menikah', 'Duda', 'Janda'],
        tempat_menikah: ['Gereja', 'Non Gereja'],
        agama: ['Islam', 'Kristen', 'Katholik', 'Hindu', 'Budha', 'Konghuchu'],
        baptis: ['Sudah', 'Belum'],
        kategori_baptis: ['Anak', 'Dewasa', 'Sidi']
    },

    // ---- GENERATE ID JEMAAT ----
    generateIdJemaat(wilayahKode) {
        const jemaat = App.getData('jemaat');
        const filtered = jemaat.filter(j => j.id_jemaat && j.id_jemaat.startsWith(wilayahKode + '-'));
        let maxNum = 0;
        filtered.forEach(j => {
            const num = parseInt(j.id_jemaat.split('-')[1]) || 0;
            if (num > maxNum) maxNum = num;
        });
        const newNum = String(maxNum + 1).padStart(3, '0');
        return `${wilayahKode}-${newNum}`;
    },

    // ---- GENERATE ID KELUARGA ----
    generateIdKeluarga(wilayahKode) {
        const keluarga = App.getData('keluarga');
        const filtered = keluarga.filter(k => k.id_keluarga && k.id_keluarga.startsWith('KK-' + wilayahKode + '-'));
        let maxNum = 0;
        filtered.forEach(k => {
            const parts = k.id_keluarga.split('-');
            const num = parseInt(parts[2]) || 0;
            if (num > maxNum) maxNum = num;
        });
        const newNum = String(maxNum + 1).padStart(3, '0');
        return `KK-${wilayahKode}-${newNum}`;
    },

    // ---- LOCAL STORAGE CRUD ----
    getData(key) {
        try {
            return JSON.parse(localStorage.getItem('church_' + key)) || [];
        } catch { return []; }
    },

    saveData(key, data) {
        localStorage.setItem('church_' + key, JSON.stringify(data));
    },

    // ---- JEMAAT CRUD ----
    addJemaat(data) {
        const list = App.getData('jemaat');
        // Cari kode wilayah
        const kodeWilayah = Object.keys(App.ref.wilayah).find(k => App.ref.wilayah[k] === data.wilayah) || 'XX';
        data.id_jemaat = App.generateIdJemaat(kodeWilayah);
        data.created_at = new Date().toISOString();
        list.push(data);
        App.saveData('jemaat', list);
        return data.id_jemaat;
    },

    updateJemaat(id_jemaat, data) {
        const list = App.getData('jemaat');
        const idx = list.findIndex(j => j.id_jemaat === id_jemaat);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            App.saveData('jemaat', list);
            return true;
        }
        return false;
    },

    deleteJemaat(id_jemaat) {
        let list = App.getData('jemaat');
        list = list.filter(j => j.id_jemaat !== id_jemaat);
        App.saveData('jemaat', list);
        // Hapus data terkait
        let anak = App.getData('anak').filter(a => a.id_jemaat !== id_jemaat);
        App.saveData('anak', anak);
        let atestasi = App.getData('atestasi').filter(a => a.id_jemaat !== id_jemaat);
        App.saveData('atestasi', atestasi);
    },

    getJemaatById(id_jemaat) {
        return App.getData('jemaat').find(j => j.id_jemaat === id_jemaat) || null;
    },

    // ---- KELUARGA CRUD ----
    addKeluarga(data) {
        const list = App.getData('keluarga');
        const kodeWilayah = Object.keys(App.ref.wilayah).find(k => App.ref.wilayah[k] === data.wilayah) || 'XX';
        data.id_keluarga = App.generateIdKeluarga(kodeWilayah);
        data.created_at = new Date().toISOString();
        list.push(data);
        App.saveData('keluarga', list);
        return data.id_keluarga;
    },

    updateKeluarga(id_keluarga, data) {
        const list = App.getData('keluarga');
        const idx = list.findIndex(k => k.id_keluarga === id_keluarga);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            App.saveData('keluarga', list);
            return true;
        }
        return false;
    },

    deleteKeluarga(id_keluarga) {
        let list = App.getData('keluarga');
        list = list.filter(k => k.id_keluarga !== id_keluarga);
        App.saveData('keluarga', list);
    },

    getKeluargaById(id_keluarga) {
        return App.getData('keluarga').find(k => k.id_keluarga === id_keluarga) || null;
    },

    // ---- ANAK CRUD ----
    addAnak(data) {
        const list = App.getData('anak');
        data.id_anak = 'ANK-' + Date.now();
        list.push(data);
        App.saveData('anak', list);
        return data.id_anak;
    },

    getAnakByKeluarga(id_keluarga) {
        return App.getData('anak').filter(a => a.id_keluarga === id_keluarga);
    },

    deleteAnak(id_anak) {
        let list = App.getData('anak').filter(a => a.id_anak !== id_anak);
        App.saveData('anak', list);
    },

    // ---- STATISTIK DASHBOARD ----
    getStats() {
        const jemaat = App.getData('jemaat');
        const keluarga = App.getData('keluarga');
        const anak = App.getData('anak');

        const aktif = jemaat.filter(j => j.status_anggota === 'Aktif').length;
        const pindah = jemaat.filter(j => j.status_anggota === 'Pindah').length;
        const meninggal = jemaat.filter(j => j.status_anggota === 'Meninggal').length;

        // Hitung per wilayah
        const perWilayah = {};
        Object.values(App.ref.wilayah).forEach(w => {
            perWilayah[w] = jemaat.filter(j => j.wilayah === w).length;
        });

        return {
            total_jemaat: jemaat.length,
            total_keluarga: keluarga.length,
            total_anak: anak.length,
            aktif, pindah, meninggal,
            perWilayah
        };
    },

    // ---- ULANG TAHUN BULAN INI ----
    getUltahBulanIni() {
        const bulan = new Date().getMonth() + 1;
        const jemaat = App.getData('jemaat');
        return jemaat.filter(j => {
            if (!j.tanggal_lahir) return false;
            const bln = new Date(j.tanggal_lahir).getMonth() + 1;
            return bln === bulan;
        });
    },

    // ---- ULANG TAHUN PERNIKAHAN BULAN INI ----
    getUltahNikahBulanIni() {
        const bulan = new Date().getMonth() + 1;
        const jemaat = App.getData('jemaat');
        return jemaat.filter(j => {
            if (!j.tanggal_pernikahan) return false;
            const bln = new Date(j.tanggal_pernikahan).getMonth() + 1;
            return bln === bulan && j.status_pernikahan === 'Menikah';
        });
    },

    // ---- FORMAT TANGGAL ----
    formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    },

    // ---- HITUNG UMUR ----
    hitungUmur(dateStr) {
        if (!dateStr) return '-';
        const today = new Date();
        const birth = new Date(dateStr);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age + ' tahun';
    }
};

// Inisialisasi data default jika kosong
(function initDefaultData() {
    // Data sudah diinisialisasi di auth.js
})();


