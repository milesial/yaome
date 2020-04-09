<template>
  <div>
    <!-- Social logins -->
    <v-btn 
      href="/oauth?provider=github"
      @click="loadingGithub = true"
      :loading="loadingGithub"
      class="my-1 provider-btn no-uppercase title"
      outlined
      block
      x-large
      dark
      rounded
      color="#161614"
    >Github<img height="36" width="36" class="notranslate provider-logo" src="@/assets/github.svg"/></v-btn>
    <v-btn 
      href="/oauth?provider=google"
      @click="loadingGoogle = true"
      :loading="loadingGoogle"
      class="my-1 provider-btn no-uppercase title"
      outlined
      block
      x-large
      dark
      rounded
      color="#757575"
    >Google<img height="36" width="36" class="notranslate provider-logo" src="@/assets/google.svg"/></v-btn>
    <v-btn 
      href="/oauth?provider=facebook"
      @click="loadingFacebook = true"
      :loading="loadingFacebook"
      class="my-1 provider-btn no-uppercase title"
      outlined
      block
      x-large
      dark
      rounded
      color="#3c5a99"
    >Facebook<img height="36" width="36" class="notranslate provider-logo" src="@/assets/facebook.svg"/></v-btn>
    <v-btn 
      href="/oauth?provider=gitlab"
      @click="loadingGitlab = true"
      :loading="loadingGitlab"
      class="my-1 provider-btn no-uppercase title"
      outlined
      block
      x-large
      dark
      rounded
      color="#E24329"
    >Gitlab<img height="36" width="36" class="notranslate provider-logo" src="@/assets/gitlab.svg"/></v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    loadingGithub: false,
    loadingFacebook: false,
    loadingGoogle: false,
    loadingGitlab: false,
  }),
}
</script>

<style scoped>

.provider-logo {
  position: absolute;
  right: 0;
}

.no-uppercase {
  text-transform: none;
}

.provider-btn {
  position: relative;
  min-width: 300px;
}

@media screen and (min-width: 400px) {
  .provider-btn > :first-child::before {
    content: 'Sign in with ';
    white-space: pre;
  }
}

@media screen and (max-width: 280px) {
  .provider-btn > :first-child > img {
    display: none;
  }
}
</style>
