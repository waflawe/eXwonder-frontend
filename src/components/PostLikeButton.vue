<template>
  <div class="text-gray-700 dark:text-gray-300" :class="{ 'flex mr-1': flexLikesCount }">
    <svg
      v-if="!post.is_liked"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6 cursor-pointer"
      :class="{ 'mx-auto': centered }"
      @click="likePost(true)"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>

    <svg
      v-if="post.is_liked"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-6 cursor-pointer text-red-600"
      :class="{ 'mx-auto': centered }"
      @click="likePost(false)"
    >
      <path
        d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
      />
    </svg>

    <div class="text-gray-600 dark:text-white varela-round" :class="likesCountClasses">
      {{ post.likes_count }}
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IPost } from "../types/globals/index.js";
import { mapStores } from "pinia";
import { usePostsStore } from "../stores/postsStore.ts";

export default {
  props: {
    post: {
      type: Object as PropType<IPost>,
      required: true,
    },
    centered: {
      type: Boolean,
      default: true,
    },
    flexLikesCount: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapStores(usePostsStore),
    likesCountClasses() {
      return {
        "text-xl": String(this.post.likes_count).length <= 2,
        "text-md": String(this.post.likes_count).length > 2,
        "text-center": this.centered,
        "ms-1": !this.centered,
      };
    },
  },
  methods: {
    async likePost(action: boolean): Promise<void> {
      if (action !== this.post.is_liked) {
        await this.togglePostLike(action);
      }
    },
    async togglePostLike(isLiking: boolean): Promise<void> {
      if (isLiking) {
        await this.postsStore.addPostLike(this.post.id);
        this.post.likes_count += 1;
      } else {
        await this.postsStore.deletePostLike(this.post.id);
        this.post.likes_count -= 1;
      }
      this.post.is_liked = isLiking;
    },
  },
};
</script>
