<template>
    <div>
        <b-row align-h="center">
            <b-col cols="8">
                <b-alert show dismissible fade variant="success" v-if="$route.params.message"> {{ $route.params.message }}</b-alert>
        
                <PostCard v-for="post in posts" :key="post.id" :post="post" class="mb-2" />
                <b-alert show variant="secondary" v-if="posts.length == null">Il n'y a aucun contenu !</b-alert>
            </b-col>
        </b-row>
        <!-- <b-row>
            <b-col sm="8">
                <h3>Forum multimédia</h3>
            </b-col>
            <b-col sm="4">
                <router-link :to="{ name: 'addMedia'}">
                    <b-button class="float-right" variant="success">Ajouter</b-button>
                </router-link>
            </b-col>
        </b-row> -->
        </div>
</template>

<script>
    import axios from "axios"
    import PostCard from '@/components/posts/PostCard'

    export default {
        name: "postsList",
        components: {
            PostCard
        },
        data () {
            return {
                posts: {}
            }
        },
        methods: {
            getPosts() {
                axios.get('posts').then(response => {
                    this.posts = response.data
                });
            }
        },
        created () {
            this.getPosts();
        }
    };
</script>
