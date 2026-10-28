<script setup lang="ts">
import { computed, ref } from "vue";
import { rainyOutline } from "ionicons/icons";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  onIonViewWillEnter,
  type RefresherCustomEvent,
} from "@ionic/vue";

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

interface WeatherRow {
  time: string;
  temperature: number;
}

const API_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=-5.14861&longitude=119.43194" +
  "&hourly=temperature_2m" +
  "&forecast_hours=12" +
  "&timezone=Asia%2FMakassar";

const weatherRows = ref<WeatherRow[]>([]);
const loading = ref(false);
const errorMessage = ref("");
const toastOpen = ref(false);
const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);
const timezone = ref("");
const useFahrenheit = ref(false);
const temperatureUnit = computed(() => useFahrenheit.value ? "°F" : "°C");

function formatTemperature(celsius: number): string {
  const value = useFahrenheit.value ? (celsius * 9) / 5 + 32 : celsius;
  return value.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

async function loadWeather(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: OpenMeteoResponse = await response.json();

    if (
      !Array.isArray(data.hourly?.time) ||
      !Array.isArray(data.hourly?.temperature_2m) ||
      data.hourly.time.length !== data.hourly.temperature_2m.length
    ) {
      throw new Error("Struktur data API tidak sesuai.");
    }

    weatherRows.value = data.hourly.time.map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
    }));

    latitude.value = data.latitude;
    longitude.value = data.longitude;
    timezone.value = data.timezone;
  } catch (error) {
    console.error("Gagal mengambil data cuaca:", error);
    errorMessage.value =
      "Data cuaca gagal dimuat. Periksa koneksi internet lalu coba lagi.";
    toastOpen.value = true;
  } finally {
    loading.value = false;
  }
}

async function refreshData(event: RefresherCustomEvent): Promise<void> {
  await loadWeather();
  event.target.complete();
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Makassar",
  });
}

onIonViewWillEnter(loadWeather);
</script>

<template>
  <ion-page class="rain-theme">
    <ion-header>
      <ion-toolbar class="rain-toolbar">
        <ion-title class="page-title">Pemantauan Cuaca</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="weather-content">
      <ion-refresher slot="fixed" @ion-refresh="refreshData">
        <ion-refresher-content
          pulling-text="Tarik untuk memperbarui"
          refreshing-spinner="crescent"
        />
      </ion-refresher>

      <main class="weather-container">
        <section class="info-panel">
          <ion-icon :icon="rainyOutline" class="rain-icon" aria-hidden="true" />
          <p class="eyebrow">RESTful API · metode GET</p>
          <h1>Prakiraan Suhu Makassar</h1>
          <p>
            Lokasi:
            <strong v-if="latitude !== null && longitude !== null">
              {{ latitude }}, {{ longitude }}
            </strong>
            <span v-else>memuat koordinat…</span>
          </p>
          <p v-if="timezone">Zona waktu: {{ timezone }}</p>
        </section>

        <ion-item class="unit-switch" lines="none">
          <ion-toggle v-model="useFahrenheit" justify="space-between">
            <span class="switch-title">Gunakan Fahrenheit</span>
            <span class="switch-description">Satuan suhu: {{ temperatureUnit }}</span>
          </ion-toggle>
        </ion-item>

        <div v-if="errorMessage" class="message-box" role="alert">
          <p>{{ errorMessage }}</p>
          <ion-button size="small" @click="loadWeather">Coba Lagi</ion-button>
        </div>

        <ion-list v-if="weatherRows.length" class="weather-list" inset>
          <ion-item v-for="row in weatherRows" :key="row.time">
            <ion-label>
              <h2>{{ formatDateTime(row.time) }}</h2>
              <p>Waktu pengukuran</p>
            </ion-label>
            <ion-note slot="end" class="temperature">
              {{ formatTemperature(row.temperature) }} {{ temperatureUnit }}
            </ion-note>
          </ion-item>
        </ion-list>

        <p v-else-if="!loading && !errorMessage" class="empty-state">
          Belum ada data cuaca.
        </p>

      </main>

      <ion-loading :is-open="loading" message="Mengambil data cuaca…" />
      <ion-toast
        :is-open="toastOpen"
        :message="errorMessage"
        :duration="3000"
        color="danger"
        @did-dismiss="toastOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.rain-theme {
  --ion-color-primary: #25638a;
  --ion-color-primary-rgb: 37, 99, 138;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #215779;
  --ion-color-primary-tint: #3b7396;
  --ion-color-light: #eaf2f8;
  --ion-color-light-shade: #d2e1ed;
  --ion-color-medium: #536d82;
  --ion-text-color: #213b50;
  --ion-item-background: #ffffff;
  --ion-background-color: #f0f6fa;
}

