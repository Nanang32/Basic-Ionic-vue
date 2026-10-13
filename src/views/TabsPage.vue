<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/vue";

import {
  homeOutline,
  heartOutline,
  personOutline,
  thermometerOutline,
} from "ionicons/icons";
</script>

<template>
  <ion-page>
    <ion-tabs>
      <!-- Tempat halaman setiap tab ditampilkan -->
      <ion-router-outlet></ion-router-outlet>

      <!-- Navigation tab bagian bawah -->
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline"></ion-icon>
          <ion-label>Beranda</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favorite" href="/tabs/favorite">
          <ion-icon :icon="heartOutline"></ion-icon>
          <ion-label>Favorit</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personOutline"></ion-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="weather" href="/tabs/weather">
  <ion-icon
    :icon="thermometerOutline"
    aria-hidden="true"
  />
  <ion-label>Cuaca</ion-label>
</ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped>
ion-tab-bar {
  --background: #ffffff;
  border-top: 1px solid #e5e7eb;
  height: 65px;
}

ion-tab-button {
  --color: #8b8b8b;
  --color-selected: #3880ff;
}

ion-icon {
  font-size: 23px;
}

ion-label {
  font-size: 12px;
}
</style>
