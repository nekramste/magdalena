<template>
  <div>
    <div class="container">
      <div class="row">
        <!--<div class="col-6">
    <div>
      <h3>Messages</h3>
      <form name="publish">
        <div class="form-group">
          <label for="message">Message</label>
          <textarea v-model="chatMess" id="MessageField" name="message" class="form-control" placeholder="Enter your message" />
        </div>
        <input type="button" @click="send" class="btn btn-primary" value="Send">
      </form>
    </div>
  </div>-->
        <div class="col-12">
          <h3>History</h3>
          <div id="subscribe"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  var protocol = location.protocol === "https:" ? "wss:" : "ws:";
  var wsUri = protocol + "//" + window.location.host+'/scores';
  var socket = new WebSocket(wsUri);
  // incoming message handler
  socket.onmessage = function (event) {
    var incomingMessage = event.data;
    showMessage(incomingMessage);
  };
  // показать сообщение в div#subscribe
  function showMessage(message) {
    console.log(message);
    var messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(JSON.stringify(message)));
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
