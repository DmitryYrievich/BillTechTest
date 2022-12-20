<template>
  <div class="aviasales-sorting">
    <button
      v-for="button in sortingButtons"
      :key="button.value"
      :class="buttonClasses(button)"
      class="aviasales-sorting__button"
      @click="activateSorting(button)"
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
  },
  data() {
    return {
      checkedValue: [],
    };
  },
  methods: {
    buttonClasses(button) {
      return [
        {
          "aviasales-sorting__button--active":
            button.value === this.checkedValue.value,
        },
      ];
    },
    activateSorting(button) {
      this.checkedValue = button;
    },
  },
};
</script>

<style lang="sass">
.aviasales-sorting
  &__button
    background-color: #FFFFFF
    border: 1px solid #DFE5EC
    width: 168px
    padding: 15px 24px
    font-size: 12px
    text-align: center
    text-transform: uppercase
    font-weight: 600
    transition-duration: 0.4s
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
