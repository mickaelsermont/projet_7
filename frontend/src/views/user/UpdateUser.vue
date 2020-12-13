<template>
  <div>
    <b-card>
      <h2>Modification du profil</h2>
      <hr>
      <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>

      <b-form @submit.prevent="editUser" enctype="multipart/form-data">
        <!-- Image preview -->
        <div class="mb-3" id="preview">
            <img :src="imgPreview ? imgPreview : user.imgUrl" />
        </div>

        <!-- Image input -->
        <label class="custom-file-upload">
            <input 
                type="file"
                ref="file"
                class="inputFile"
                id="file-upload"
                @change="selectFile"
            />
            <b-icon class="mr-1" icon="image-fill" font-scale="1.2"></b-icon> Ajouter une image
        </label>

        <!-- Fullname input -->
        <b-form-group id="input-group-1" label="Votre nom :" label-for="input-fullname">
          <b-form-input id="input-fullname" type="text" placeholder="Entrer votre nom" required v-model="user.fullname" ></b-form-input>
        </b-form-group>

        <!-- bio input -->
        <b-form-group id="input-group-2" label="Votre biographie :" label-for="input-bio">
          <b-form-input id="input-bio" type="text" placeholder="Entrer une biographie" required v-model="user.bio" ></b-form-input>
        </b-form-group>

        <!-- Email input -->
        <!-- <b-form-group id="input-group-3" label="Adresse email :" label-for="input-email" >
          <b-form-input id="input-email" type="email" placeholder="Entrer votre adresse email" required v-model="user.email" ></b-form-input>
        </b-form-group> -->

        <b-button class="float-right" type="submit" variant="primary">Modifier</b-button>
      </b-form>
    </b-card>
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
          fullname: '',
          bio: '',
          // email: '',
        },
        file: '',
        imgPreview: '',
        error:''
      }
    },
    methods: {
      selectFile() {
        this.file = this.$refs.file.files[0];
        this.imgPreview = URL.createObjectURL(this.file);
      },
      async editUser() {
            var formData = new FormData();
            formData.append('file', this.file);
            formData.append('fullname', this.user.fullname);
            formData.append('bio', this.user.bio);
            // formData.append('email', this.user.email);

            try {
                let response = await axios.put("/users/me", formData);
                // console.log(response.data);

                this.$router.replace({ name: 'userProfile', params: { message: response.data.success }});
            } catch (err) {
                this.error = err.response.data.error
            }
        },
    },
    mounted () {
        axios.get("users/me").then(response => {
            this.user = response.data;
        })
    }
  };
</script>
