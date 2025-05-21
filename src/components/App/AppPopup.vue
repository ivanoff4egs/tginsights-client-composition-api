<script>

export default {
  props: {
    title: {type: String, required: true},
    show: {type: Boolean, required: true},
    showSaveButton: {type: Boolean, default: true},
    saveButtonText: {type: String, default: 'Save changes'},
  },
  emits: ['closeModal', 'submitForm'],
}

</script>

<template>

  <div class="modal" tabindex="-1" role="dialog" :class="{'show': show}">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="close" @click="$emit('closeModal')" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot/>
        </div>
        <div class="modal-footer">
          <button
              v-if="showSaveButton"
              type="button"
              class="btn btn-dark modal-save"
              @click="$emit('submitForm')"
          >{{ saveButtonText }}</button>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>
  .show {
    display: block !important;
  }

  .modal-dialog {
    max-width: 40% !important;
  }

  .modal-save:hover {
    color: white;
    background-color: var(--active-link-color);
    border-color: var(--active-link-color);
  }

</style>