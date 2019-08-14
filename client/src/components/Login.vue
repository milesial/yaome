<template>
  <v-card>
    <v-toolbar
      short 
      id="signin-toolbar"
      dark color="primary darken-1"
      flat
    >
      <v-toolbar-title>Sign in</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- close X on mobile -->
      <v-btn icon dark @click="$emit('close')" class="d-flex d-sm-none">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0">
      <v-container grid-list-md>
        <v-layout wrap column class="pt-8">
          <!-- Social logins -->
          <v-btn 
            href="/oauth?provider=github"
            class="my-1 provider-btn no-uppercase title"
            outlined
            block
            x-large
            dark
            rounded
            color="#161614"
          >Github<img height="36" width="36" class="v-icon notranslate provider-logo" src="@/assets/github.svg"/></v-btn>
          <v-btn 
            href="/oauth?provider=google"
            class="my-1 provider-btn no-uppercase title"
            outlined
            block
            x-large
            dark
            rounded
            color="#757575"
          >Google<img height="36" width="36" class="v-icon notranslate provider-logo" src="@/assets/google.svg"/></v-btn>
          <v-btn 
            href="/oauth?provider=facebook"
            class="my-1 provider-btn no-uppercase title"
            outlined
            block
            x-large
            dark
            rounded
            color="#3c5a99"
          >Facebook<img height="36" width="36" class="v-icon notranslate provider-logo" src="@/assets/facebook.svg"/></v-btn>
          <v-btn 
            href="/oauth?provider=gitlab"
            class="my-1 provider-btn no-uppercase title"
            outlined
            block
            x-large
            dark
            rounded
            color="#E24329"
          >Gitlab<img height="36" width="36" class="v-icon notranslate provider-logo" src="@/assets/gitlab.svg"/></v-btn>

          <!-- middle divider -->
          <v-row align="center" class="mt-10 mb-4">
            <v-divider></v-divider>
            <div id="or-text" class="mx-4 headline">or with email</div>
            <v-divider></v-divider>
          </v-row>

          <!-- email login form -->
          <v-form id="login-form" v-model="formValid" ref="loginForm" class="mb-8" @submit="alert(8)">
            <v-text-field
              class="form-input"
              label="Email"
              type="email"
              ref="email"
              v-model="email"
              :rules="emailRules"
              :error="error.show"
              :disabled="loading"
              @keydown.enter="submit"
              @input="error.show = false"
              required />
            <v-text-field 
              class="form-input"
              label="Password"
              :type="showPass ? 'text' : 'password'"
              v-model='pass'
              :append-icon="showPass ? 'visibility' : 'visibility_off'"
              @click:append="showPass = !showPass"
              @blur="showPass=false"
              :rules="passRules"
              :error="error.show"
              :disabled="loading"
              @keydown.enter="submit"
              @input="error.show = false"
              required />
            <!-- TODO: send mail etc -->
            <div 
              id="forgot-pass"
              class="mt-n4 text-right subtitle-2 primary--text text--darken-1">
              <a href="#">Forgot password ?</a>
            </div>
            <v-scroll-y-reverse-transition>
              <div
                id="error-msg"
                v-show="error.show"
                class="text-center error--text body-1">
                {{ error.msg }}
              </div>
            </v-scroll-y-reverse-transition>
          </v-form>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn class="no-uppercase" text rounded color="primary darken-1" style="">Need an account ?</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        class="my-0"
        large
        rounded
        text
        @click="$emit('close')"
      >
        Close
      </v-btn>
      <v-btn
        class="my-0 px-4"
        large
        rounded
        :disabled="!formValid"
        :loading="loading"
        color="primary darken-1"
        @click="submit"
        type="submit"
      >
        Sign in
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['opened'],
  data: function() {
    return {
      showPass: false,
      email: '',
      pass: '',
      loading: false,
      formValid: false,
      error: {
        msg: '',
        show: false
      },
      emailRules: [
        v => !!v || 'Email is required',
        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email must be valid',
      ],
      passRules: [
        v => !!v || 'Password is required',
      ]
    }
  },
  watch: {
    opened: function(v) {
      if (v) {
        this.$refs.loginForm.resetValidation()
        this.error.show = false
        this.$refs.email.focus()
      }
    },
  },
  methods: {
    submit: function() {
      if(this.$refs.loginForm.validate()) {
        this.loading = true
        let vm = this
        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/login', true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.onreadystatechange = function() {
          vm.loading = false
          if (this.readyState == 4 && this.status == 200) {
            // login successful
            let name = JSON.parse(this.responseText).name
            vm.$emit('login', name)
            vm.$emit('close')
          } else if (this.readyState == 4) {
            vm.error.msg = JSON.parse(this.responseText).error
            vm.error.show = true
          }
        }
        xhr.send(JSON.stringify({ email: this.email, password: this.pass }))
      }
    },
  }
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

#signin-toolbar {
  flex-grow: 0;
}

#forgot-pass {
  position: relative;
  z-index: 1;
}

#forgot-pass > a, #register > a {
  text-decoration: none;
}

#login-form {
  position: relative; /* so the error message is placed correctly */
}

#error-msg {
  position: absolute;
}

.form-input {
  min-height: 65px; /* so the validation messages don't shift the form */
}
</style>
