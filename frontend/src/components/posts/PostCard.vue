<template>
    <div>
        <!-- <router-link :to="{ name: 'showMedia', params: {mediaId: media.id } }"> -->
            <b-card
                no-body
                :img-src="post.mediaUrl"
                img-alt="Card image"
                img-bottom
                class="post_card"
            >
                <b-media class="p-3">
                    <template #aside vertical-align="center" class="mb-1">
                        <b-img :src="post.User.imgUrl" width="48" height="48" :alt="post.User.fullname" rounded></b-img>
                    </template>

                    <h5 class="mt-0 mb-0">{{ post.User.fullname }}</h5>
                    <p class="mb-0">{{ post.createdAt }}</p>

                    <p left class="mt-2 mb-0">{{ post.text }}</p>
                    
                    <!-- <b-img rounded src="https://picsum.photos/300/150/?image=41" fluid-grow alt="Fluid-grow image"></b-img> -->
                </b-media>

            </b-card>
    </div>
</template>

<script>
    export default {
        name: "PostCard",
        props: ['post']
    };
</script>

<style lang="scss" scoped>
.post_card {
    /* border: 0px!important; */
    border-radius: 9px;
    overflow: hidden;
    margin-bottom: 10px;
}
</style>
