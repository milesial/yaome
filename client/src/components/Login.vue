<template>
  <v-card>
    <v-toolbar
      short 
      id="signin-toolbar"
      dark color="primary darken-1"
      flat
    >
      <v-toolbar-title>{{ isFormLogin ? 'Sign in' : 'Register' }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- close X on mobile -->
      <v-btn icon dark @click="$emit('close')" class="d-flex d-sm-none">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-window id="window" v-model="window">
          <v-window-item value="login">
        <v-card-text class="pb-0">
          <v-container grid-list-md>
            <v-layout wrap column class="pt-2">
              <!-- Social logins -->
              <v-btn 
                href="/oauth?provider=github"
                @click="loadingProvider.github = true"
                :loading="loadingProvider.github"
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
                @click="loadingProvider.google = true"
                :loading="loadingProvider.google"
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
                @click="loadingProvider.facebook = true"
                :loading="loadingProvider.facebook"
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
                @click="loadingProvider.gitlab = true"
                :loading="loadingProvider.gitlab"
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
              <v-form id="login-form" v-model="loginFormValid" ref="loginForm" class="mb-8">
                <v-text-field
                  class="form-input"
                  label="Email"
                  type="email"
                  ref="loginEmail"
                  v-model="email"
                  autofocus
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
      </v-window-item>

      <v-window-item value="register">
        <v-card-text class="pb-0">
          <v-container grid-list-md>
            <v-layout wrap column class="pt-2">
              <!-- email register form -->
              <v-form id="login-form" v-model="registerFormValid" ref="registerForm" class="mb-8">
                <v-text-field
                  class="form-input"
                  label="Email"
                  type="email"
                  ref="registerEmail"
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
                  :rules="passRegisterRules"
                  :error="error.show"
                  :disabled="loading"
                  @keydown.enter="submit"
                  @input="error.show = false"
                  hint="At least 8 characters"
                  persistent-hint
                  counter
                  required />

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
      </v-window-item>
    </v-window>
<v-divider></v-divider>
<v-card-actions>
  <v-btn
        @click="switchWindow"
        class="no-uppercase" text rounded color="primary darken-1" style="">{{ isFormLogin ? 'Need an account ?' : 'Want to sign in ?' }}</v-btn>
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
        {{ isFormLogin ? 'Sign in' : 'Register' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import store from '../store.js'
export default {
  props: ['opened'],
  data: function() {
    return {
      showPass: false,
      email: '',
      pass: '',
      loading: false,
      loadingProvider: {
        github: false,
        google: false,
        facebook: false,
        gitlab: false
      },
      loginFormValid: false,
      registerFormValid: false,
      error: {
        msg: '',
        show: false
      },
      window: 'login',
      emailRules: [
        v => !!v || 'Email is required',
        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email must be valid',
      ],
      passRules: [
        v => !!v || 'Password is required',
      ],
      passRegisterRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Min 8 characters'
      ]
    }
  },
  watch: {
    opened: function(v) {
      if (v) {
        this.window = 'login'
        this.$refs.loginForm.resetValidation()
        this.error.show = false
        setTimeout(() => {
          this.$refs.loginEmail.focus()
        }, 100)
      }
    },
  },
  methods: {
    submit() {
      if(this.$refs.loginForm.validate()) {
        this.loading = true
        let vm = this
        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/' + this.window, true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.onreadystatechange = function() {
          vm.loading = false
          if (this.readyState == 4 && this.status == 200) {
            // login successful
            store.logged = true
            vm.$emit('login', vm.email.split('@')[0])
            vm.$emit('close')
          } else if (this.readyState == 4) {
            vm.error.msg = JSON.parse(this.responseText).error
            vm.error.show = true
          }
        }
        xhr.send(JSON.stringify({ email: this.email, password: this.pass }))
      }
    },
    switchWindow() {
      this.error.show = false
      if (this.window == 'login') {
        this.window = 'register'
        setTimeout(() => {
          this.$refs.registerEmail.focus()
          this.$refs.registerForm.resetValidation()
        }, 100)
      } else {
        this.window = 'login'
        setTimeout(() => {
          this.$refs.loginEmail.focus()
          this.$refs.loginForm.resetValidation()
        }, 100)
      } 
    }
  },
  computed: {
    isFormLogin() {
      return this.window == 'login'
    },
    formValid() {
      if (this.window == 'login')
        return this.loginFormValid
      else return this.registerFormValid
    }
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

#window {
  overflow-y: auto;
}
</style>
