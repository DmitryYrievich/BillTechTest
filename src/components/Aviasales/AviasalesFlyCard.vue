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
        <div class="aviasales-fly-card__body__segment__box">
          <p class="aviasales-fly-card__body__segment__box-header">
            {{ segment.origin }} - {{ segment.destination }}
          </p>
          <p class="aviasales-fly-card__body__segment__box-value">
            {{ timeRange(segment.date, segment.duration) }}
          </p>
        </div>

        <div class="aviasales-fly-card__body__segment__box">
          <p class="aviasales-fly-card__body__segment__box-header">В пути</p>
          <p class="aviasales-fly-card__body__segment__box-value">
            {{ timeDuration(segment.date, segment.duration) }}
          </p>
        </div>

        <div
          v-if="segment.stops.length"
          class="aviasales-fly-card__body__segment__box"
        >
          <p class="aviasales-fly-card__body__segment__box-header">
            {{ transfersQuantity(segment.stops) }}
          </p>
          <p class="aviasales-fly-card__body__segment__box-value">
            {{ stopsName(segment.stops) }}
          </p>
        </div>
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
    transfersQuantity(stops) {
      const transfersQuantity = stops.length;
      const transfersQuantityText =
        transfersQuantity > 1 ? "пересадки" : "пересадка";
      return `${transfersQuantity} ${transfersQuantityText}`;
    },
    stopsName(stops) {
      return stops.toString();
    },
  },
};
</script>

<style lang="sass">
.aviasales-fly-card
  padding: 20px
  transition-duration: 0.3s
  &__header
    display: flex
    justify-content: space-between
    align-items: center
    &__price
      font-size: 24px
      font-weight: 600
      color: #2196F3
  &__body
    margin-top: 25px
    display: flex
    flex-direction: column
    gap: 10px
    &__segment
      display: flex
      justify-content: space-between
    &__segment__box
      min-width: 110px
    &__segment__box-header
      font-size: 12px
      font-weight: 600
      color: #A0B0B9
      text-transform: uppercase
    &__segment__box-value
      margin-top: 5px
</style>
