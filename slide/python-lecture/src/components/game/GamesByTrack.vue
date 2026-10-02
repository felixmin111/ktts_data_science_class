<script setup lang="ts">
import { gamesInTrack } from '@/data/games'
import { getTracks } from '@/data/lessons'
</script>

<template>
  <div class="games-by-track">
    <section v-for="track in getTracks()" :key="track.id" class="games-by-track__group">
      <h3>{{ track.title }}</h3>
      <div class="games-by-track__grid">
        <GameCard v-for="game in gamesInTrack(track.id)" :key="game.id" :game="game" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.games-by-track {
  display: flex;
  flex-direction: column;
  gap: 32px;

  h3 {
    font-size: 22px;
    margin-bottom: 14px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }
}
</style>
