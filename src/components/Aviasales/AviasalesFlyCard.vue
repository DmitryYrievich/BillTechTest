<template>
  <div class="aviasales-fly-card white-card">
    <div class="aviasales-fly-card__header">
      <h4 class="aviasales-fly-card__header__price">{{ ticket.price }} P</h4>
      <img
        :src="companyImage"
        alt="airline-company-image"
        class="aviasales-fly-card__header__image"
      />
    </div>
    <div class="aviasales-fly-card__body">
      <div
        v-for="(segment, segmentIndex) in ticket.segments"
        :key="segmentIndex"
        class="aviasales-fly-card__body__segment"
      >
        {{ timeRange(segment.date, segment.duration) }}
        <br />
        {{ timeDuration(segment.date, segment.duration) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AviasalesFlyCard",
  components: {},
  props: {
    ticket: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    companyImage() {
      return `//pics.avs.io/99/36/${this.ticket.carrier}.png`;
    },
  },
  methods: {
    addMinutes(numOfMinutes, date) {
      date.setMinutes(date.getMinutes() + numOfMinutes);
      return date;
    },
    minusMinutes(numOfMinutes, date) {
      date.setMinutes(date.getMinutes() - numOfMinutes);
      return date;
    },
    timeRange(date, duration) {
      const dateFromHours = new Date(date).getHours();
      const dateFromMinutes = new Date(date).getMinutes();
      const dateToHours = this.addMinutes(duration, new Date(date)).getHours();
      const dateToMinutes = this.addMinutes(
        duration,
        new Date(date)
      ).getMinutes();
      return `${dateFromHours}:${dateFromMinutes} - ${dateToHours}:${dateToMinutes}`;
    },
    timeDuration(date, duration) {
      const dateDurationHours = this.minusMinutes(
        duration,
        new Date(date)
      ).getHours();
      const dateDurationMinutes = this.minusMinutes(
        duration,
        new Date(date)
      ).getMinutes();
      return `${dateDurationHours}ч ${dateDurationMinutes}м`;
    },
  },
};
</script>

<style lang="sass">
.aviasales-fly-card
  padding: 20px
  &__header
    display: flex
    justify-content: space-between
    align-items: center
    &__price
      font-size: 24px
      font-weight: 600
      color: #2196F3
</style>
