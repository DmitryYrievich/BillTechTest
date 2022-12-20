<template>
  <div class="aviasales-sorting">
    <button
      v-for="button in sortingButtons"
      :key="button.value"
      :disabled="disabled"
      :class="buttonClasses(button.value)"
      class="aviasales-sorting__button"
      @click="activateSorting(button.value)"
    >
      {{ button.text }}
    </button>
  </div>
</template>

<script>
export default {
  name: "AviasalesSorting",
  components: {},
  props: {
    sortingButtons: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    checkedValue: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      },
    },
  },
  methods: {
    buttonClasses(value) {
      return [
        {
          "aviasales-sorting__button--active": value === this.checkedValue,
        },
      ];
    },
    activateSorting(value) {
      this.checkedValue = value;
      if (this.checkedValue !== value) this.sortTickets();
    },
    sortTickets() {
      this.$emit("on-sort");
    },
  },
};
</script>

<style lang="sass">
.aviasales-sorting
  &__button
    background-color: #FFFFFF
    border: 1px solid #DFE5EC
    width: 166px
    padding: 15px 23px
    font-size: 12px
    text-align: center
    text-transform: uppercase
    font-weight: 600
    transition-duration: 0.4s
    &:disabled
      opacity: 0.7
      cursor: not-allowed
    @media (max-width: 768px)
      width: 100%
      font-size: 10px
      padding: 13px 13px
    &--active
      background-color: #2196F3
      color: #FFFFFF
    &:first-child
      border-top-left-radius: 8px
      border-bottom-left-radius: 8px
    &:last-child
      border-top-right-radius: 8px
      border-bottom-right-radius: 8px
</style>
