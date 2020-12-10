<template>
  <div>
    <h2>Inscription</h2>
    <hr>
    <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>

    <!-- Create User Form -->
    <b-form @submit.prevent="createUser" enctype="multipart/form-data">
      <!-- Image preview -->
      <div class="mb-3" id="preview">
          <img v-if="imgPreview" :src="imgPreview" />
      </div>

      <!-- Image input -->
      <div class="mb-3">Selectionner une image</div>
      <input 
          type="file"
          ref="file"
          @change="selectFile"
      />

      <!-- Lastname input -->
      <b-form-group id="input-group-1" label="Votre nom :" label-for="input-lastname">
        <b-form-input id="input-lastname" type="text" placeholder="Entrer votre nom" required v-model="user.lastname" ></b-form-input>
      </b-form-group>

      <!-- Firstname input -->
      <b-form-group id="input-group-2" label="Votre prenom :" label-for="input-firstname">
        <b-form-input id="input-firstname" type="text" placeholder="Entrer votre prenom" required v-model="user.firstname" ></b-form-input>
      </b-form-group>

      <!-- Email input -->
      <b-form-group id="input-group-3" label="Adresse email :" label-for="input-email" >
        <b-form-input id="input-email" type="email" placeholder="Entrer votre adresse email" required v-model="user.email" ></b-form-input>
      </b-form-group>

      <!-- Password input -->
      <b-form-group id="input-group-4" label="Votre mot de passe :" label-for="input-password">
        <b-form-input id="input-password" type="password" placeholder="Entrer votre mot de passe" required v-model="user.password" ></b-form-input>
      </b-form-group>

      <b-button class="float-right" type="submit" variant="primary">Se connecter</b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from "axios"
  
  export default {
    name: "Register",
    components: {
      //
    },
    data() {
      return {
        user: {
          lastname: '',
          firstname: '',
          email: '',
          password: '',
        },
        imgPreview: '',
        file: '',
        error:''
      }
    },
    methods: {
      selectFile() {
        this.file = this.$refs.file.files[0];
        this.imgPreview = URL.createObjectURL(this.file);
      },
      async createUser() {
        const formData = new FormData();
        formData.append('lastname', this.user.lastname);
        formData.append('firstname', this.user.firstname);
        formData.append('email', this.user.email);
        formData.append('password', this.user.password);
        formData.append('file', this.file);

        try {
            let response = await axios.post("auth/register", formData);
            // console.log(response.data);

            this.$router.replace({ name: 'login', params: { message: response.data.success }});
        } catch (err) {
            this.error = err.response.data.error
        }
      }
    }
  };
</script>