.rain-toolbar {
  --background: #203f58;
  --color: #ffffff;
}

.rain-icon {
  display: block;
  margin: 0 auto 12px;
  color: #c9efff;
  font-size: clamp(64px, 12vw, 88px);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
}

.weather-content {
  --background: linear-gradient(180deg, #dce9f3 0%, #f0f6fa 100%);
  --padding-top: clamp(16px, 4vw, 40px);
  --padding-bottom: clamp(16px, 4vw, 40px);
  --padding-start: max(12px, env(safe-area-inset-left, 0px));
  --padding-end: max(12px, env(safe-area-inset-right, 0px));
}

.weather-container {
  box-sizing: border-box;
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
  min-width: 0;
}

.page-title {
  text-align: center;
}

.info-panel {
  margin-bottom: 18px;
  padding: clamp(16px, 4vw, 28px);
  text-align: center;
  overflow-wrap: anywhere;
  color: white;
  background: linear-gradient(135deg, #203f58, #437c9c);
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(32, 63, 88, 0.2);
}

.info-panel h1 {
  margin: 5px 0 12px;
  font-size: clamp(1.25rem, 4vw, 1.75rem);
}

.info-panel p {
  margin: 5px 0;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.unit-switch {
  --background: var(--ion-color-light);
  margin-bottom: 18px;
  border-radius: 14px;
}

.unit-switch ion-toggle {
  --track-background: #b8cbd9;
  --track-background-checked: #25638a;
  --handle-background: #ffffff;
  --handle-background-checked: #ffffff;
  width: 100%;
}

.switch-title,
.switch-description {
  display: block;
}

.switch-title {
  font-weight: 600;
}

.switch-description {
  margin-top: 4px;
  color: var(--ion-color-medium);
  font-size: 0.85rem;
}

.weather-list {
  overflow: hidden;
  margin: 0;
  border: 1px solid var(--ion-color-light-shade);
  border-radius: 18px;
}

.weather-list ion-label h2 {
  white-space: normal;
  overflow-wrap: anywhere;
}

.temperature {
  flex-shrink: 0;
  white-space: nowrap;
  color: var(--ion-color-primary);
  font-size: 1.05rem;
  font-weight: 800;
}

.message-box {
  margin-bottom: 16px;
  padding: 16px;
  color: var(--ion-color-danger-shade);
  background: rgba(var(--ion-color-danger-rgb), 0.08);
  border-radius: 14px;
}

.message-box p {
  margin-top: 0;
}

.empty-state {
  margin-top: 32px;
  color: var(--ion-color-medium);
  text-align: center;
}
@media (max-width: 380px) {
  .weather-list ion-item {
    --padding-start: 12px;
    --inner-padding-end: 12px;
  }

  .weather-list ion-label h2 {
    font-size: 0.9rem;
  }

  .temperature {
    margin-inline-start: 10px;
    font-size: 0.95rem;
  }

  .unit-switch {
    --padding-start: 12px;
    --inner-padding-end: 12px;
  }
}
</style>
