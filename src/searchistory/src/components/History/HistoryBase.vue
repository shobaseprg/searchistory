<template>
  <EditTopicModal v-if="isOpenEditRef" />
  <div class="w-[50%] h-[calc(100%-30px)] border-2 border-blue-600">
    <mavon-editor
      class="h-[calc(100%-60px)]"
      defaultOpen="preview"
      :subfield="false"
      :toolbars="{}"
      language="en"
      v-model="targetTopic.content"
    />
    <button @click="controlOpen(true, 'edit')"></button>
    <button @click="controlOpen(false, 'preview')">閉じる</button>
    <div class="w-[50%]">history</div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
//firebase
import { db } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
//store
import useTargetStore from "../../store/useTargetTopicStore"
//component
//composable
import { controlOpen, isOpenEditRef } from "../../composable/modalControl"
//model
//define
const router = useRouter()
const auth = getAuth();
//define store
const targetTopicStore = useTargetStore()
const targetTopic = targetTopicStore.targetTopic;
//logic

</script>

<style lang="scss" scoped>
</style>
