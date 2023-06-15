<template>
    <div id="app">
        <router-view v-wechat-title="$route.meta.title"></router-view>
    </div>
</template>

<script>
export default {

};
</script>

<style>
*{
    margin: 0;
    padding: 0;
    list-style: none;
}
html,body,#app{
    height: 100%;
}


</style>
