import fs = require ("fs");
import ComPort from "./comport/comport";
import { appendCRC16toArray, getCRC16 } from "./crc/crc16";
import { Settings } from "./utils/config";
import { delay } from "./utils/delay";

console.log('Start 230D20ZZ-3');

const COMx: ComPort = new ComPort(Settings.COM);

(async () => { 
  while (true) {
    try {
      await COMx.waitForOpen();
      const msg:Array<any> = await sendCmd([0x01, 0x03, 0x00,0x05, 0x00,0x01]);
      console.log(msg);
      process.exit(0);
    } catch (e) {
      await delay(1000);
      console.log('Исключение',e);
    }
  }
})();

async function sendCmd(command:Array<any>): Promise<any> {
  const cmdSource = new Uint8Array([...command]);
  const cmd: Array<number> = Array.from(appendCRC16toArray(cmdSource));
  const answer: any = await COMx.getCOMAnswer({cmd, 
                                               ChunksEndTime:1000,
                                               timeOut:3800});
  const msg: Array<number> = validateAnswer(answer);
  return msg;
}

function validateAnswer(answer: any): Array<number> | never {
  //if (!('msg' in answer)) throw new Error(`The Answer has no 'msg' field`);
  //if (getCRC16(answer.msg) != 0) throw new Error(`The Answer CRC doesn't match`);
  return answer.msg;
}
