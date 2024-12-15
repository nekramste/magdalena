import mySound from '../assets/guitar.wav';

export default {
    compareSimpleArray(value1, value2) {
      if (value1.length !== value2.length) return false;
      for (let i = 0; i < value1.length; i += 1) {
        if (value1[i] !== value2[i]) {
          return false;
        }
      }
      return true;
    },
    propertyExists(myobject,prop){
      return Object.prototype.hasOwnProperty.call(myobject,prop);
    },
    notifyAudio(){
      const audio = new Audio(mySound);
      audio.volume = 0.2;
      audio.play();
    }
};

