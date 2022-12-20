<template>
  <div class="aviasales-filters white-card">
    <h4 class="aviasales-filters__title">Количество пересадок</h4>
    <div class="aviasales-filters__checkboxes">
      <div
        v-for="checkbox in transfersAmount"
        :key="checkbox.value"
        :class="checkboxClasses(checkbox)"
        class="aviasales-filters__checkboxes__item"
      >
        <input
          v-model="selectedFilters"
          :value="checkbox.value"
          :id="checkbox.value"
          :disabled="disabled"
          type="checkbox"
          class="aviasales-filters__checkboxes__item-value"
          @change="changeFilter"
        />
        <label :for="checkbox.value">{{ checkbox.text }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AviasalesFilters",
  components: {},
  props: {
    transfersAmount: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    selectedFilters: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      },
    },
  },
  methods: {
    checkboxClasses(checkbox) {
      return [
        {
          "aviasales-filters__checkboxes__item-value--active":
            this.selectedFilters.includes(checkbox.value),
        },
      ];
    },
    changeFilter() {
      this.$emit("on-filter");
    },
  },
};
</script>

<style lang="sass">
$blue: #2196F3
$duration: 0.3s

.aviasales-filters
  width: 232px
  height: max-content
  padding: 10px 0
  @media (max-width: 768px)
    width: 100%
  &__title
    padding: 10px 20px
  &__checkboxes
    display: flex
    flex-direction: column
    @media (max-width: 768px)
    flex-direction: column
    @media (max-width: 768px)
      flex-direction: row
      flex-wrap: wrap
    &__item
      display: flex
      align-items: center
      gap: 10px
      padding: 10px 20px
      cursor: pointer
      transition-duration: $duration
      @media (max-width: 768px)
        font-size: 12px
    &__item-value
      width: 20px
      height: 20px
      border: 1px solid #9ABBCE
      appearance: none
      display: grid
      place-content: center
      transition-duration: $duration
      &:disabled
        opacity: 0.7
        cursor: not-allowed
      &::before
        content: '✓'
        font-size: 12px
        font-weight: bold
        color: $blue
        transform: scale(0)
        transition-duration: $duration
      &:checked
        border: 1px solid $blue
      &:checked::before
        transform: scale(1)
      &--active
        background-color: #F1FCFF
</style>
