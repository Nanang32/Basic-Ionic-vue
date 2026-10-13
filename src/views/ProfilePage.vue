<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar
} from "@ionic/vue";
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="profile-container">
        <ion-avatar>
          <img
            src="https://dummyjson.com/icon/pengguna/150"
            alt="Foto profil"
          />
        </ion-avatar>

        <h2>Pengguna Ionic</h2>
        <p>Belajar membuat aplikasi mobile dengan Ionic Vue.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.profile-container {
  padding-top: 50px;
  text-align: center;
}

ion-avatar {
  width: 120px;
  height: 120px;
  margin: auto;
}
</style>