<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonButton,
  IonSpinner,
  IonText
} from "@ionic/vue";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
}

const product = ref<Product | null>(null);
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

async function ambilData(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";

  // Membuat ID acak dari 1 sampai 30
  const randomId: number = Math.floor(Math.random() * 30) + 1;

  try {
    const response = await fetch(
      `https://dummyjson.com/products/${randomId}`
    );

    if (!response.ok) {
      throw new Error("Data gagal diambil");
    }

    product.value = await response.json();
  } catch (error) {
    errorMessage.value = "Gagal mengambil data dari API.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  ambilData();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Produk Pilihan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Tampilan ketika mengambil data -->
      <div v-if="loading" class="status-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Sedang mengambil data...</p>
      </div>

      <!-- Tampilan jika terjadi kesalahan -->
      <div v-else-if="errorMessage" class="status-container">
        <ion-text color="danger">
          <p>{{ errorMessage }}</p>
        </ion-text>

        <ion-button @click="ambilData">
          Coba Lagi
        </ion-button>
      </div>

      <!-- Tampilan data dari API -->
      <ion-card v-else-if="product">
        <ion-img
          :src="product.thumbnail"
          :alt="product.title"
        ></ion-img>

        <ion-card-header>
          <ion-card-subtitle>
            {{ product.category }}
          </ion-card-subtitle>

          <ion-card-title>
            {{ product.title }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <p>{{ product.description }}</p>

          <h2 class="harga">
            ${{ product.price }}
          </h2>

          <ion-button
            expand="block"
            @click="ambilData"
          >
            Tampilkan Produk Lain
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: #f4f6f9;
}

ion-card {
  max-width: 500px;
  margin: 20px auto;
  border-radius: 18px;
  overflow: hidden;
}

ion-img {
  height: 280px;
  background: #ffffff;
  object-fit: contain;
}

.status-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.harga {
  margin: 18px 0;
  color: var(--ion-color-primary);
  font-weight: bold;
}
</style>