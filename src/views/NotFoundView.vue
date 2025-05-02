<template>
  <div class="container">
      <div class="row">
          <div class="col-md-12">
              <div class="error-template">
                  <h1>
                      Oops!</h1>
                  <h2>
                      404 Not Found</h2>
                  <div class="error-details">
                      Sorry, an error has occurred, requested page is not found!
                  </div>
                  <div class="error-actions">
                      <RouterLink :to="{name: 'home'}" class="btn btn-dark btn-lg"><span class="glyphicon glyphicon-home"></span>
                          Take Me Home
                      </RouterLink>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<style scoped>
  .error-template {padding: 40px 15px;text-align: center;}
  .error-actions {margin-top:15px;margin-bottom:15px;}
  .error-actions .btn {margin-right:10px;}
</style>
