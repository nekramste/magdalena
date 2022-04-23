<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-6">
          <div>
            <h3>Форма сообщений</h3>
            <form name="publish">
              <div class="form-group">
                <label for="message">Сообщение</label>
                <textarea v-model="chatMess" id="MessageField" name="message" class="form-control" placeholder="введите сообщение" />
              </div>          
              <input type="button" @click="send" class="btn btn-primary" value="отправить">
            </form>            
          </div>
        </div>
        <div class="col-6">
          <h3>Сообщения</h3>
          <div id="subscribe"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  var protocol = location.protocol === "https:" ? "wss:" : "ws:";
  var wsUri = protocol + "//" + window.location.host;
  var socket = new WebSocket(wsUri);
  // обработчик входящих сообщений
  socket.onmessage = function (event) {
    var incomingMessage = event.data;
    showMessage(incomingMessage);
  };
  // показать сообщение в div#subscribe
  function showMessage(message) {
    var messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    document.getElementById('subscribe').appendChild(messageElem);
  }

  export default {
    data() {
      return {
        chatMess: ''
      }
    },

    methods: {
      // отправить сообщение из формы publish
      send() {
        socket.send(this.chatMess)
        this.chatMess = ''
        return false
      }
    }
  }
</script>
<style>

</style>
