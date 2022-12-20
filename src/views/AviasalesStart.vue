<template>
  <div class="aviasales-start">
    <img
      src="../assets/images/plane.svg"
      alt="plane"
      class="aviasales-start__plane"
    />
    <progress
      max="100"
      :class="progressBarClasses"
      class="aviasales-start__progress"
    />
    <div class="aviasales-start__main-content">
      <AviasalesFilters
        v-model="filterData"
        :transfers-amount="transfersAmount"
        :disabled="!stop"
        id="filters"
        @on-filter="filterTickets"
      />
      <div class="aviasales-start__main-content__central">
        <AviasalesSorting
          v-model="sortingData"
          :sorting-buttons="sortingButtons"
          :disabled="!stop"
          @on-sort="sortTickets"
        />
        <div
          v-if="tickets.length"
          class="aviasales-start__main-content__tickets"
        >
          <AviasalesFlyCard
            v-for="(ticket, ticketIndex) in filteredTickets"
            :key="ticketIndex"
            :ticket="ticket"
          />
          <div class="aviasales-start__main-content__buttons">
            <button
              class="aviasales-start__main-content__up-button"
              @click="goToTop"
            >
              ⇧
            </button>
            <button
              v-if="tickets.length > 5"
              class="aviasales-start__main-content__more-button"
              @click="loadMore"
            >
              Показать еще 5 билетов!
            </button>
          </div>
        </div>
        <div v-else class="aviasales-start__main-content__no-content">
          По выбранным данным нету авиабилетов
        </div>
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
      cardOnPage: 5,
      additionCardQuantity: 5,
      sortingData: "",
      filterData: [],
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
          value: 0,
        },
        {
          text: "1 пересадка",
          value: 1,
        },
        {
          text: "2 пересадки",
          value: 2,
        },
        {
          text: "3 пересадки",
          value: 3,
        },
      ],
    };
  },
  computed: {
    filteredTickets() {
      return this.tickets.slice(0, this.cardOnPage);
    },
    queryFilter() {
      const filters = this.filterData;
      return {
        ...this.$route.query,
        no: filters.includes(0) ? 0 : undefined,
        one: filters.includes(1) ? 1 : undefined,
        two: filters.includes(2) ? 2 : undefined,
        three: filters.includes(3) ? 3 : undefined,
        all: filters.includes("all") ? "all" : undefined,
      };
    },
    progressBarClasses() {
      return [{ "aviasales-start__progress--hide": this.stop }];
    },
  },
  methods: {
    setTickets(newValue) {
      this.tickets = newValue;
    },
    setQueryToFilter() {
      const query = this.$route.query;
      if (query.no) {
        Array.isArray(query.nst)
          ? this.filterData.concat(query.no)
          : this.filterData.push(Number(query.no));
      }
      if (query.one) {
        Array.isArray(query.one)
          ? this.filterData.concat(query.one)
          : this.filterData.push(Number(query.one));
      }
      if (query.two) {
        Array.isArray(query.two)
          ? this.filterData.concat(query.two)
          : this.filterData.push(Number(query.two));
      }
      if (query.three) {
        Array.isArray(query.three)
          ? this.filterData.concat(query.three)
          : this.filterData.push(Number(query.three));
      }
    },
    setQueryFilterToRouter() {
      this.$router.replace({
        query: this.queryFilter,
      });
    },
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
            this.setTickets(data.tickets);
            this.filterTickets();
            this.stop = data.stop;
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        clearInterval(this.polling);
      }
    },
    sortTickets() {
      switch (this.sortingData) {
        case "spead":
          this.sortBySpeed();
          break;
        case "cheap":
          this.sortByPrice();
          break;
        case "optimal":
          this.sortByOptimal();
          break;
        default:
          break;
      }
    },
    filterTickets() {
      if (this.filterData.length) {
        const isAllResults = this.filterData.includes("all");
        if (!isAllResults) {
          this.tickets = this.tickets.filter((ticket) => {
            return ticket.segments.find((segment) => {
              const stopsQuantity = segment.stops.length;
              if (this.filterData.includes(stopsQuantity)) {
                return true;
              }
            });
          });
        }
      }
      this.setQueryFilterToRouter();
    },
    getTripSpeed(ticket) {
      return ticket.segments.reduce(
        (sum, segment) => sum + segment.duration,
        0
      );
    },
    getOptimalPoints(ticket) {
      return this.ticket.price / this.getTripSpeed(ticket);
    },
    sortBySpeed() {
      this.tickets.sort(
        (elem1, elem2) => this.getTripSpeed(elem1) - this.getTripSpeed(elem2)
      );
    },
    sortByPrice() {
      this.tickets.sort((elem1, elem2) => elem1.price - elem2.price);
    },
    sortByOptimal() {
      this.tickets.reverse(
        (elem1, elem2) =>
          this.getOptimalPoints(elem1) - this.getOptimalPoints(elem2)
      );
    },
    loadMore() {
      this.cardOnPage += this.additionCardQuantity;
    },
    goToTop() {
      const header = document.querySelector("#filters");
      header.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    },
  },
  async created() {
    await this.getSearchId();
    this.setQueryToFilter();
    await this.getTickets();
    this.polling = setInterval(() => {
      return new Promise((resolve, reject) => {
        this.getTickets()
          .then((resp) => {
            resolve(resp);
          })
          .catch(reject);
      });
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
};
</script>
<style lang="sass">
.aviasales-start
  @media (max-width: 768px)
    margin: 0 10px
  &__progress
    width: 100%
    opacity: 1
    transition-duration: 0.3s
    &--hide
      opacity: 0
  &__plane
    display: block
    margin: 0 auto 35px
    @media (max-width: 768px)
      display: none
  &__main-content
    display: flex
    gap: 20px
    @media (max-width: 768px)
      flex-direction: column
      gap: 10px
    &__tickets
      display: flex
      flex-direction: column
      gap: 20px
      @media (max-width: 768px)
        gap: 10px
    &__central
      display: flex
      flex-direction: column
      gap: 20px
      @media (max-width: 768px)
        gap: 10px
    &__buttons
      display: flex
      gap: 20px
    &__more-button
      width: 100%
      padding: 15px 20px
      background-color: #2196F3
      border-radius: 5px
      color: #FFFFFF
    &__up-button
      display: none
      width: 20%
      background-color: #6AB42D
      border-radius: 5px
      color: #FFFFFF
      @media (max-width: 768px)
        display: block
    &__no-content
      width: 100%
      text-align: center
</style>
