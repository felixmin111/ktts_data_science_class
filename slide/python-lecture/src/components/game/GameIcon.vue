<script setup lang="ts">
import type { GameDefinition } from '@/models/game.model'

defineProps<{ icon: GameDefinition['icon'] }>()
</script>

<template>
  <IconMdiMagnify v-if="icon === 'magnify'" />
  <IconMdiCrystalBall v-else-if="icon === 'crystal-ball'" />
  <IconMdiBug v-else-if="icon === 'bug'" />
  <IconMdiTableLarge v-else-if="icon === 'table'" />
  <IconMdiSigma v-else-if="icon === 'sigma'" />
  <IconMdiLinkVariant v-else-if="icon === 'link-variant'" />
  <IconMdiBroom v-else-if="icon === 'broom'" />
  <IconMdiBriefcaseSearchOutline v-else-if="icon === 'briefcase-search-outline'" />
  <IconMdiCalculatorVariant v-else-if="icon === 'calculator'" />
  <IconMdiScaleBalance v-else-if="icon === 'scale-balance'" />
  <IconMdiSourceBranch v-else-if="icon === 'source-branch'" />
  <IconMdiSitemap v-else-if="icon === 'sitemap'" />
  <IconMdiRefresh v-else-if="icon === 'refresh'" />
  <IconMdiChartBar v-else />
</template>
