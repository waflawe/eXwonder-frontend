<template>
  <div class="ps-0.5 pr-1 pb-1" v-if="posts.length">
    <div class="grid grid-cols-3 space-x-0.5 space-y-0.5">
      <div v-for="(post, index) in posts" :key="post.id">
        <div
          class="group relative cursor-pointer"
          :class="{
            'ml-0.5 mt-0.5': index === 0,
            scrollEnd: index === posts.length - 1,
          }"
          @click="postClick(post)"
        >
          <div class="relative overflow-hidden">
            <img
              :src="post.images[0].image_crop"
              alt="Post image"
              class="block w-full h-full object-cover object-center mx-auto dark:group-hover:opacity-40"
            />
            <div
              class="absolute h-full inset-0 group-hover:bg-black group-hover:bg-opacity-40 dark:group-hover:bg-opacity-0"
            ></div>
          </div>

          <div
            class="absolute top-1.5 right-1.5 opacity-100 text-lg text-white"
            v-if="post.images.length > 1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                d="M16.5 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3v-6A4.5 4.5 0 0 1 10.5 6h6Z"
              />
              <path
                d="M18 7.5a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3H18Z"
              />
            </svg>
          </div>

          <div
            class="absolute top-1/2 left-1/2 flex opacity-0 group-hover:opacity-100 text-lg text-white font-semibold space-x-5"
            style="transform: translate(-50%, -50%)"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                />
              </svg>
              <span class="varela-round" style="font-size: 24px">{{
                post.likes_count
              }}</span>
            </div>

            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="varela-round" style="font-size: 24px">{{
                post.comments_count
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="hidden lg:block"
        v-if="posts.filter(el => el.isModalVisible).length"
      >
        <app-post-modal
          :post="posts.filter(el => el.isModalVisible)[0]"
          @close="exitModal(posts.filter(el => el.isModalVisible)[0])"
        />
      </div>
    </div>
  </div>
  <div class="text-gray-700 dark:text-gray-500 pb-10 w-full" v-else>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-36 mx-auto"
    >
      <path
        fill-rule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="text-center text-4xl">No results found :/</div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IPost } from "../types/globals";
import { isElementInViewport } from "../helpers";
import AppPostModal from "./AppPostModal.vue";

export default {
  emits: ["updatePostsScroll"],
  props: {
    posts: {
      type: Array as PropType<Array<IPost>>,
      required: true,
    },
  },
  data() {
    return {
      isPostsMayBeUpdated: false,
      isLoading: false,
    };
  },
  methods: {
    showModal(post: IPost) {
      post.isModalVisible = true;
    },
    exitModal(post: IPost) {
      post.isModalVisible = false;
    },
    postClick(post: IPost) {
      if (window.innerWidth >= 1024) {
        this.showModal(post);
      } else {
        this.$router.push({
          name: "user-post",
          params: { username: post.author.username, id: post.id },
        });
      }
    },
    checkScroll() {
      if (this.isPostsMayBeUpdated && !this.isLoading) {
        const element = document.querySelector(".scrollEnd") as HTMLElement;
        if (isElementInViewport(element)) {
          this.isLoading = true;
          this.$emit("updatePostsScroll");
        }
      }
    },
  },
  mounted() {
    this.isPostsMayBeUpdated = this.posts.length % 50 === 0;
    window.addEventListener("scroll", this.checkScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.checkScroll);
  },
  watch: {
    posts: {
      handler(new__) {
        this.isPostsMayBeUpdated = new__.length % 50 === 0;
        this.isLoading = false;
      },
      deep: true,
    },
  },
  components: { AppPostModal },
};
</script>
