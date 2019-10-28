import { NativeModules } from 'react-native';

class MyObject {

  constructor() {
  }

  static doNativeCrash() {
    const nm = NativeModules.TestClass;
    nm.doNativeCrash()
  }

  static doNativeException() {
    const nm = NativeModules.TestClass;
    nm.doNativeException("Hello World!")
  }

  static doJSCrash() {
    alerft("Hello World!")
  }
}

export default MyObject;
