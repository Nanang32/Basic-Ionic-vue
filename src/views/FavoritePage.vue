<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon
} from "@ionic/vue";

import { heartOutline } from "ionicons/icons";
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Favorit</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <ion-icon :icon="heartOutline"></ion-icon>
        <h2>Halaman Favorit</h2>
        <p>Produk yang disukai akan ditampilkan di sini. haloo</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

ion-icon {
  font-size: 80px;
  color: #eb445a;
}
</style>