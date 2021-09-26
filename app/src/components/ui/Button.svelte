<script lang="ts">
  export let disabled;

</script>

<button on:click disabled='{disabled}'>
  <slot/>
</button>

<style>
  button {
    background: #d49457;
    border: none;
    border-radius: 0;
    font-size: 14px;
    font-family: monospace;
    padding: 5px 10px;
    cursor: pointer;
  }
</style>
