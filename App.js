/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MyObject from './MyObject.js'

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

const transmitErrorStack = async ( stack ) => {

  console.log("Transmitting", stack);

  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const options = {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(stack),
  };

  return fetch("https://en4z0w5kw96y4.x.pipedream.net", options)
};


const parseErrorStack = async ( error ) => {

  console.log("\n\n\n----------");

  console.log("Error: ", error);
  console.log("Stack: ", error.stack);

  const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;

  let rawStack = error.stack.split('\n');

  if (isHermesCallStack(rawStack)) {
    return parseHermesCallStack(rawStack);
  }
  else {
    console.log("NOT HERMES");
  }

  console.error("SHOULD NOT BE HERE");

  console.log("Filtered Lines:", filtered);

  return filtered.map(function(line) {
    
    if (line.indexOf('(eval ') > -1) {
      // Throw away eval information until we implement stacktrace.js/stackframe#8
      line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
    }
    
    var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');

    // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
    // case it has spaces in it, as the string is split on \s+ later on
    var location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

    // remove the parenthesized location from the line, if it was matched
    sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

    var tokens = sanitizedLine.split(/\s+/).slice(1);
    // if a location was matched, pass it to extractLocation() otherwise pop the last token
    var locationParts = extractLocation(location ? location[1] : tokens.pop());
    var functionName = tokens.join(' ') || undefined;
    var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

    console.log(functionName, fileName, locationParts[1], locationParts[2], line);

    return {
      functionName: functionName,
      fileName: fileName,
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line,
    };
  }, this);
};

const HERMES_ERROR_PATTERN = /^(.*)@(\D+:\d*\D+):(\d+):(\d+)$/;

const isHermesCallStack = function(stack) {

  const isHermes = () => global.HermesInternal != null;
  return isHermes;

  // return stack.filter(function(line) {
  //   return !!line.match(HERMES_ERROR_PATTERN);
  // }, this).length > 0;
};

const parseHermesCallStack = function(stack) {

  console.log("PARSING HERMES");

  return stack
    // For now, filter out lines that don't follow the happy path
    .filter(function(line){
      return line.indexOf("[native code]") == -1;
    })
    .map(function(line) {
      return line.match( HERMES_ERROR_PATTERN );
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

ErrorUtils.setGlobalHandler( function( error ) {
  parseErrorStack( error )
    .then( transmitErrorStack )
    .catch( ( error ) => {
      console.error( 'Error while dealing with error: ', error );
    });
} );

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
