<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
} from "@ionic/vue";

interface ResponCuaca {
  hourly: {
    time: string[];
    temperature_2m: (number | null)[];
  };
}

interface DataCuaca {
  time: string;
  temperature_2m: number | null;
}

// URL asli: waktu dari API menggunakan UTC, bukan WIB/WITA.
const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-5.14861&longitude=119.43194&hourly=temperature_2m&forecast_hours=12";



const parameterLokasi = new URL(API_URL).searchParams;
const latitude = parameterLokasi.get("latitude") ?? "";
const longitude = parameterLokasi.get("longitude") ?? "";

const daftarCuaca = ref<DataCuaca[]>([]);
const loading = ref(false);
const pesanError = ref("");

async function ambilCuaca(): Promise<void> {
  if (loading.value) return;

  loading.value = true;
  pesanError.value = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Permintaan gagal (HTTP ${response.status}).`);
    }

    const data: ResponCuaca = await response.json();

    // Periksa struktur respons sebelum memasangkan kedua array.
    if (
      !data?.hourly ||
      !Array.isArray(data.hourly.time) ||
      !Array.isArray(data.hourly.temperature_2m) ||
      data.hourly.time.length !== data.hourly.temperature_2m.length
    ) {
      throw new Error("Format data dari API tidak sesuai.");
    }

    daftarCuaca.value = data.hourly.time.map((time, index) => {
      const suhu = data.hourly.temperature_2m[index];

      if (
        typeof time !== "string" ||
        !(suhu === null || (typeof suhu === "number" && Number.isFinite(suhu)))
      ) {
        throw new Error("Ada nilai waktu atau suhu yang tidak valid.");
      }

      // time[0] dipasangkan dengan temperature_2m[0], dan seterusnya.
      return { time, temperature_2m: suhu ?? null };
    });
  } catch (error: unknown) {
    pesanError.value =
      error instanceof Error ? error.message : "Gagal mengambil data cuaca.";
  } finally {
    loading.value = false;
  }
}

function formatSuhu(suhu: number | null): string {
  if (suhu === null) return "Tidak tersedia";
  return `${suhu.toFixed(1)} °C`;
}

onMounted(ambilCuaca);
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Pemantauan Cuaca</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <main class="weather-container">
        <section class="hero" aria-labelledby="judul-cuaca">
          <p class="eyebrow">OPEN-METEO · PRAKIRAAN PER JAM</p>
          <h1 id="judul-cuaca">Suhu</h1>
          <p>Lokasi: latitude {{ latitude }}, longitude {{ longitude }}</p>
          <p>Suhu udara pada ketinggian 2 meter. Waktu ditampilkan dalam UTC +8.</p>
        </section>

        <ion-button expand="block" :disabled="loading" @click="ambilCuaca">
          {{ loading ? "Memuat data..." : "Perbarui Data" }}
        </ion-button>

        <div v-if="loading" class="status" role="status" aria-live="polite">
          <ion-spinner name="crescent" />
          <p>Sedang mengambil data cuaca...</p>
        </div>

        <div v-else-if="pesanError" class="status error" role="alert">
          <p>{{ pesanError }}</p>
          <p>Periksa koneksi internet, lalu tekan Perbarui Data.</p>
        </div>

        <div v-else-if="daftarCuaca.length === 0" class="status">
          <p>Belum ada data cuaca yang tersedia.</p>
        </div>

        <div v-else class="table-wrapper">
          <table>
            <caption>Prakiraan suhu per jam · {{ daftarCuaca.length }} baris</caption>
            <thead>
              <tr>
                <th scope="col">time (UTC)</th>
                <th scope="col">temperature_2m (°C)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in daftarCuaca" :key="item.time">
                <!-- Ganti T dengan spasi, tanpa mengubah zona waktu. -->
                <td>{{ item.time.replace("T", " ") }}</td>
                <td class="temperature">{{ formatSuhu(item.temperature_2m) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="source">
          Sumber: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
          Data merupakan prakiraan model cuaca, bukan pengukuran sensor langsung.
        </p>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: #eef3fa;
  --color: #172d4b;
}

.weather-container {
  max-width: 760px;
  margin: 0 auto;
}

.hero {
  padding: 24px;
  margin: 8px 0 20px;
  border-radius: 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #1644a3, #2675d8);
}

.hero h1 {
  margin: 12px 0;
  font-size: 30px;
  font-weight: 700;
}

.hero p {
  line-height: 1.6;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.status {
  padding: 40px 20px;
  text-align: center;
}

.error {
  color: #a52b3c;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
  border-radius: 16px;
  border: 1px solid #dce5f1;
  background: #ffffff;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

caption {
  padding: 16px;
  text-align: left;
  font-weight: 600;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid #e6edf6;
}

th {
  background: #e9f1fe;
  color: #18478c;
}

tbody tr:nth-child(even) {
  background: #f7faff;
}

.temperature {
  color: #18478c;
  font-weight: 700;
}

.source {
  margin: 20px 0;
  color: #536780;
  font-size: 12px;
  line-height: 1.7;
}

.source a {
  color: #18478c;
}
</style>
