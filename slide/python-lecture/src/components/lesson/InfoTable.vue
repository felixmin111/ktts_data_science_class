<script setup lang="ts">
const props = defineProps<{ columns: string[]; rows: string[][]; codeColumns?: number[] }>()

const tableColumns = computed(() =>
  props.columns.map((title, index) => ({ title, dataIndex: String(index), key: String(index) }))
)
const dataSource = computed(() =>
  props.rows.map((row, rowIndex) => ({
    key: rowIndex,
    ...Object.fromEntries(row.map((cell, index) => [String(index), cell]))
  }))
)
</script>

<template>
  <a-table
    class="info-table"
    :columns="tableColumns"
    :data-source="dataSource"
    :pagination="false"
    size="middle"
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ text, column }">
      <code v-if="codeColumns?.includes(Number(column.key))" class="info-table__code">
        {{ text }}
      </code>
      <span v-else>{{ text }}</span>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
.info-table {
  border: 1px solid $color-line;
  border-radius: $radius;
  overflow: hidden;

  :deep(.ant-table-thead > tr > th) {
    background: $color-ink;
    color: $color-paper;
    font-weight: 600;
  }

  :deep(.ant-table) {
    background: $color-card;
    font-size: 15px;
  }

  &__code {
    white-space: nowrap;
  }
}
</style>
