<template>
    <div>
        <!-- <router-link :to="{ name: 'showMedia', params: {mediaId: media.id } }"> -->
            <b-card>
                <b-media>
                    <template v-slot:aside>
                        <b-img :src="post.User.imgUrl" width="64" :alt="post.User.fullname"></b-img>
                    </template>

                    <h5 class="mt-0">{{ post.User.fullname }}</h5>
                    <p>{{ post.text }}</p>
                    <b-img :src="post.mediaUrl" fluid alt=""></b-img>
                </b-media>
            </b-card>
        <!-- </router-link> -->
    </div>
</template>

<script>
    export default {
        name: "PostCard",
        props: ['post']
    };
</script>
