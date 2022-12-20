<template>
  <div class="aviasales-start">
    <img
      src="../assets/images/plane.svg"
      alt="plane"
      class="aviasales-start__plane"
    />
    <div class="aviasales-start__main-content">
      <AviasalesFilters :transfers-amount="transfersAmount" />
      <AviasalesSorting :sorting-buttons="sortingButtons" />
      <div class="aviasales-start__main-content__tickets">
        <AviasalesFlyCard
          v-for="(ticket, ticketIndex) in tickets.splice(0, 5)"
          :key="ticketIndex"
          :ticket="ticket"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AviasalesSorting from "../components/Aviasales/AviasalesSorting.vue";
import AviasalesFilters from "../components/Aviasales/AviasalesFilters.vue";
import AviasalesFlyCard from "../components/Aviasales/AviasalesFlyCard.vue";

export default {
  name: "AviasalesStart",
  components: {
    AviasalesSorting,
    AviasalesFilters,
    AviasalesFlyCard,
  },
  data() {
    return {
      searchId: null,
      tickets: [],
      stop: false,
      polling: null,
      sortingButtons: [
        {
          text: "Самый дешевый",
          value: "cheap",
        },
        {
          text: "Самый быстрый",
          value: "spead",
        },
        {
          text: "Оптимальный",
          value: "optimal",
        },
      ],
      transfersAmount: [
        {
          text: "Все",
          value: "all",
        },
        {
          text: "Без пересадок",
          value: "without",
        },
        {
          text: "1 пересадка",
          value: "one",
        },
        {
          text: "2 пересадки",
          value: "two",
        },
        {
          text: "3 пересадки",
          value: "three",
        },
      ],
    };
  },
  computed: {},
  methods: {
    async getSearchId() {
      try {
        const res = await fetch("https://avs-backend.vercel.app/search");
        const data = await res.json();
        this.searchId = data.searchId;
      } catch (e) {
        console.log(e);
      }
    },
    async getTickets() {
      if (!this.stop) {
        try {
          const res = await fetch(
            `https://avs-backend.vercel.app/tickets?searchId=${this.searchId}`
          );
          if (res.ok) {
            const data = await res.json();
            this.tickets = data.tickets;
            this.stop = data.stop;
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        clearInterval(this.polling);
      }
    },
  },
  async created() {
    await this.getSearchId();
    this.polling = await setInterval(() => {
      this.getTickets();
    }, 3000);
  },
  // beforeUnmount() {
  //   clearInterval(this.polling);
  // },
};
</script>
<!-- @media (min-width: 1024px)
.aviasales-start
  min-height: 100vh
  display: flex
  align-items: center -->
<style lang="sass">
.aviasales-start
  &__plane
    display: block
    margin: 0 auto 50px
  &__main-content
    display: grid
    grid-template-columns: repeat(2, 1fr)
    grid-template-rows: repeat(2, 1fr)
    grid-column-gap: 20px
    grid-row-gap: 20px
</style>
