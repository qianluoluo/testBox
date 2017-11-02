<template>
	<div class="wrap">
		<nav class="navBar">{{ msg }}</nav>
		<button @click="handleTest()">测试问题</button>
	</div>
</template>
<script>
	export default{
		data() {
			return {
				msg: '我就是试试'
			}
		},
		methods: {
			handleTest: function(){
				alert('success');
			}
		}
	}
</script>
<style lang='scss' scoped>
	$themeColor: #0cc;
	$fontColor: #000;
	.wrap{
		width: 500px;
		height: 500px;
		background-color: $themeColor;
		button{
			color: $fontColor;
			width: 80px;
			background-color: $themeColor;
		}
	}

</style>