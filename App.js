/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MyObject from './MyObject.js'
import { Platform } from 'react-native';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  NativeModules,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const extractLocation = (urlLike) => {
  // Fail-fast but return locations like "(native)"
  if (urlLike.indexOf(':') === -1) {
    return [urlLike];
  }

  var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
  return [parts[1], parts[2] || undefined, parts[3] || undefined];
};

const transmitObject = async ( object ) => {

  console.log("Transmitting", object);

  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const options = {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(object),
  };

  return fetch("https://en4z0w5kw96y4.x.pipedream.net", options)
};

const ErrorParser = {
    V8_DEBUG: /^(.*)@(\D+:\d*\D+):(\d+):(\d+)$/,
    V8_PRODUCTION: /^(\w+)@([a-z|\.]+):(\d+):(\d+)$/,

    HERMES_DEBUG: 'H_DEBUG',
    HERMES_PRODUCTION: 'H_PROD',
}

const isHermesCallStack = function() {
  const isHermes = () => global.HermesInternal != null;
  return isHermes();
};

const isHermesDebugCallStack = function() {
  return __DEV__ && Platform.OS == 'android' && isHermesCallStack();
};

const isHermesProductionCallStack = () => {
  return !__DEV__ && Platform.OS == 'android' && isHermesCallStack();
};

const isV8DebugCallStack = function() {
  return __DEV__ && Platform.OS == 'android' && ! isHermesCallStack();
};

const isV8ProductionCallStack = () => {
  return !__DEV__ && Platform.OS == 'android' && ! isHermesCallStack();
};;

const getErrorParser = function() {
  if (isV8DebugCallStack()) {
    console.log("IS V8 DEBUG");
    return ErrorParser.V8_DEBUG;
  }
  else if (isV8ProductionCallStack()) {
    console.log("IS V8 PRODUCTION");
    return ErrorParser.V8_PRODUCTION;
  }
  else {
    console.error("UNABLE TO FIND PARSING PATTERN");
  }
};

const getErrorParserName = function(parser) {
  switch(parser){
    case ErrorParser.V8_DEBUG: return "v8 debug";
    case ErrorParser.V8_PRODUCTION: return "v8 production";
  }

  return "UNKNOWN";
};

const parseError = function(error, pattern) {

  const stack = error.stack.split("\n");
  console.log(stack);
  return stack
    // For now, filter out lines that don't follow the happy path
    .filter(function(line){
      return line.indexOf("[native code]") == -1;
    })
    .map(function(line) {
      return line.match( pattern );
    })
    .filter(function(matches){
      return matches !== null;
    })
    .map(function(matches){
      console.log("Found matches: ", matches.length);
      console.log("Found matches: ", matches);

      return {
        functionName: matches[1],
        fileName: matches[2],
        lineNumber: matches[4],
        columnNumber: matches[3],
        source: matches[0],
      };
    });
};

ErrorUtils.setGlobalHandler( async function( error ) {

  const parser = getErrorParser();
  const errorStack = await parseError( error, parser );

  transmitObject({
    'parser': getErrorParserName( parser ),
    'errorStack': errorStack,
    'foo': 'bar',
    'rawStack': error.stack,
  })
  .catch( ( error ) => {
    console.error( 'Error while dealing with error: ', error );
  });
});

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <Button title="Crash with native exception" onPress={() => 
              MyObject.doNativeException()
            }></Button>
             <Button title="Crash with native error" onPress={() => 
              MyObject.doNativeCrash()
            }></Button>
            <Button title="Crash with JS Exception" onPress={() => 
              MyObject.doJSCrash()
            }></Button>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
