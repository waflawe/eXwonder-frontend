<template>
  <nav
    class="shadow-theme-toggler w-full fixed top-0 left-0 h-[44px] flex justify-center items-center bg-gray-100 dark:bg-[#222] z-10"
    id="theme-toggler"
  >
    <div
      class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 h-full flex justify-center items-center"
    >
      <button
        class="text-black dark:text-white"
        type="button"
        @click="toggleTheme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 28 28"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7"
          v-if="theme === 'light'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7"
          v-if="theme === 'dark'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </button>
    </div>
    <div class="ml-auto block lg:hidden" v-if="authenticationStore.isAuth">
      <TheMobileSidebar />
    </div>
  </nav>
</template>

<script lang="ts">
import TheMobileSidebar from "../components/TheMobileSidebar.vue";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { mapStores } from "pinia";

export default {
  components: { TheMobileSidebar },
  data() {
    return {
      theme: "dark",
    };
  },
  methods: {
    toggleTheme() {
      const currentTheme = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", currentTheme ? "dark" : "light");
      this.theme = currentTheme ? "dark" : "light";
    },
  },
  beforeMount() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      this.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
    }
  },
  computed: { ...mapStores(useAuthenticationStore) },
};
</script>
