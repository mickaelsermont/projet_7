<template>
    <div>
        <b-card class="mb-4">
            <b-row>
                <b-col sm="8">
                    <h4 class="mb-0">{{ user.fullname }}</h4>
                </b-col>
                <b-col sm="4">
                    <div class="float-right">
                        <router-link :to="{ name: 'updateUser', params: { userId: user.id}}">
                            <b-icon icon="gear-fill" font-scale="1.5" v-b-popover.hover.left="'Modifier mon profil'"></b-icon>
                        </router-link>

                            
                        <a href="#" v-on:click.prevent="deleteUser">
                            <b-icon
                                icon="trash-fill"
                                class="ml-3"
                                variant="danger"
                                font-scale="1.5"
                                v-b-popover.hover.bottom="'Supprimer mon compte'"
                            ></b-icon>
                        </a>
                    </div>
                </b-col>
            </b-row>
            <hr>
            <b-alert show dismissible fade variant="success" v-if="$route.params.message"> {{ $route.params.message }}</b-alert>

            <img :src="user.imgUrl" :alt="user.lastname" class="mb-3" width="400">

            <p>Bio : {{ user.bio }}</p>
            <!-- <p>Email : {{ user.email }}</p> -->
        </b-card>
    </div>
</template>

<script>
    import axios from "axios"


    export default {
        name: "UserProfile",
        components: {
            //
        },
        data () {
            return {
                user: {}
            }
        },
        methods: {
            async deleteUser() {
                
                try {
                    let response = await axios.delete("users/"+this.user.id);
                    console.log(response);

                    localStorage.clear();
                    document.location.reload(true);

                    this.$router.replace({
                        name: 'login',
                        params: { message: "Compte supprimé !"}
                    })

                } catch (err) {
                    this.error = err.response.data.error
                }
            }
        },
        mounted () {
            axios.get('users/me').then(response => {
                this.user = response.data
            })
        }
    };
</script>
