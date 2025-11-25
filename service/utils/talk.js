
export default class Talk {
  constructor(wsUrl, configs, errorCallback, messageCallback) {
    this.talk = new EasyPlayerProTalk({
      saveRtpToFile: false,
    });
    this.wsUrl = wsUrl;
    this.configs = configs;
    this.errorCallback = errorCallback;
    this.messageCallback = messageCallback;
    this._onWsMessage();
  }

  startTalk() {
    if (this.talk && this.wsUrl) {
      this.talk
        .startTalk(this.wsUrl, {
          ...this.configs,
          debug: false,
          saveRtpToFile: false,
        })
        .catch((err) => {
          if (
            !window.location.origin.startsWith('https') &&
            !window.location.hostname.includes('localhost')
          ) {
            return this.errorCallback(`浏览器不支持 HTTP 开启录音!`);
          }
          this.errorCallback('连接语音失败!');
        });
    } else {
      if (!this.talk) {
        this.errorCallback('创建语音失败，请重试!');
      }
      if (!this.wsUrl) {
        this.errorCallback('连接语音失败!');
      }
    }
  }

  stopTalk() {
    if (this.talk) {
      this.talk
        .stopTalk()
        .then(() => {
          this.talk.destroy();
        })
        .catch((e) => {
          console.error('stop talk error', e);
        });
    } else {
      console.log('jessibucaTalk is not ready');
    }
  }

  _onWsMessage() {
    this.talk.on('talkStreamMessage', (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        data = event.data;
      }
      if (data.type === 'DISCONNECT' || data.type === 'ERROR') {
        this.errorCallback(data.msg);
        return;
      }
      if (this.messageCallback) {
        this.messageCallback(data);
      }
    });

    this.talk.on('talkStreamError', () => {
      this.errorCallback('连接语音失败!');
    });
  }
}
