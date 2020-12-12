<template>
    <div>
        <b-navbar toggleable="lg" class="mb-4 bg-darkblue">
            <b-container>
                <b-navbar-brand href="#">
                    <router-link :to="{ name: 'postsList'}">
                        <img src="@/assets/logos/icon-left-font-monochrome-white.svg" height="36" class="d-inline-block align-top" alt="">
                    </router-link>
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>

                    <b-navbar-nav class="ml-auto">
                        <template v-if="authentificated">
                            <b-nav-item>
                                <router-link :to="{ name: 'addPost'}">
                                    <b-icon icon="plus-circle" font-scale="1.5" v-b-popover.hover.left="'Ajouter une publication'"></b-icon>
                                </router-link>
                            </b-nav-item>
                            <b-nav-item>
                                <router-link :to="{ name: 'userProfile'}">
                                    <b-icon icon="person-fill" font-scale="1.5" v-b-popover.hover.bottom="user.fullname"></b-icon>
                                </router-link>
                            </b-nav-item>
                            <b-nav-item @click.prevent="signOut">
                                <b-icon icon="box-arrow-right" font-scale="1.5" v-b-popover.hover.right="'Deconnexion'"></b-icon>
                            </b-nav-item>
                        </template>

                        <template v-else>
                            <b-nav-item href="#">
                                <router-link :to="{ name: 'login'}">Connexion</router-link>
                            </b-nav-item>
                            <b-nav-item href="#">
                                <router-link :to="{ name: 'register'}">Inscription</router-link>
                            </b-nav-item>
                        </template>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>                
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                authentificated: 'auth/authentificated',
                user: 'auth/user'
            })
        },

        methods: {
            ...mapActions({
                signOutAction: 'auth/signOut'
            }),

            signOut () {
                this.signOutAction().then(() => {
                    this.$router.replace({
                        name: 'login',
                        params: { message: "Vous êtes déconnecté !"}
                    })
                })
            }
        }

    }
</script>

<style>
    .nav-item a {
        color: #fff!important;
        text-transform: capitalize;
        /* text-decoration: none; */
    }
    .bg-darkblue {
        background-color: rgb(35, 49, 75)!important;
    }
</style>