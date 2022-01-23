<template>
  <EditTopicModal v-if="isOpenEditRef" />
  <!-- ベース -->
  <div class="w-[100%] h-[calc(100%-30px)] border-2 border-blue-600 flex">
    <!-- プレビュー -->
    <div class="w-[50%] h-[100%]">
      <mavon-editor
        class="h-[calc(100%-60px)]"
        defaultOpen="preview"
        :subfield="false"
        :toolbars="{}"
        language="en"
        v-model="targetTopic.content"
      />
      <button @click="controlOpen(true, 'edit')">編集する</button>
    </div>
    <!-- リスト -->
    <div class="w-[50%]">リスト</div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref,computed } from "vue";
import { useRoute, useRouter } from 'vue-router'
//firebase
import { db } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
//store
import useTargetStore from "../../store/useTargetTopicStore"
//component
import EditTopicModal from "../Topic/editTopicModal.vue";
//composable
import { controlOpen, isOpenEditRef } from "../../composable/modalControl"
//model
//define
const router = useRouter()
const auth = getAuth();
//define store
const targetTopicStore = useTargetStore()

//logic
const targetTopic= computed(() => {
  return targetTopicStore.targetTopic;
});


</script>

<style lang="scss" scoped>
</style>
