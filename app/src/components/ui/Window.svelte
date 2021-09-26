<script lang="ts">
  export let header = '';
</script>
<div class="box">
  <header>{header}</header>
  <div class="container">
    <slot/>
  </div>
</div>

<style>
  .box {
    border: 1px solid #d49457;
    background: #2f2f2f;
    /*border-radius: 5px;*/
    margin: 0 auto;
    width: 600px;
  }

  header {
    text-align: left;
    font-size: 1.5rem;
    padding: 1rem 1rem 1rem 20px;
    /*background: rgb(0, 204, 0);*/
    border-bottom: 1px solid #d49457;
    color: #d49457;
  }

  .container {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
</style>
