<template>
  <div>
    <b-card>
      <h2>Inscription</h2>
      <hr>
      <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>

      <!-- Create User Form -->
      <b-form @submit.prevent="createUser">

        <!-- Fullname input -->
        <b-form-group id="input-group-1" label="Votre nom :" label-for="input-fullname">
          <b-form-input id="input-fullname" type="text" placeholder="Entrer votre nom" required v-model="user.fullname" ></b-form-input>
        </b-form-group>

        <!-- Email input -->
        <b-form-group id="input-group-3" label="Adresse email :" label-for="input-email" >
          <b-form-input id="input-email" type="email" placeholder="Entrer votre adresse email" required v-model="user.email" ></b-form-input>
        </b-form-group>

        <!-- Password input -->
        <b-form-group id="input-group-4" label="Votre mot de passe :" label-for="input-password">
          <b-form-input id="input-password" type="password" placeholder="Entrer votre mot de passe" required v-model="user.password" ></b-form-input>
        </b-form-group>

        <b-button class="float-right" type="submit" variant="primary">S'inscrire</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  import axios from "axios"
  
  export default {
    name: "Register",
    data() {
      return {
        user: {
          fullname: '',
          email: '',
          password: '',
        },
        error: ''
      }
    },
    methods: {
      async createUser() {
        try {
            let response = await axios.post("auth/register", this.user);
            // console.log(response.data);

            this.$router.replace({ name: 'login', params: { message: response.data.success }});
        } catch (err) {
            this.error = err.response.data.error
        }
      }
    }
  };
</script>
